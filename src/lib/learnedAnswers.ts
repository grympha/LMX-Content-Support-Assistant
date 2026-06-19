import { and, eq, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { learnedAnswers } from "@/lib/schema";

export function normalizeQuestion(question: string): string {
  return question
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export async function findApprovedLearnedAnswer(
  normalizedQ: string
): Promise<{ id: string; response: string } | null> {
  if (!db || !normalizedQ) return null;
  try {
    const rows = await db
      .select({ id: learnedAnswers.id, response: learnedAnswers.response })
      .from(learnedAnswers)
      .where(
        and(
          eq(learnedAnswers.normalizedQuestion, normalizedQ),
          eq(learnedAnswers.status, "approved")
        )
      )
      .limit(1);
    return rows[0] ?? null;
  } catch {
    return null;
  }
}

export async function incrementLearnedAnswerReuse(id: string): Promise<void> {
  if (!db) return;
  try {
    await db
      .update(learnedAnswers)
      .set({
        reusedCount: sql`${learnedAnswers.reusedCount} + 1`,
        updatedAt: new Date(),
      })
      .where(eq(learnedAnswers.id, id));
  } catch {
    // fire-and-forget — non-critical
  }
}

export async function upsertLearnedAnswerCandidate(opts: {
  question: string;
  response: string;
  feedbackId: string | undefined;
  username: string;
}): Promise<void> {
  if (!db || !opts.question || !opts.response) return;
  const normalized = normalizeQuestion(opts.question);
  if (!normalized) return;
  try {
    await db
      .insert(learnedAnswers)
      .values({
        normalizedQuestion: normalized,
        originalQuestion: opts.question.slice(0, 10000),
        response: opts.response.slice(0, 50000),
        feedbackId: opts.feedbackId ?? undefined,
        username: opts.username,
        status: "candidate",
      })
      .onConflictDoNothing();
  } catch (err) {
    console.error("[upsertLearnedAnswerCandidate]", err);
  }
}
