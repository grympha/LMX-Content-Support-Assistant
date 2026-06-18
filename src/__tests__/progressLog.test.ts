import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { logProgressEvent } from "../lib/progressLog";

describe("logProgressEvent", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("does not call fetch (writes only to Neon, no webhook)", async () => {
    await logProgressEvent({ eventType: "login" });

    expect(fetch).not.toHaveBeenCalled();
  });
});
