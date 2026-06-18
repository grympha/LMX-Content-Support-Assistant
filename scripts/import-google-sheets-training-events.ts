#!/usr/bin/env node
/**
 * One-time import: Google Sheets training history → Neon training_events
 *
 * Usage:
 *   npm run import:training-events -- <path/to/export.csv> [--dry-run]
 *
 * DATABASE_URL is read from .env.local, then .env, then the system environment.
 */

import * as fs from "node:fs";
import * as path from "node:path";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { trainingEvents, userProgress } from "../src/lib/schema";

// ---------------------------------------------------------------------------
// Env loading (avoids dotenv dependency)
// ---------------------------------------------------------------------------

function loadEnvFile(filePath: string) {
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    for (const line of content.split("\n")) {
      const match = line.match(/^([A-Z_][A-Z0-9_]*)\s*=\s*(.*)$/);
      if (!match) continue;
      const [, key, rawVal] = match;
      if (!process.env[key]) {
        process.env[key] = rawVal.replace(/^['"]|['"]$/g, "").trim();
      }
    }
  } catch {
    // File not found — skip
  }
}

const projectRoot = process.cwd();
loadEnvFile(path.join(projectRoot, ".env.local"));
loadEnvFile(path.join(projectRoot, ".env"));

// ---------------------------------------------------------------------------
// CLI argument parsing
// ---------------------------------------------------------------------------

const args = process.argv.slice(2);
const csvPath = args.find((a) => !a.startsWith("--"));
const isDryRun = args.includes("--dry-run");

if (!csvPath) {
  console.error(
    "Usage: npm run import:training-events -- <path/to/export.csv> [--dry-run]"
  );
  process.exit(1);
}

const resolvedCsvPath = path.resolve(process.cwd(), csvPath);
if (!fs.existsSync(resolvedCsvPath)) {
  console.error(`ERROR: File not found: ${resolvedCsvPath}`);
  process.exit(1);
}

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL && !isDryRun) {
  console.error(
    "ERROR: DATABASE_URL is not set. Add it to .env.local or export it before running."
  );
  process.exit(1);
}

// ---------------------------------------------------------------------------
// CSV parser (handles Google Sheets exported CSV)
// ---------------------------------------------------------------------------

function parseCSV(content: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  let i = 0;

  while (i < content.length) {
    const ch = content[i];

    if (inQuotes) {
      if (ch === '"' && content[i + 1] === '"') {
        field += '"';
        i += 2;
      } else if (ch === '"') {
        inQuotes = false;
        i++;
      } else {
        field += ch;
        i++;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
        i++;
      } else if (ch === ",") {
        row.push(field);
        field = "";
        i++;
      } else if (ch === "\r" || ch === "\n") {
        if (ch === "\r" && content[i + 1] === "\n") i++;
        row.push(field);
        if (row.some((f) => f.trim())) rows.push(row);
        row = [];
        field = "";
        i++;
      } else {
        field += ch;
        i++;
      }
    }
  }

  if (row.length > 0) {
    row.push(field);
    if (row.some((f) => f.trim())) rows.push(row);
  }

  return rows;
}

// ---------------------------------------------------------------------------
// Header mapping (flexible — handles camelCase, snake_case, sentence case)
// ---------------------------------------------------------------------------

const HEADER_MAP: Record<string, string> = {
  timestamp: "timestamp",
  date: "timestamp",
  datetime: "timestamp",
  timezone: "timezone",
  tz: "timezone",
  username: "username",
  user: "username",
  user_name: "username",
  full_name: "fullName",
  fullname: "fullName",
  name: "fullName",
  event_type: "eventType",
  eventtype: "eventType",
  event: "eventType",
  type: "eventType",
  topic: "topic",
  question: "question",
  progress_percent: "progressPercent",
  progresspercent: "progressPercent",
  progress: "progressPercent",
  completed_topics: "completedTopics",
  completedtopics: "completedTopics",
  source: "source",
  details: "details",
  detail: "details",
};

function normalizeHeader(h: string): string {
  return h.trim().toLowerCase().replace(/[\s\-]+/g, "_");
}

// ---------------------------------------------------------------------------
// Field normalizers
// ---------------------------------------------------------------------------

const VALID_EVENT_TYPES = new Set([
  "login",
  "topic_selected",
  "topic_completed",
  "question_asked",
  "quick_answer_selected",
]);

function parseMalaysiaTimestamp(ts: string): Date | null {
  const cleaned = ts.trim();
  if (!cleaned) return null;

  // Primary: DD/MM/YYYY, HH:MM:SS (Malaysia Intl.DateTimeFormat en-MY output)
  const myMatch = cleaned.match(
    /^(\d{1,2})\/(\d{1,2})\/(\d{4}),?\s+(\d{1,2}):(\d{2})(?::(\d{2}))?/
  );
  if (myMatch) {
    const [, day, month, year, hour, minute, second = "0"] = myMatch;
    // Malaysia = UTC+8; subtract 8 hours to get UTC
    return new Date(
      Date.UTC(
        Number(year),
        Number(month) - 1,
        Number(day),
        Number(hour) - 8,
        Number(minute),
        Number(second)
      )
    );
  }

  // Fallback: ISO or any JS-parseable format
  const fallback = new Date(cleaned);
  return isNaN(fallback.getTime()) ? null : fallback;
}

function parseCompletedTopics(value: string | undefined): string[] {
  if (!value || !value.trim()) return [];
  const v = value.trim();

  // JSON array: ["A","B"]
  if (v.startsWith("[")) {
    try {
      const parsed = JSON.parse(v);
      if (Array.isArray(parsed)) return parsed.map(String).filter(Boolean);
    } catch {
      // fall through
    }
  }

  // Semicolon-separated
  if (v.includes(";")) return v.split(";").map((s) => s.trim()).filter(Boolean);

  // Comma-separated
  if (v.includes(",")) return v.split(",").map((s) => s.trim()).filter(Boolean);

  return [v];
}

function parseProgressPercent(value: string | undefined): string | null {
  if (!value || !value.trim()) return null;
  const stripped = value.trim().replace(/%$/, "");
  const num = Number(stripped);
  return isFinite(num) && !isNaN(num) ? String(num) : null;
}

function clean(v: string | undefined): string | null {
  if (v === undefined) return null;
  const t = v.trim();
  return t === "" ? null : t;
}

// ---------------------------------------------------------------------------
// Dedup key
// ---------------------------------------------------------------------------

function makeDupKey(
  username: string,
  eventType: string,
  topic: string | null | undefined,
  question: string | null | undefined,
  loggedAt: Date,
  source: string | null | undefined
): string {
  const minuteTs = Math.floor(loggedAt.getTime() / 60_000);
  const qFrag = (question ?? "").substring(0, 50).toLowerCase().trim();
  return [
    username.toLowerCase().trim(),
    eventType.toLowerCase().trim(),
    (topic ?? "").toLowerCase().trim(),
    qFrag,
    minuteTs,
    (source ?? "").toLowerCase().trim(),
  ].join("||");
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

interface NormalizedRow {
  timestamp: Date;
  username: string;
  fullName: string | null;
  eventType: string;
  topic: string | null;
  question: string | null;
  progressPercent: string | null;
  completedTopics: string[];
  source: string | null;
  details: string | null;
}

async function main() {
  console.log(`\n📋 LMX Content — Google Sheets → Neon Training Events Import`);
  console.log(`   CSV: ${resolvedCsvPath}`);
  console.log(`   Mode: ${isDryRun ? "DRY RUN (no writes)" : "LIVE"}\n`);

  // ---------- Parse CSV ----------
  const csvContent = fs.readFileSync(resolvedCsvPath, "utf-8");
  const allRows = parseCSV(csvContent);

  if (allRows.length < 2) {
    console.error("ERROR: CSV has no data rows (need at least a header row + one data row).");
    process.exit(1);
  }

  const rawHeaders = allRows[0];
  const dataRows = allRows.slice(1);

  // Map column index → internal field name
  const colIndex: Record<string, number> = {};
  for (let i = 0; i < rawHeaders.length; i++) {
    const normalized = normalizeHeader(rawHeaders[i]);
    const fieldName = HEADER_MAP[normalized];
    if (fieldName && !(fieldName in colIndex)) {
      colIndex[fieldName] = i;
    }
  }

  console.log(`   Headers found: ${rawHeaders.map((h) => h.trim()).join(" | ")}`);
  console.log(
    `   Mapped fields: ${Object.entries(colIndex)
      .map(([k, v]) => `${k}→col${v}`)
      .join(", ")}\n`
  );

  if (!("timestamp" in colIndex) || !("eventType" in colIndex) || !("username" in colIndex)) {
    console.error(
      "ERROR: CSV must have columns for Timestamp, Event Type, and Username.\n" +
        "       Verify the header row matches expected column names."
    );
    process.exit(1);
  }

  // ---------- Normalize rows ----------
  const normalized: NormalizedRow[] = [];
  let parseErrors = 0;
  let columnShiftWarnings = 0;

  const get = (row: string[], field: string): string | undefined =>
    colIndex[field] !== undefined ? row[colIndex[field]] : undefined;

  for (let i = 0; i < dataRows.length; i++) {
    const row = dataRows[i];
    const lineNum = i + 2; // 1-based, accounting for header row

    const rawTimestamp = get(row, "timestamp") ?? "";
    const rawUsername = get(row, "username") ?? "";
    const rawEventType = get(row, "eventType") ?? "";

    const timestamp = parseMalaysiaTimestamp(rawTimestamp);
    const username = rawUsername.trim();
    const eventType = rawEventType.trim().toLowerCase().replace(/\s+/g, "_");

    if (!timestamp) {
      console.warn(`   [row ${lineNum}] SKIP — cannot parse timestamp: "${rawTimestamp}"`);
      parseErrors++;
      continue;
    }
    if (!username) {
      console.warn(`   [row ${lineNum}] SKIP — empty username`);
      parseErrors++;
      continue;
    }
    if (!eventType || !VALID_EVENT_TYPES.has(eventType)) {
      // Detect column shift: if topic looks like an event type, warn
      const rawTopic = get(row, "topic") ?? "";
      if (VALID_EVENT_TYPES.has(rawTopic.trim().toLowerCase())) {
        columnShiftWarnings++;
        if (columnShiftWarnings <= 3) {
          console.warn(
            `   [row ${lineNum}] WARN — possible column shift detected. ` +
              `"topic" field contains "${rawTopic}" which looks like an event type. ` +
              `Verify CSV headers match column order.`
          );
        }
      } else {
        console.warn(
          `   [row ${lineNum}] SKIP — unrecognised event_type: "${rawEventType}"`
        );
      }
      parseErrors++;
      continue;
    }

    normalized.push({
      timestamp,
      username,
      fullName: clean(get(row, "fullName")),
      eventType,
      topic: clean(get(row, "topic")),
      question: clean(get(row, "question")),
      progressPercent: parseProgressPercent(get(row, "progressPercent")),
      completedTopics: parseCompletedTopics(get(row, "completedTopics")),
      source: clean(get(row, "source")),
      details: clean(get(row, "details")),
    });
  }

  if (columnShiftWarnings > 3) {
    console.warn(
      `   ... and ${columnShiftWarnings - 3} more column-shift warnings. ` +
        `Run with the Google Sheets tab that has proper headers.`
    );
  }

  console.log(
    `   Parsed: ${normalized.length} valid rows, ${parseErrors} skipped (bad timestamp / event type / username)\n`
  );

  if (normalized.length === 0) {
    console.log("Nothing to import.");
    process.exit(0);
  }

  // ---------- Dry-run summary ----------
  if (isDryRun) {
    const eventTypeCounts: Record<string, number> = {};
    for (const r of normalized) {
      eventTypeCounts[r.eventType] = (eventTypeCounts[r.eventType] ?? 0) + 1;
    }

    console.log("DRY RUN — no writes performed.\n");
    console.log(`Rows that WOULD be processed: ${normalized.length}`);
    for (const [et, count] of Object.entries(eventTypeCounts)) {
      console.log(`  ${et}: ${count}`);
    }
    const uniqueUsers = new Set(normalized.map((r) => r.username));
    console.log(`Unique users: ${uniqueUsers.size} (${[...uniqueUsers].join(", ")})`);
    console.log(`\nRe-run without --dry-run to perform the real import.`);
    process.exit(0);
  }

  // ---------- Connect to Neon ----------
  const sqlClient = neon(DATABASE_URL!);
  const db = drizzle(sqlClient, { schema: { trainingEvents, userProgress } });

  // ---------- Load existing records for dedup ----------
  console.log("Loading existing training_events for duplicate detection...");
  let existingRows: {
    username: string;
    eventType: string;
    topic: string | null;
    question: string | null;
    loggedAt: Date;
    source: string | null;
  }[] = [];

  try {
    existingRows = await db
      .select({
        username: trainingEvents.username,
        eventType: trainingEvents.eventType,
        topic: trainingEvents.topic,
        question: trainingEvents.question,
        loggedAt: trainingEvents.loggedAt,
        source: trainingEvents.source,
      })
      .from(trainingEvents);
    console.log(`   ${existingRows.length} existing rows loaded.\n`);
  } catch (err) {
    console.error(
      "ERROR: Could not query training_events. Has the Phase 1 SQL migration been run?\n",
      err
    );
    process.exit(1);
  }

  const seenKeys = new Set<string>(
    existingRows.map((r) =>
      makeDupKey(r.username, r.eventType, r.topic, r.question, r.loggedAt, r.source)
    )
  );

  // ---------- Dedup + prepare insert list ----------
  const toInsert: NormalizedRow[] = [];
  let duplicateCount = 0;

  for (const row of normalized) {
    const key = makeDupKey(
      row.username,
      row.eventType,
      row.topic,
      row.question,
      row.timestamp,
      row.source
    );
    if (seenKeys.has(key)) {
      duplicateCount++;
    } else {
      toInsert.push(row);
      seenKeys.add(key); // prevent intra-batch duplicates
    }
  }

  console.log(`   Rows to insert: ${toInsert.length}`);
  console.log(`   Duplicates skipped: ${duplicateCount}\n`);

  if (toInsert.length === 0) {
    console.log("All rows already exist in Neon. Nothing to insert.");
    await printFinalCounts(db);
    process.exit(0);
  }

  // ---------- Batch insert training_events ----------
  const BATCH_SIZE = 100;
  let insertedCount = 0;
  let insertErrors = 0;

  console.log(`Inserting ${toInsert.length} rows in batches of ${BATCH_SIZE}...`);

  for (let i = 0; i < toInsert.length; i += BATCH_SIZE) {
    const batch = toInsert.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(toInsert.length / BATCH_SIZE);

    try {
      await db.insert(trainingEvents).values(
        batch.map((r) => ({
          eventType: r.eventType,
          username: r.username,
          fullName: r.fullName ?? undefined,
          topic: r.topic ?? undefined,
          question: r.question ?? undefined,
          progressPercent: r.progressPercent ?? undefined,
          completedTopics: r.completedTopics.length > 0 ? r.completedTopics : undefined,
          source: r.source ?? undefined,
          details: r.details ?? undefined,
          loggedAt: r.timestamp,
        }))
      );
      insertedCount += batch.length;
      process.stdout.write(`   Batch ${batchNum}/${totalBatches} — ${insertedCount} rows inserted\r`);
    } catch (err) {
      console.error(`\n   ERROR in batch ${batchNum}:`, err);
      insertErrors += batch.length;
    }
  }

  console.log(`\n   ✓ Inserted ${insertedCount} rows (${insertErrors} errors)\n`);

  // ---------- Upsert user_progress ----------
  // Collect the best topic_completed event per user (highest progress)
  const userBest = new Map<
    string,
    { fullName: string | null; pct: number; topics: string[]; loggedAt: Date }
  >();

  for (const row of toInsert) {
    if (row.eventType !== "topic_completed") continue;
    const pct = row.progressPercent ? Number(row.progressPercent) : 0;
    const existing = userBest.get(row.username);
    if (!existing || pct > existing.pct) {
      userBest.set(row.username, {
        fullName: row.fullName,
        pct,
        topics: row.completedTopics,
        loggedAt: row.timestamp,
      });
    }
  }

  let upInserted = 0;
  let upSkipped = 0;

  if (userBest.size > 0) {
    console.log(`Upserting user_progress for ${userBest.size} user(s)...`);
    const now = new Date();

    for (const [username, best] of userBest.entries()) {
      try {
        const result = await db
          .insert(userProgress)
          .values({
            username,
            fullName: best.fullName ?? undefined,
            completedTopics: best.topics,
            progressPercent: String(best.pct),
            lastActiveAt: best.loggedAt,
            updatedAt: now,
          })
          .onConflictDoNothing(); // Phase 2 live data takes precedence

        // onConflictDoNothing returns rowCount; if 0 → conflict (existing row kept)
        const affected =
          (result as unknown as { rowCount?: number })?.rowCount ?? 1;
        if (affected === 0) {
          upSkipped++;
        } else {
          upInserted++;
        }
      } catch (err) {
        console.error(`   ERROR upserting user_progress for "${username}":`, err);
      }
    }

    console.log(
      `   ✓ user_progress: ${upInserted} inserted, ${upSkipped} skipped (existing Phase 2 record preserved)\n`
    );
  }

  // ---------- Final summary ----------
  console.log("═══════════════════════════════════════");
  console.log("  Import Summary");
  console.log("═══════════════════════════════════════");
  console.log(`  CSV rows read        : ${dataRows.length}`);
  console.log(`  Rows normalised      : ${normalized.length}`);
  console.log(`  Parse errors/skipped : ${parseErrors}`);
  console.log(`  Duplicates skipped   : ${duplicateCount}`);
  console.log(`  Rows inserted        : ${insertedCount}`);
  console.log(`  Insert errors        : ${insertErrors}`);
  console.log(`  Users updated        : ${upInserted}`);
  console.log(`  Users unchanged      : ${upSkipped}`);
  console.log("═══════════════════════════════════════\n");

  await printFinalCounts(db);
}

async function printFinalCounts(db: ReturnType<typeof drizzle>) {
  try {
    // Use raw neon client to avoid complex Drizzle count typing
    const sqlClient = neon(DATABASE_URL!);
    const [row] = await sqlClient`SELECT COUNT(*)::int AS n FROM training_events`;
    console.log(`Neon training_events total: ${(row as { n: number }).n} rows`);
  } catch {
    // Not critical
  }
}

main().catch((err) => {
  console.error("Unhandled error:", err);
  process.exit(1);
});
