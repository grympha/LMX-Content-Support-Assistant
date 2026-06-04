import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { logProgressEvent } from "../lib/progressLog";

describe("logProgressEvent", () => {
  beforeEach(() => {
    delete process.env.GOOGLE_SHEETS_WEBHOOK_URL;
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
    delete process.env.GOOGLE_SHEETS_WEBHOOK_URL;
  });

  it("does not call fetch when GOOGLE_SHEETS_WEBHOOK_URL is not configured", async () => {
    await logProgressEvent({ eventType: "login" });

    expect(fetch).not.toHaveBeenCalled();
  });
});
