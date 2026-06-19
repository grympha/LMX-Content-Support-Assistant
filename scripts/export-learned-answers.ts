#!/usr/bin/env node
/**
 * Export approved learned answers to knowledge/learned/*.md
 *
 * Usage:
 *   npx tsx scripts/export-learned-answers.ts
 *
 * Requires DATABASE_URL in .env.local or .env.
 * Writes one markdown file per approved learned answer under knowledge/learned/.
 * Safe to run repeatedly — existing files are overwritten with the latest approved response.
 */

import * as fs from "node:fs";
import * as path from "node:path";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import { learnedAnswers } from "../src/lib/schema";

// ─── Env loading ─────────────────────────────────────────────────────────────

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

// ─── Main ─────────────────────────────────────────────────────────────────────

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("DATABASE_URL is not set. Aborting.");
  process.exit(1);
}

const sql = neon(DATABASE_URL);
const db = drizzle(sql);

async function run() {
  const rows = await db
    .select()
    .from(learnedAnswers)
    .where(eq(learnedAnswers.status, "approved"));

  if (rows.length === 0) {
    console.log("No approved learned answers found.");
    return;
  }

  const outDir = path.join(projectRoot, "knowledge", "learned");
  fs.mkdirSync(outDir, { recursive: true });

  let written = 0;
  for (const row of rows) {
    const slug = row.normalizedQuestion
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .slice(0, 80);

    if (!slug) continue;

    const filename = `${slug}.md`;
    const approvedAt = row.approvedAt
      ? new Date(row.approvedAt).toISOString().slice(0, 10)
      : new Date(row.updatedAt).toISOString().slice(0, 10);

    const content = `---
id: "${row.id}"
source: "learned_answer"
status: "approved"
normalized_question: "${row.normalizedQuestion.replace(/"/g, '\\"')}"
approved_by: "${row.approvedBy ?? "admin"}"
approved_at: "${approvedAt}"
reused_count: ${row.reusedCount}
---

# ${row.originalQuestion}

${row.response}
`;

    fs.writeFileSync(path.join(outDir, filename), content, "utf8");
    written++;
    console.log(`  Wrote: knowledge/learned/${filename}`);
  }

  console.log(`\nExported ${written} approved learned answer(s) to knowledge/learned/`);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
