import { db } from "@/lib/db";
import { trainingEvents, userProgress } from "@/lib/schema";

export type ProgressEvent = {
  eventType: "login" | "topic_selected" | "topic_completed" | "question_asked" | "quick_answer_selected";
  username?: string;
  fullName?: string;
  topic?: string;
  question?: string;
  progressPercent?: number;
  completedTopics?: string[];
  source?: string;
  details?: string;
};

function malaysiaTimestamp() {
  return new Intl.DateTimeFormat("en-MY", {
    timeZone: "Asia/Kuala_Lumpur",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  }).format(new Date());
}

async function writeToNeon(event: ProgressEvent): Promise<void> {
  if (!db) return;

  const pctStr = event.progressPercent != null ? String(event.progressPercent) : undefined;

  try {
    await db.insert(trainingEvents).values({
      eventType: event.eventType,
      username: event.username ?? "",
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

  if (event.eventType !== "topic_completed" || !event.username) return;

  const now = new Date();
  const completedTopics = event.completedTopics ?? [];

  try {
    await db
      .insert(userProgress)
      .values({
        username: event.username,
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
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;

  if (webhookUrl) {
    try {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          timestamp: malaysiaTimestamp(),
          timezone: "Asia/Kuala_Lumpur",
          ...event
        })
      });
    } catch (error) {
      console.error("Unable to record training progress", error);
    }
  }

  await writeToNeon(event);
}
