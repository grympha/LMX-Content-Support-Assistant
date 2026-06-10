export type ChatProvider = "openai" | "claude" | "mistral" | "local";

export function getPreferredChatProvider(): ChatProvider {
  if (process.env.CLAUDE_API_KEY) return "claude";
  if (process.env.OPENAI_API_KEY) return "openai";
  if (process.env.MISTRAL_API_KEY) return "mistral";
  return "local";
}
