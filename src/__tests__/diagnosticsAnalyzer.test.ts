import { describe, it, expect } from "vitest";
import { analyzeDiagnostics } from "@/lib/diagnosticsAnalyzer";
import type { SearchDiagEntry } from "@/lib/searchDiagnostics";

describe("Diagnostics analyzer", () => {
  it("generates recommendations when low-confidence query scores are weak", () => {
    const entries: SearchDiagEntry[] = [
      {
        ts: "2026-06-04T00:00:00.000Z",
        message: "My screen is black and only shows the logo",
        intake: { issueCategory: "Basic Troubleshooting", description: "Black screen" },
        queryTerms: ["black screen", "logo", "device"],
        topMatches: [
          { topic: "Basic Troubleshooting", heading: "Black screen", content: "Some content", score: 18, matchedTerms: ["black screen"] }
        ]
      },
      {
        ts: "2026-06-04T00:01:00.000Z",
        message: "Unable to generate playlogs",
        intake: { issueCategory: "Playlogs", description: "No playlogs" },
        queryTerms: ["playlogs", "report", "generate"],
        topMatches: [
          { topic: "Playlogs", heading: "Missing playlogs", content: "Some content", score: 22, matchedTerms: ["playlogs"] }
        ]
      }
    ];

    const analysis = analyzeDiagnostics(entries);

    expect(analysis.totalEntries).toBe(2);
    expect(analysis.averageTopScore).toBeLessThan(30);
    expect(analysis.recommendations.some((r) => r.toLowerCase().includes("low top-match scores"))).toBe(true);
    expect(analysis.weightAdjustments.length).toBeGreaterThan(0);
  });
});
