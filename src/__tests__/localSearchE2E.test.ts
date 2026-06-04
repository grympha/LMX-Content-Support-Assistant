import { describe, it, expect } from "vitest";
import { buildLocalSearchResponse } from "@/lib/localSearchEngine";
import type { IssueIntake } from "@/lib/lmxKnowledge";

describe("Local search end-to-end", () => {
  it("returns a non-low confidence answer for a representative troubleshooting query", () => {
    const message = "My screen is black and only shows the logo";
    const intake: IssueIntake = { issueCategory: "Basic Troubleshooting", description: "Black screen on device" } as IssueIntake;

    const result = buildLocalSearchResponse(message, intake);

    expect(result).toBeDefined();
    expect(result.confidence).not.toEqual("low");
    expect(result.answer).toBeTruthy();
  });
});
