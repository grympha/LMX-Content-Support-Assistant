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

export async function logProgressEvent(event: ProgressEvent) {
  const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;

  if (!webhookUrl) {
    return;
  }

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        ...event
      })
    });
  } catch (error) {
    console.error("Unable to record training progress", error);
  }
}
