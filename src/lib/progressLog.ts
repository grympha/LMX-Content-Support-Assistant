import { db } from "@/lib/db";
import { trainingEvents, userProgress } from "@/lib/schema";

export type ProgressEvent = {
  eventType: "login" | "topic_selected" | "topic_completed" | "question_asked" | "quick_answer_selected" | "workflow_started";
  username?: string;
  fullName?: string;
  topic?: string;
  question?: string;
  progressPercent?: number;
  completedTopics?: string[];
  source?: string;
  details?: string;
};

async function writeToNeon(event: ProgressEvent): Promise<void> {
  if (!db) return;

  // Always store username in lowercase to prevent duplicate records from casing differences
  const username = (event.username ?? "").toLowerCase();
  const pctStr = event.progressPercent != null ? String(event.progressPercent) : undefined;

  try {
    await db.insert(trainingEvents).values({
      eventType: event.eventType,
      username,
      fullName: event.fullName,
      topic: event.topic,
      question: event.question,
      progressPercent: pctStr,
      completedTopics: event.completedTopics,
      source: event.source,
      details: event.details,
    });
  } catch (error) {
    console.error("[progressLog] Neon write failed (training_events)", error);
    return;
  }

  if (event.eventType !== "topic_completed" || !username) return;

  const now = new Date();
  const completedTopics = event.completedTopics ?? [];

  try {
    await db
      .insert(userProgress)
      .values({
        username,
        fullName: event.fullName,
        completedTopics,
        progressPercent: pctStr ?? "0",
        lastActiveAt: now,
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: userProgress.username,
        set: {
          completedTopics,
          progressPercent: pctStr ?? "0",
          ...(event.fullName !== undefined ? { fullName: event.fullName } : {}),
          lastActiveAt: now,
          updatedAt: now,
        },
      });
  } catch (error) {
    console.error("[progressLog] Neon write failed (user_progress)", error);
  }
}

export async function logProgressEvent(event: ProgressEvent) {
  await writeToNeon(event);
}
