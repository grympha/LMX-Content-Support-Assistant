export const MAX_MESSAGE_LENGTH = 10_000;

const STOP_WORDS = new Set([
  "a", "an", "the", "is", "are", "was", "were", "be", "been",
  "have", "has", "had", "do", "does", "did", "will", "would",
  "could", "should", "may", "might", "can", "shall", "need",
  "how", "what", "when", "where", "why", "who", "which",
  "i", "my", "me", "we", "our", "you", "your", "it", "its",
  "this", "that", "these", "those", "to", "of", "in", "on",
  "at", "by", "for", "with", "from", "up", "about", "into",
  "and", "but", "or", "nor", "so", "yet", "not", "only",
  "also", "still", "just", "now", "then", "than", "too",
  "very", "more", "most", "other", "own", "same", "both",
  "each", "few", "some", "any", "such", "no", "if", "as"
]);

/**
 * Generates a concise title from the first user message in a conversation.
 * Deterministic — no AI call, zero added latency.
 *
 * Examples:
 *   "My device is offline"              → "Device Offline"
 *   "How do I update Android WebView?"  → "Update Android Webview"
 *   "VAST ads are not playing"          → "Vast Ads Playing"
 */
export function generateTitle(firstMessage: string): string {
  const cleaned = firstMessage
    .replace(/[^a-zA-Z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const words = cleaned
    .split(" ")
    .filter((w) => w.length > 1 && !STOP_WORDS.has(w.toLowerCase()));

  if (words.length === 0) {
    return "New Conversation";
  }

  const title = words
    .slice(0, 6)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");

  return title.length > 50 ? title.slice(0, 47) + "..." : title;
}

/**
 * Returns true if the message content is within the allowed length limit.
 */
export function isMessageLengthValid(content: string): boolean {
  return content.length <= MAX_MESSAGE_LENGTH;
}

/**
 * Truncates message content to MAX_MESSAGE_LENGTH with an ellipsis indicator.
 * Use this as a last-resort fallback; prefer rejecting with 400 at the API boundary.
 */
export function truncateMessage(content: string): string {
  if (content.length <= MAX_MESSAGE_LENGTH) return content;
  return content.slice(0, MAX_MESSAGE_LENGTH - 3) + "...";
}
