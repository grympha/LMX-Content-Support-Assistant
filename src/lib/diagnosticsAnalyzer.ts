import type { SearchDiagEntry } from "@/lib/searchDiagnostics";

export type DiagnosticsMetric = {
  topic: string;
  count: number;
};

export type DiagnosticsAnalysis = {
  totalEntries: number;
  averageTopScore: number;
  medianTopScore: number;
  lowScoreRatio: number;
  mediumScoreRatio: number;
  highScoreRatio: number;
  topTopics: DiagnosticsMetric[];
  topTerms: DiagnosticsMetric[];
  recommendations: string[];
  weightAdjustments: Array<{ parameter: string; suggestedChange: string; rationale: string }>;
};

export function analyzeDiagnostics(entries: SearchDiagEntry[]): DiagnosticsAnalysis {
  const validEntries = entries.filter((entry) => Array.isArray(entry.topMatches) && entry.topMatches.length > 0);
  const totalEntries = validEntries.length;

  const topScores = validEntries
    .map((entry) => entry.topMatches[0]?.score ?? 0)
    .sort((a, b) => a - b);

  const averageTopScore = totalEntries === 0 ? 0 : topScores.reduce((sum, score) => sum + score, 0) / totalEntries;
  const medianTopScore = totalEntries === 0 ? 0 : topScores[Math.floor(totalEntries / 2)];

  let lowCount = 0;
  let mediumCount = 0;
  let highCount = 0;

  const topicCounts: Record<string, number> = {};
  const termCounts: Record<string, number> = {};

  validEntries.forEach((entry) => {
    const score = entry.topMatches[0]?.score ?? 0;
    if (score < 30) lowCount += 1;
    else if (score < 60) mediumCount += 1;
    else highCount += 1;

    entry.topMatches.forEach((match) => {
      topicCounts[match.topic] = (topicCounts[match.topic] || 0) + 1;
    });

    entry.queryTerms.forEach((term) => {
      termCounts[term] = (termCounts[term] || 0) + 1;
    });
  });

  const topTopics = Object.entries(topicCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([topic, count]) => ({ topic, count }));

  const topTerms = Object.entries(termCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([term, count]) => ({ topic: term, count }));

  const lowScoreRatio = totalEntries === 0 ? 0 : lowCount / totalEntries;
  const mediumScoreRatio = totalEntries === 0 ? 0 : mediumCount / totalEntries;
  const highScoreRatio = totalEntries === 0 ? 0 : highCount / totalEntries;

  const recommendations: string[] = [];
  const weightAdjustments: Array<{ parameter: string; suggestedChange: string; rationale: string }> = [];

  if (averageTopScore < 25 || lowScoreRatio >= 0.6) {
    recommendations.push(
      "Low top-match scores indicate the engine is not matching user phrases strongly enough. Increase base phrase, heading, and topic weights first."
    );
    weightAdjustments.push(
      {
        parameter: "body phrase weight",
        suggestedChange: "+4",
        rationale: "Many low-confidence queries still have weak paragraph matches."
      },
      {
        parameter: "body word weight",
        suggestedChange: "+2",
        rationale: "Single-word hits should count a bit more for badly matched queries."
      },
      {
        parameter: "heading weight",
        suggestedChange: "+6",
        rationale: "Headings provide strong semantic cues that should matter more."
      },
      {
        parameter: "topic weight",
        suggestedChange: "+8",
        rationale: "User-selected topics and page titles should have stronger influence."
      },
      {
        parameter: "intent boost values",
        suggestedChange: "+8 for troubleshooting/how_to/reporting when appropriate",
        rationale: "Intent-specific content should be rewarded more when low-confidence queries are common."
      }
    );
  } else if (averageTopScore < 45 || mediumScoreRatio >= 0.5) {
    recommendations.push(
      "Moderate top-match scores suggest the engine is fairly close, but could still benefit from stronger heading/topic signals and intent boosts."
    );
    weightAdjustments.push(
      {
        parameter: "heading weight",
        suggestedChange: "+4",
        rationale: "Heading matches should be weighted a bit higher for better structure-aware answers."
      },
      {
        parameter: "topic weight",
        suggestedChange: "+5",
        rationale: "Topic context is a useful signal for ambiguous queries."
      },
      {
        parameter: "intent boost values",
        suggestedChange: "+5",
        rationale: "Help how-to and troubleshooting queries land on the right content."
      }
    );
  } else {
    recommendations.push("Top-match scores are healthy. Focus on synonyms and query term coverage for remaining edge cases.");
    if (topTerms.length > 0) {
      recommendations.push(
        `Review frequent low-confidence query terms: ${topTerms.slice(0, 10).map((t) => t.topic).join(", ")}. Add synonyms, phrase matches, or topic keywords for these queries.`
      );
    }
  }

  if (topTerms.length > 0) {
    recommendations.push(
      `Frequent query terms from low-confidence queries include: ${topTerms.slice(0, 10).map((t) => `${t.topic} (${t.count})`).join(", ")}.`
    );
  }

  if (topTopics.length > 0) {
    recommendations.push(
      `Frequently matched topics in low-confidence queries: ${topTopics.map((t) => `${t.topic} (${t.count})`).join(", ")}. Review coverage in those topic pages.`
    );
  }

  return {
    totalEntries,
    averageTopScore,
    medianTopScore,
    lowScoreRatio,
    mediumScoreRatio,
    highScoreRatio,
    topTopics,
    topTerms,
    recommendations,
    weightAdjustments
  };
}
