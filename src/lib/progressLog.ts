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
        timestamp: malaysiaTimestamp(),
        timezone: "Asia/Kuala_Lumpur",
        ...event
      })
    });
  } catch (error) {
    console.error("Unable to record training progress", error);
  }
}
