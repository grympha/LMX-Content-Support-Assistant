export type ChatProvider = "openai" | "claude" | "local";

export function getPreferredChatProvider(): ChatProvider {
  if (process.env.CLAUDE_API_KEY) {
    return "claude";
  }

  if (process.env.OPENAI_API_KEY) {
    return "openai";
  }

  return "local";
}
