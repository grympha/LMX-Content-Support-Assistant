import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import type { IssueCategory, IssueIntake } from "@/lib/lmxKnowledge";

export type DocumentKnowledgeMatch = {
  page: string;
  title: string;
  snippet: string;
  score: number;
};

const knowledgeRoot = path.join(process.cwd(), "knowledge");
const topicRoot = path.join(knowledgeRoot, "topics");
const fullModulePath = path.join(knowledgeRoot, "lmx-content-training-module.md");

const topicFiles: Partial<Record<IssueCategory, string>> = {
  "Dashboard Overview": "dashboard-overview.md",
  "Create Network": "create-network.md",
  "Create Location": "create-location.md",
  "Create Playlist": "create-playlist.md",
  "Create Layout": "create-layout.md",
  "Create Device": "create-device.md",
  "Device Pairing": "device-pairing.md",
  "Storage Management": "storage-management.md",
  "Default Playlist": "default-playlist.md",
  "Schedule Content": "schedule-content.md",
  "Bundle Scheduling": "bundle-scheduling.md",
  "Publish Content": "publish-content.md",
  Playlogs: "playlogs.md",
  "User Management": "user-management.md",
  "Installation of LMX Content App": "installation-of-lmx-content-app.md",
  "Supported Operating Systems & Hardware": "supported-operating-systems-hardware.md",
  "Programmatic / VAST": "programmatic-vast.md"
};

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
  "training"
]);

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9\s/+.-]/g, " ");
}

function keywordsFor(message: string, intake?: IssueIntake) {
  const combined = [message, intake?.issueCategory, intake?.description, intake?.deviceOs]
    .filter(Boolean)
    .join(" ");

  return Array.from(new Set(normalize(combined).split(/\s+/)))
    .filter((word) => word.length > 2 && !stopWords.has(word))
    .slice(0, 24);
}

function readTopicDocuments(intake?: IssueIntake) {
  const selectedTopic = intake?.issueCategory;
  const selectedFile = selectedTopic ? topicFiles[selectedTopic as IssueCategory] : undefined;

  if (selectedFile && selectedTopic) {
    const filePath = path.join(topicRoot, selectedFile);
    if (existsSync(filePath)) {
      return [
        {
          title: selectedTopic,
          content: readFileSync(filePath, "utf8"),
          selected: true
        }
      ];
    }
  }

  try {
    return readdirSync(topicRoot)
      .filter((file) => file.endsWith(".md"))
      .map((file) => ({
        title: file.replace(/-/g, " ").replace(".md", ""),
        content: readFileSync(path.join(topicRoot, file), "utf8"),
        selected: false
      }));
  } catch {
    return [];
  }
}

function readFullModuleFallback() {
  if (!existsSync(fullModulePath)) {
    return [];
  }

  const content = readFileSync(fullModulePath, "utf8");
  return content
    .split(/\n## /)
    .slice(1)
    .map((section) => {
      const [heading = "Training Module", ...bodyLines] = section.split("\n");
      return {
        title: heading.trim(),
        content: bodyLines.join(" ").replace(/\s+/g, " ").trim(),
        selected: false
      };
    })
    .filter((section) => section.content.length > 0);
}

function compactSnippet(body: string, terms: string[]) {
  const lowerBody = body.toLowerCase();
  const firstHit = terms
    .map((term) => lowerBody.indexOf(term))
    .filter((index) => index >= 0)
    .sort((a, b) => a - b)[0];
  const start = Math.max(0, (firstHit ?? 0) - 160);
  const snippet = body.slice(start, start + 720).trim();
  return snippet.length < body.length ? `${snippet}...` : snippet;
}

export function searchTrainingKnowledge(message: string, intake?: IssueIntake): DocumentKnowledgeMatch[] {
  const terms = keywordsFor(message, intake);
  const topicDocuments = readTopicDocuments(intake);
  const documents = topicDocuments.length > 0 ? topicDocuments : readFullModuleFallback();

  if (documents.length === 0) {
    return [];
  }

  return documents
    .map((document) => {
      const normalizedBody = normalize(document.content);
      const score = document.selected
        ? 1000
        : terms.reduce((total, term) => total + (normalizedBody.split(term).length - 1), 0);

      return {
        page: document.title,
        title: document.selected ? `Selected topic: ${document.title}` : `Training topic: ${document.title}`,
        snippet: compactSnippet(document.content, terms),
        score
      };
    })
    .filter((match) => match.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, intake?.issueCategory && intake.issueCategory !== "Other" ? 1 : 4);
}

export function buildDocumentContext(matches: DocumentKnowledgeMatch[]) {
  if (matches.length === 0) {
    return "";
  }

  return matches.map((match) => `${match.title}\n${match.snippet}`).join("\n\n");
}

export function mergeDocumentContextIntoFallback(baseReply: string, matches: DocumentKnowledgeMatch[]) {
  if (matches.length === 0) {
    return baseReply;
  }

  const references = matches
    .map((match) => `- ${match.title}: ${match.snippet}`)
    .join("\n");

  return baseReply.replace(
    "Step-by-Step Guide:\n",
    `Step-by-Step Guide:\nUploaded Training Topic Reference:\n${references}\n`
  );
}
