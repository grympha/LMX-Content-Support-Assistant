#!/usr/bin/env node
/**
 * Training events retention cleanup
 *
 * Deletes expired training_events rows according to per-event-type retention rules.
 * topic_completed rows are never deleted.
 *
 * Usage:
 *   npm run training-retention -- --dry-run   (report only, no deletes)
 *   npm run training-retention                (live delete)
 *
 * DATABASE_URL is read from .env.local, then .env, then the system environment.
 */

import * as fs from "node:fs";
import * as path from "node:path";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { and, eq, lt, count } from "drizzle-orm";
import { trainingEvents } from "../src/lib/schema";

// ---------------------------------------------------------------------------
// Env loading
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
// CLI
// ---------------------------------------------------------------------------

const isDryRun = process.argv.includes("--dry-run");

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("ERROR: DATABASE_URL is not set. Add it to .env.local or export it before running.");
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Retention policy
// topic_completed is not listed here — those rows are retained forever.
// ---------------------------------------------------------------------------

const RETENTION_MONTHS: Record<string, number> = {
  login: 6,
  topic_selected: 12,
  quick_answer_selected: 12,
  question_asked: 24,
};

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log(`\n🧹 LMX Content — Training Events Retention Cleanup`);
  console.log(`   Mode: ${isDryRun ? "DRY RUN (no deletes)" : "LIVE"}\n`);

  const sqlClient = neon(DATABASE_URL!);
  const db = drizzle(sqlClient, { schema: { trainingEvents } });

  const now = new Date();

  let totalScanned = 0;
  let totalEligible = 0;
  let totalDeleted = 0;

  for (const [eventType, retentionMonths] of Object.entries(RETENTION_MONTHS)) {
    const cutoff = new Date(now);
    cutoff.setMonth(cutoff.getMonth() - retentionMonths);

    // Count eligible rows
    const [{ n: eligible }] = await db
      .select({ n: count() })
      .from(trainingEvents)
      .where(and(eq(trainingEvents.eventType, eventType), lt(trainingEvents.loggedAt, cutoff)));

    // Count total rows for this type
    const [{ n: total }] = await db
      .select({ n: count() })
      .from(trainingEvents)
      .where(eq(trainingEvents.eventType, eventType));

    const eligibleNum = Number(eligible);
    const totalNum = Number(total);

    console.log(
      `  ${eventType.padEnd(24)} retention: ${String(retentionMonths).padStart(2)}mo  ` +
        `total: ${String(totalNum).padStart(5)}  eligible: ${String(eligibleNum).padStart(5)}  ` +
        `cutoff: ${cutoff.toISOString().slice(0, 10)}`
    );

    totalScanned += totalNum;
    totalEligible += eligibleNum;

    if (!isDryRun && eligibleNum > 0) {
      await db
        .delete(trainingEvents)
        .where(and(eq(trainingEvents.eventType, eventType), lt(trainingEvents.loggedAt, cutoff)));
      totalDeleted += eligibleNum;
    }
  }

  // Count topic_completed (retained forever — informational only)
  const [{ n: retained }] = await db
    .select({ n: count() })
    .from(trainingEvents)
    .where(eq(trainingEvents.eventType, "topic_completed"));

  console.log(
    `  ${"topic_completed".padEnd(24)} retention: ∞      ` +
      `total: ${String(Number(retained)).padStart(5)}  eligible:     0  (never deleted)`
  );

  totalScanned += Number(retained);

  console.log(`\n════════════════════════════════════════`);
  console.log(`  Retention Cleanup Summary`);
  console.log(`════════════════════════════════════════`);
  console.log(`  Rows scanned    : ${totalScanned}`);
  console.log(`  Rows eligible   : ${totalEligible}`);
  console.log(
    isDryRun
      ? `  Rows deleted    : 0 (dry run)`
      : `  Rows deleted    : ${totalDeleted}`
  );
  console.log(`════════════════════════════════════════\n`);

  if (isDryRun && totalEligible > 0) {
    console.log(`Re-run without --dry-run to delete ${totalEligible} eligible row(s).`);
  } else if (!isDryRun && totalDeleted === 0) {
    console.log(`Nothing to delete — all rows are within retention window.`);
  }
}

main().catch((err) => {
  console.error("Unhandled error:", err);
  process.exit(1);
});
