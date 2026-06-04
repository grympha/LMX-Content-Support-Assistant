import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { getPreferredChatProvider } from "../app/api/chat/route";

describe("getPreferredChatProvider", () => {
  const originalOpenAiKey = process.env.OPENAI_API_KEY;
  const originalClaudeKey = process.env.CLAUDE_API_KEY;

  beforeEach(() => {
    delete process.env.OPENAI_API_KEY;
    delete process.env.CLAUDE_API_KEY;
  });

  afterEach(() => {
    if (originalOpenAiKey !== undefined) {
      process.env.OPENAI_API_KEY = originalOpenAiKey;
    } else {
      delete process.env.OPENAI_API_KEY;
    }

    if (originalClaudeKey !== undefined) {
      process.env.CLAUDE_API_KEY = originalClaudeKey;
    } else {
      delete process.env.CLAUDE_API_KEY;
    }
  });

  it("returns local when no API key is configured", () => {
    expect(getPreferredChatProvider()).toBe("local");
  });

  it("returns openai when OPENAI_API_KEY is configured", () => {
    process.env.OPENAI_API_KEY = "test-openai-key";
    expect(getPreferredChatProvider()).toBe("openai");
  });

  it("returns claude when CLAUDE_API_KEY is configured even if OPENAI_API_KEY is also configured", () => {
    process.env.OPENAI_API_KEY = "test-openai-key";
    process.env.CLAUDE_API_KEY = "test-claude-key";
    expect(getPreferredChatProvider()).toBe("claude");
  });
});
