import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { lmxKnowledge, type IssueCategory, type IssueIntake, type KnowledgeEntry } from "@/lib/lmxKnowledge";

export type SearchIntent = "how_to" | "troubleshooting" | "definition" | "requirements" | "reporting" | "general";

export type LocalSearchMatch = {
  topic: IssueCategory | string;
  heading: string;
  content: string;
  score: number;
  matchedTerms: string[];
};

export type LocalSearchResult = {
  intent: SearchIntent;
  queryTerms: string[];
  matches: LocalSearchMatch[];
  confidence: "high" | "medium" | "low";
  answer: string;
};

const knowledgeRoot = path.join(process.cwd(), "knowledge");
const topicRoot = path.join(knowledgeRoot, "topics");

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
  "Basic Troubleshooting": "basic-troubleshooting.md",
  "Installation of LMX Content App": "installation-of-lmx-content-app.md",
  "Supported Operating Systems & Hardware": "supported-operating-systems-hardware.md",
  "Programmatic / VAST": "programmatic-vast.md"
};

const fileTopics = new Map(Object.entries(topicFiles).map(([topic, file]) => [file, topic]));

const stopWords = new Set([
  "a",
  "an",
  "and",
  "are",
  "can",
  "cms",
  "content",
  "do",
  "does",
  "for",
  "from",
  "how",
  "in",
  "is",
  "it",
  "lmx",
  "my",
  "of",
  "on",
  "or",
  "should",
  "the",
  "this",
  "to",
  "what",
  "when",
  "where",
  "why",
  "with"
]);

const synonymGroups = [
  ["black screen", "blank screen", "empty display", "no display", "screen blank"],
  ["device offline", "offline device", "not online", "disconnected", "device disconnected"],
  ["content not playing", "not playing", "playback missing", "video not playing", "ads not playing", "ad not showing"],
  ["wrong content", "incorrect playlist", "wrong playlist", "fallback content"],
  ["old content", "old video", "not updated", "cached content"],
  ["playlog", "playlogs", "proof of play", "report", "reporting", "log"],
  ["publish", "publishing", "push content", "send to device", "sync to device"],
  ["schedule", "scheduling", "campaign", "daypart", "start date", "end date"],
  ["pairing", "pair device", "verification code", "pair code", "register device"],
  ["storage", "upload", "media library", "main storage", "file upload"],
  ["default playlist", "fallback playlist", "default content", "fallback"],
  ["programmatic", "vast", "ssp", "dsp", "no fill", "no-fill", "webview", "ima"],
  ["hardware", "requirements", "specification", "spec", "operating system", "os", "android", "windows"],
  ["user management", "user", "role", "roles", "permission", "permissions", "access"]
];

function normalize(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9\s/+.-]/g, " ").replace(/\s+/g, " ").trim();
}

function titleCaseFromFile(file: string) {
  return file
    .replace(/\.md$/i, "")
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function detectIntent(message: string): SearchIntent {
  const normalized = normalize(message);

  if (/\b(why|error|issue|problem|not|fail|failed|offline|black|blank|wrong|missing|stuck|cannot|can't|unable)\b/.test(normalized)) {
    return "troubleshooting";
  }

  if (/\b(requirement|requirements|spec|hardware|os|operating system|support|supported|format|formats|webview|android|windows)\b/.test(normalized)) {
    return "requirements";
  }

  if (/\b(playlog|playlogs|report|proof of play|log)\b/.test(normalized)) {
    return "reporting";
  }

  if (/\b(what is|meaning|define|definition|explain)\b/.test(normalized)) {
    return "definition";
  }

  if (/\b(how|create|setup|set up|install|pair|publish|schedule|upload|add|generate|download)\b/.test(normalized)) {
    return "how_to";
  }

  return "general";
}

function expandTerms(message: string, intake?: IssueIntake) {
  const normalized = normalize([message, intake?.issueCategory, intake?.description, intake?.deviceOs].filter(Boolean).join(" "));
  const terms = new Set(
    normalized
      .split(/\s+/)
      .filter((word) => word.length > 2 && !stopWords.has(word))
  );

  for (const group of synonymGroups) {
    if (group.some((phrase) => normalized.includes(phrase))) {
      for (const phrase of group) {
        terms.add(phrase);
        for (const word of phrase.split(/\s+/)) {
          if (word.length > 2 && !stopWords.has(word)) {
            terms.add(word);
          }
        }
      }
    }
  }

  for (const entry of lmxKnowledge) {
    const category = normalize(entry.category);
    const hasCategoryHit = normalized.includes(category) || entry.keywords.some((keyword) => normalized.includes(normalize(keyword)));

    if (hasCategoryHit) {
      terms.add(entry.category);
      for (const keyword of entry.keywords) {
        terms.add(keyword);
      }
    }
  }

  return Array.from(terms).slice(0, 80);
}

function markdownToPlainText(value: string) {
  return value
    .replace(/```[\s\S]*?```/g, (match) => match.replace(/```/g, ""))
    .replace(/^\s*\|(.+)\|\s*$/gm, "$1")
    .replace(/[#*_`>]/g, "")
    .replace(/\r/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function chunkMarkdown(topic: string, content: string) {
  const chunks: Array<{ topic: string; heading: string; content: string }> = [];
  const lines = content.replace(/\r/g, "").split("\n");
  let currentHeading = topic;
  let buffer: string[] = [];

  function flush() {
    const text = markdownToPlainText(buffer.join("\n"));
    if (text.length > 30) {
      chunks.push({ topic, heading: currentHeading, content: text });
    }
    buffer = [];
  }

  for (const line of lines) {
    const heading = line.match(/^(#{1,3})\s+(.+)$/);

    if (heading) {
      flush();
      currentHeading = heading[2].trim();
      buffer.push(line);
      continue;
    }

    buffer.push(line);
  }

  flush();
  return chunks;
}

function readKnowledgeChunks(intake?: IssueIntake) {
  const files = existsSync(topicRoot) ? readdirSync(topicRoot).filter((file) => file.endsWith(".md")) : [];

  return files.flatMap((file) => {
    const filePath = path.join(topicRoot, file);
    if (!existsSync(filePath)) {
      return [];
    }

    const topic = fileTopics.get(file) ?? titleCaseFromFile(file);
    return chunkMarkdown(topic, readFileSync(filePath, "utf8"));
  });
}

function countOccurrences(haystack: string, term: string) {
  const normalizedTerm = normalize(term);

  if (!normalizedTerm) {
    return 0;
  }

  if (normalizedTerm.includes(" ")) {
    return haystack.split(normalizedTerm).length - 1;
  }

  const escaped = normalizedTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return haystack.match(new RegExp(`(^|\\s)${escaped}(\\s|$)`, "g"))?.length ?? 0;
}

function scoreChunk(chunk: { topic: string; heading: string; content: string }, terms: string[], intent: SearchIntent, intake?: IssueIntake) {
  const body = normalize(chunk.content);
  const heading = normalize(chunk.heading);
  const topic = normalize(chunk.topic);
  const matchedTerms: string[] = [];
  let score = 0;

  for (const term of terms) {
    const normalizedTerm = normalize(term);
    const bodyHits = countOccurrences(body, normalizedTerm);
    const headingHits = countOccurrences(heading, normalizedTerm);
    const topicHits = countOccurrences(topic, normalizedTerm);

    if (bodyHits || headingHits || topicHits) {
      matchedTerms.push(term);
      score += bodyHits * (normalizedTerm.includes(" ") ? 8 : 3);
      score += headingHits * 14;
      score += topicHits * 18;
    }
  }

  if (intake?.issueCategory && intake.issueCategory !== "Other" && chunk.topic === intake.issueCategory) {
    score += 80;
  }

  if (intent === "troubleshooting" && /\b(troubleshoot|issue|possible causes|checks|common mistakes|quick fixes)\b/.test(body)) {
    score += 35;
  }

  if (intent === "how_to" && /\b(steps|step|create|click|select|save|publish|install|pair)\b/.test(body)) {
    score += 30;
  }

  if (intent === "requirements" && /\b(requirements|supported|hardware|android|windows|webview|format|spec)\b/.test(body)) {
    score += 30;
  }

  if (intent === "reporting" && /\b(playlog|report|csv|pdf|download|proof)\b/.test(body)) {
    score += 30;
  }

  return {
    topic: chunk.topic,
    heading: chunk.heading,
    content: chunk.content,
    score,
    matchedTerms: Array.from(new Set(matchedTerms)).slice(0, 12)
  };
}

function bestKnowledgeEntry(topic: string, message: string, terms: string[]) {
  const normalizedTopic = normalize(topic);
  const normalizedMessage = normalize(message);

  return lmxKnowledge
    .map((entry) => ({
      entry,
      score:
        (normalize(entry.category) === normalizedTopic ? 100 : 0) +
        entry.keywords.reduce((total, keyword) => total + (normalizedMessage.includes(normalize(keyword)) ? 8 : 0), 0) +
        terms.reduce((total, term) => total + (entry.keywords.some((keyword) => normalize(keyword) === normalize(term)) ? 3 : 0), 0)
    }))
    .sort((a, b) => b.score - a.score)[0]?.entry;
}

function bulletLines(content: string) {
  const lines = content
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const explicitBullets = lines
    .filter((line) => /^(-|\d+\.)\s+/.test(line))
    .map((line) => line.replace(/^(-|\d+\.)\s+/, "").trim())
    .filter((line) => line.length > 4);

  if (explicitBullets.length > 0) {
    return explicitBullets;
  }

  return lines
    .filter((line) => !/^#{1,3}\s+/.test(line))
    .flatMap((line) => line.split(/(?<=[.!?])\s+/))
    .map((line) => line.trim())
    .filter((line) => line.length > 20);
}

function uniqueLines(lines: string[]) {
  const seen = new Set<string>();
  return lines.filter((line) => {
    const key = normalize(line);
    if (!key || seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

function formatBullets(items: string[], limit = 6) {
  return uniqueLines(items).slice(0, limit).map((item) => `- ${item}`).join("\n");
}

function confidenceFor(matches: LocalSearchMatch[]) {
  const best = matches[0]?.score ?? 0;
  const second = matches[1]?.score ?? 0;

  if (best >= 90 || (best >= 60 && best - second >= 18)) {
    return "high";
  }

  if (best >= 28) {
    return "medium";
  }

  return "low";
}

function buildClarifyingAnswer(matches: LocalSearchMatch[]) {
  const topics = Array.from(new Set(matches.slice(0, 3).map((match) => match.topic)));

  if (topics.length === 0) {
    return `I could not find a clear answer in the available LMX Content training knowledge.

Please ask with the module or issue included, for example:
- How do I pair a device?
- Why is my screen black?
- How do I publish content?
- How do I generate playlogs?`;
  }

  return `I found a few possible matches, but I need one more detail to answer accurately.

Possible topics
${topics.map((topic) => `- ${topic}`).join("\n")}

Please ask again with the screen, module, or issue you are working on.`;
}

function buildTroubleshootingAnswer(topic: string, entry: KnowledgeEntry | undefined, matches: LocalSearchMatch[]) {
  const issueSpecific = matches.flatMap((match) => bulletLines(match.content));
  const steps = entry?.steps ?? [];
  const notes = entry?.importantNotes ?? [];
  const mistakes = entry?.commonMistakes ?? [];

  return `${topic}

${entry?.overview ?? "Use the matching training knowledge below to isolate the issue and apply the correct next action."}

Check in this order
${formatBullets([...issueSpecific, ...steps], 7)}

Likely causes or mistakes
${formatBullets([...mistakes, ...notes], 5)}

Next action
- Verify the device status, schedule, playlist, publish status, synchronization, and playback result.
- If the issue continues after these checks, collect the device, location, schedule, and playback evidence before escalating.`;
}

function buildStandardAnswer(topic: string, entry: KnowledgeEntry | undefined, matches: LocalSearchMatch[], intent: SearchIntent) {
  const matchedBullets = matches.flatMap((match) => bulletLines(match.content));
  const steps = entry?.steps ?? [];
  const notes = entry?.importantNotes ?? [];
  const heading = intent === "requirements" ? "What to check" : intent === "reporting" ? "Key steps" : "Key steps";

  return `${topic}

${entry?.overview ?? "Here is the best matching guidance from the local LMX Content training knowledge."}

${heading}
${formatBullets([...matchedBullets, ...steps], 7)}

Important notes
${formatBullets(notes.length > 0 ? notes : matchedBullets.slice(3), 4)}`;
}

export function buildLocalSearchResponse(message: string, intake?: IssueIntake): LocalSearchResult {
  const intent = detectIntent(message);
  const queryTerms = expandTerms(message, intake);
  const chunks = readKnowledgeChunks(intake);
  const matches = chunks
    .map((chunk) => scoreChunk(chunk, queryTerms, intent, intake))
    .filter((match) => match.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
  const confidence = confidenceFor(matches);

  if (confidence === "low") {
    return {
      intent,
      queryTerms,
      matches,
      confidence,
      answer: buildClarifyingAnswer(matches)
    };
  }

  const topTopic = matches[0]?.topic ?? intake?.issueCategory ?? "LMX Content Training";
  const entry = bestKnowledgeEntry(String(topTopic), message, queryTerms);
  const answer =
    intent === "troubleshooting"
      ? buildTroubleshootingAnswer(String(topTopic), entry, matches)
      : buildStandardAnswer(String(topTopic), entry, matches, intent);

  return {
    intent,
    queryTerms,
    matches,
    confidence,
    answer
  };
}

export function localMatchesToDocumentContext(matches: LocalSearchMatch[]) {
  return matches
    .map((match) => `${match.topic} - ${match.heading}\n${match.content.slice(0, 900)}`)
    .join("\n\n");
}
