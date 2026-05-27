import { readFileSync } from "node:fs";
import path from "node:path";
import type { IssueIntake } from "@/lib/lmxKnowledge";

export type DocumentKnowledgeMatch = {
  page: string;
  title: string;
  snippet: string;
  score: number;
};

const knowledgePath = path.join(process.cwd(), "knowledge", "lmx-content-training-module.md");

const stopWords = new Set([
  "the",
  "and",
  "for",
  "with",
  "this",
  "that",
  "what",
  "when",
  "where",
  "why",
  "how",
  "does",
  "should",
  "from",
  "into",
  "content",
  "lmx",
  "cms",
  "device",
  "issue"
]);

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9\s/+.-]/g, " ");
}

function keywordsFor(message: string, intake?: IssueIntake) {
  const combined = [
    message,
    intake?.issueCategory,
    intake?.description,
    intake?.contentCampaign,
    intake?.deviceOs
  ]
    .filter(Boolean)
    .join(" ");

  return Array.from(new Set(normalize(combined).split(/\s+/)))
    .filter((word) => word.length > 2 && !stopWords.has(word))
    .slice(0, 24);
}

function getKnowledgeSections() {
  try {
    const content = readFileSync(knowledgePath, "utf8");
    return content
      .split(/\n## Page /)
      .slice(1)
      .map((section) => {
        const [pageLine = "", ...bodyLines] = section.split("\n");
        const body = bodyLines.join(" ").replace(/\s+/g, " ").trim();
        return {
          page: pageLine.trim(),
          body
        };
      })
      .filter((section) => section.body.length > 0);
  } catch {
    return [];
  }
}

function compactSnippet(body: string, terms: string[]) {
  const lowerBody = body.toLowerCase();
  const firstHit = terms
    .map((term) => lowerBody.indexOf(term))
    .filter((index) => index >= 0)
    .sort((a, b) => a - b)[0];
  const start = Math.max(0, (firstHit ?? 0) - 180);
  const snippet = body.slice(start, start + 620).trim();
  return snippet.length < body.length ? `${snippet}...` : snippet;
}

export function searchTrainingKnowledge(message: string, intake?: IssueIntake): DocumentKnowledgeMatch[] {
  const terms = keywordsFor(message, intake);

  if (terms.length === 0) {
    return [];
  }

  return getKnowledgeSections()
    .map((section) => {
      const body = normalize(section.body);
      const score = terms.reduce((total, term) => {
        const occurrences = body.split(term).length - 1;
        return total + occurrences;
      }, 0);

      return {
        page: section.page,
        title: `LMX Content Training Module, page ${section.page}`,
        snippet: compactSnippet(section.body, terms),
        score
      };
    })
    .filter((match) => match.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);
}

export function buildDocumentContext(matches: DocumentKnowledgeMatch[]) {
  if (matches.length === 0) {
    return "";
  }

  return matches
    .map((match) => `${match.title}\n${match.snippet}`)
    .join("\n\n");
}

export function mergeDocumentContextIntoFallback(baseReply: string, matches: DocumentKnowledgeMatch[]) {
  if (matches.length === 0) {
    return baseReply;
  }

  const references = matches
    .map((match) => `- ${match.title}: ${match.snippet}`)
    .join("\n");

  return baseReply.replace(
    "Checks Required:\n",
    `Checks Required:\nUploaded Knowledge Reference:\n${references}\n`
  );
}
