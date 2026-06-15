/**
 * Phase 2A: verify that VAULT_KB=true and VAULT_KB=false produce identical
 * search output for representative queries.
 *
 * Since drift is currently zero (confirmed by run-vault-drift.ts), both paths
 * must return the same confidence, intent, and answer text.  Any divergence
 * after future vault edits will surface here before code is shipped.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import type { IssueIntake } from "@/lib/lmxKnowledge";

// Representative query fixtures covering each answer-builder branch
const fixtures: Array<{ label: string; message: string; intake: Partial<IssueIntake> }> = [
  {
    label: "troubleshooting — black screen",
    message: "My screen is black and only shows the LMX logo",
    intake: { issueCategory: "Basic Troubleshooting", description: "Black screen on device" }
  },
  {
    label: "how_to — create a playlist",
    message: "How do I create a playlist in LMX Content?",
    intake: { issueCategory: "Create Playlist" }
  },
  {
    label: "requirements — android hardware",
    message: "What are the Android hardware requirements for LMX Content?",
    intake: { issueCategory: "Supported Operating Systems & Hardware", deviceOs: "Android" }
  },
  {
    label: "troubleshooting — device offline",
    message: "Device is showing offline status and keeps fluctuating",
    intake: { issueCategory: "Basic Troubleshooting" }
  },
  {
    label: "how_to — schedule content",
    message: "How do I schedule a campaign for a specific daypart?",
    intake: { issueCategory: "Schedule Content" }
  },
  {
    label: "troubleshooting — programmatic VAST",
    message: "VAST ad tag is not filling, showing no-fill error",
    intake: { issueCategory: "Programmatic / VAST" }
  },
  {
    label: "how_to — publish content",
    message: "Unable to publish content to devices",
    intake: { issueCategory: "Publish Content" }
  },
  {
    label: "reporting — playlogs",
    message: "Playlog is missing for yesterday, how do I check it?",
    intake: { issueCategory: "Playlogs" }
  }
];

describe("Phase 2A — VAULT_KB flag parity", () => {
  // Capture original env value so each test restores it cleanly
  const originalVaultKb = process.env["VAULT_KB"];

  afterEach(() => {
    vi.unstubAllEnvs();
    // Restore to whatever was set before the test suite ran
    if (originalVaultKb === undefined) {
      delete process.env["VAULT_KB"];
    } else {
      process.env["VAULT_KB"] = originalVaultKb;
    }
  });

  for (const fixture of fixtures) {
    it(`produces identical results with and without VAULT_KB: "${fixture.label}"`, async () => {
      const intake = fixture.intake as IssueIntake;

      // ── VAULT_KB=false (hardcoded lmxKnowledge path) ──
      vi.stubEnv("VAULT_KB", "false");
      // Re-import after env change so the module sees the updated flag.
      // vitest isolates modules per test file by default, so we use dynamic import.
      const { buildLocalSearchResponse: buildFalse } = await import("@/lib/localSearchEngine");
      const resultFalse = buildFalse(fixture.message, intake);

      // ── VAULT_KB=true (vault-backed path) ──
      vi.stubEnv("VAULT_KB", "true");
      const { buildLocalSearchResponse: buildTrue } = await import("@/lib/localSearchEngine");
      const resultTrue = buildTrue(fixture.message, intake);

      // Both paths must agree on confidence and intent
      expect(resultTrue.confidence, "confidence must match").toBe(resultFalse.confidence);
      expect(resultTrue.intent, "intent must match").toBe(resultFalse.intent);

      // Answer text must be identical (same keywords → same scoring → same entry)
      expect(resultTrue.answer, "answer must match").toBe(resultFalse.answer);

      // queryTerms parity is NOT enforced: vault-path frontmatter enrichment
      // intentionally surfaces additional matched terms (e.g. "socket connection"
      // from heartbeat mechanism frontmatter) that the hard-coded path does not
      // produce.  The meaningful invariants are confidence, intent, and answer.
    });
  }
});

describe("Phase 2A — VAULT_KB=true does not degrade confidence", () => {
  beforeEach(() => {
    vi.stubEnv("VAULT_KB", "true");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns non-low confidence for black screen query with vault active", async () => {
    const { buildLocalSearchResponse } = await import("@/lib/localSearchEngine");
    const result = buildLocalSearchResponse(
      "My screen is black and only shows the logo",
      { issueCategory: "Basic Troubleshooting", description: "Black screen" } as IssueIntake
    );
    expect(result.confidence).not.toBe("low");
    expect(result.answer).toBeTruthy();
  });

  it("returns non-low confidence for scheduling query with vault active", async () => {
    const { buildLocalSearchResponse } = await import("@/lib/localSearchEngine");
    const result = buildLocalSearchResponse(
      "How do I schedule content for a specific daypart?",
      { issueCategory: "Schedule Content" } as IssueIntake
    );
    expect(result.confidence).not.toBe("low");
  });
});
