import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { lmxKnowledge, type IssueCategory, type IssueIntake, type KnowledgeEntry } from "@/lib/lmxKnowledge";
import { logLowConfidenceQuery } from "@/lib/searchDiagnostics";

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

type SupportPlaybook = {
  id: string;
  title: string;
  triggers: string[];
  summary: string;
  whatToCheck: string[];
  howToFix: string[];
  nextSteps: string[];
  clientResponse: string;
};

type PlatformRequirement = {
  platform: string;
  triggers: string[];
  osVersion: string;
  processor: string[];
  systemType: string;
  memory: string[];
  mediaFormats?: string[];
  programmaticNotes?: string[];
  source: string;
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
  "do",
  "does",
  "for",
  "from",
  "how",
  "in",
  "is",
  "it",
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
  ["user management", "user", "role", "roles", "permission", "permissions", "access"],
  ["not approved", "content approval", "approve content", "pending approval", "approval status"],
  ["ad tag", "vast tag", "ad url", "ima sdk", "ima tag", "ad server"],
  ["bundle scheduling", "content bundle", "multi schedule", "bundle content"],
  ["media format", "file format", "supported format", "video format", "image format"],
  ["webview version", "webview update", "chrome version", "browser version", "webview"]
];

const supportPlaybooks: SupportPlaybook[] = [
  {
    id: "old-content",
    title: "Old Content Still Showing",
    triggers: ["old content", "old video", "not updated", "cached content", "still showing", "previous content", "content still playing"],
    summary: "Old content usually means the device has not received the latest publish/sync update, is offline or unstable, or is still playing cached content from an older schedule.",
    whatToCheck: [
      "Confirm the new content was saved, approved, and published, not only uploaded or scheduled.",
      "Check the target Network, Location, Playlist, and Device mapping are correct.",
      "Check the schedule date, start/end time, daypart, priority, and expiry date.",
      "Open Device Manager and confirm the device is online or recently connected.",
      "Check whether the device has completed synchronization after the latest publish.",
      "Confirm device storage is not full and the player has enough space to download new media.",
      "Review playlogs or playback evidence to confirm whether the old content is still actually playing."
    ],
    howToFix: [
      "Republish the affected playlist or campaign after confirming the correct target mapping.",
      "Restart the LMX Content player app or reboot the device if sync does not update.",
      "If the device is offline, restore internet connectivity first, then wait for sync or republish.",
      "Remove expired or incorrect schedules that overlap with the intended campaign.",
      "Clean up storage if the device or CMS storage is full, then trigger publish/sync again.",
      "If old cached content remains after reconnecting, perform a controlled player restart and validate playback."
    ],
    nextSteps: [
      "Ask for device name, network, location, playlist, campaign name, and latest publish time.",
      "Verify playback on the physical screen after republish/sync.",
      "If the issue continues, collect screenshots of schedule setup, publish status, device status, and playlog evidence before escalating."
    ],
    clientResponse:
      "We are checking whether the latest schedule was approved, published, and synchronized to the affected device. Old content normally appears when the player has not received the latest update, is offline/unstable, or is still using cached content. We will republish/sync the campaign, verify the device status, and confirm playback once the update reaches the screen."
  },
  {
    id: "black-screen",
    title: "Black Screen or LMX Logo Showing",
    triggers: ["black screen", "blank screen", "empty display", "no display", "screen blank", "logo issue", "lmx logo"],
    summary: "A black screen or LMX logo usually points to missing playable content, publish/sync failure, unsupported media, storage issues, or device/display connectivity problems.",
    whatToCheck: [
      "Confirm the device is online in Dashboard or Device Manager.",
      "Check that the playlist has active scheduled content for the current date and time.",
      "Confirm content is approved and published successfully.",
      "Check media format, codec, file size, and resolution compatibility.",
      "Check if Default Playlist has valid scheduled fallback content.",
      "Check device storage, internet stability, HDMI/display source, and screen power.",
      "For HTML/VAST content, confirm WebView/browser support and internet access."
    ],
    howToFix: [
      "Publish a simple test image or MP4 to confirm the player can display content.",
      "Republish the intended campaign after validating schedule and playlist mapping.",
      "Replace unsupported or oversized files with optimized supported media.",
      "Restart the player app or reboot the device after network/storage correction.",
      "Add valid fallback content to Default Playlist if scheduled content fails.",
      "For VAST/HTML issues, update WebView/browser and verify URL/SSP response."
    ],
    nextSteps: [
      "Collect device name, OS, content type, schedule time, and a screen photo.",
      "Confirm whether the issue affects one device, one location, or all devices.",
      "Escalate with player logs if a simple test campaign also fails."
    ],
    clientResponse:
      "We are checking the device status, active schedule, publish status, and media compatibility. A black screen can happen when content is not published/synced, unsupported media is scheduled, or the player/display has a connectivity issue. We will validate with simple test content and confirm the next action based on the result."
  },
  {
    id: "offline-device",
    title: "Device Offline or Fluctuating Online/Offline",
    triggers: ["device offline", "offline device", "not online", "disconnected", "fluctuating", "online offline", "heartbeat"],
    summary: "Offline or fluctuating status is usually caused by unstable internet, heartbeat/socket interruption, player app crash, device power/sleep behavior, or firewall/network restrictions.",
    whatToCheck: [
      "Check WiFi/Ethernet stability on the device network.",
      "Confirm the player app is running and not crashed or closed.",
      "Check power, sleep mode, reboot loop, and auto boot/shutdown settings.",
      "Check firewall/DNS restrictions that may block CMS or heartbeat communication.",
      "Compare CMS status with actual playback; the device may continue playing cached content while offline.",
      "Check if many devices are affected, which may indicate backend or network incident."
    ],
    howToFix: [
      "Restart the player app and verify it reconnects to CMS.",
      "Reboot the device if the app does not reconnect.",
      "Stabilize internet or switch network connection if WiFi is weak.",
      "Disable sleep/power saving settings that interrupt player operation.",
      "Ask the IT/network team to allow required CMS connectivity if firewall is suspected.",
      "If backend issue is suspected, monitor CMS status and escalate with timestamp and affected devices."
    ],
    nextSteps: [
      "Collect device name, location, internet type, last online time, and whether content is still playing.",
      "Monitor the device for at least one heartbeat cycle after restart.",
      "Escalate if status keeps fluctuating across stable network conditions."
    ],
    clientResponse:
      "The screen may continue playing cached content even when CMS shows offline. We are checking the player heartbeat, internet stability, and device power/app status. We will restart/reconnect the player and confirm whether the device status stabilizes in CMS."
  },
  {
    id: "missing-playlog",
    title: "Missing Playlog",
    triggers: ["missing playlog", "missing playlogs", "no playlog", "playlog missing", "report missing", "proof of play missing"],
    summary: "Missing playlogs can happen when playback did not trigger, the device was offline, playlog sync is delayed, the date range is wrong, or the report is requested before device-level logs are available.",
    whatToCheck: [
      "Confirm the content actually played on the device during the requested period.",
      "Check device online status and synchronization after playback.",
      "Check the playlog date range; General Playlog has a 30-day limit.",
      "For device-level playlog, confirm the report is requested up to the previous day only.",
      "Check whether Play Log is enabled for the network/campaign where required.",
      "Confirm the correct device/content filter is selected."
    ],
    howToFix: [
      "Use the correct date range and report level: General or Device Level.",
      "Wait for synchronization if playback just happened recently.",
      "Bring the device online and allow playlogs to sync.",
      "Regenerate the report after confirming filters and dates.",
      "If logs remain missing, collect campaign, device, date/time, and playback evidence for escalation."
    ],
    nextSteps: [
      "Ask for campaign name, content name, device, date range, and report type.",
      "Compare schedule timing against actual playback time.",
      "Escalate if confirmed playback exists but logs do not sync after the expected window."
    ],
    clientResponse:
      "We are validating whether the content played during the selected date range and whether the device synchronized its playlogs. Playlog availability depends on playback, device connectivity, report type, and date range. We will regenerate the report with the correct filters and escalate if confirmed playback is still missing from the logs."
  },
  {
    id: "publish-error",
    title: "Unable to Publish",
    triggers: ["unable to publish", "publish error", "cannot publish", "can't publish", "before creating a schedule", "default playlist error"],
    summary: "Publish errors commonly happen when required Default Playlist content is missing, content is not scheduled/approved, the target playlist is wrong, or unsupported media is used.",
    whatToCheck: [
      "Check the exact publish error message.",
      "Confirm Default Playlist has at least one scheduled image and one scheduled video if required by the platform rule.",
      "Confirm uploaded content is scheduled, approved, and assigned to the correct playlist.",
      "Check valid media formats such as MP4, JPG, and PNG.",
      "Verify Network, Location, Playlist, and campaign target mapping.",
      "Check schedule start/end date and time are valid."
    ],
    howToFix: [
      "Add or schedule the missing Default Playlist image/video content.",
      "Approve the content after saving the schedule.",
      "Replace unsupported media with supported formats.",
      "Correct the target playlist or location mapping, then publish again.",
      "If publish still fails, capture the error message and affected campaign details for escalation."
    ],
    nextSteps: [
      "Ask for the exact error message and screenshot.",
      "Validate Default Playlist first, then campaign schedule, then publish again.",
      "Confirm device sync after successful publish."
    ],
    clientResponse:
      "The publish error is usually caused by a missing Default Playlist requirement or content that is not fully scheduled/approved. We will verify the Default Playlist, content format, approval status, and playlist mapping, then republish once the missing requirement is corrected."
  }
];

const platformRequirements: PlatformRequirement[] = [
  {
    platform: "Android",
    triggers: ["android", "android device", "android devices", "android player", "android tv", "android media player"],
    osVersion: "Android 11 and above",
    processor: ["Rockchip RK3328 Cortex A53, Quad Core", "Amlogic S905 Cortex A53, Quad Core"],
    systemType: "64-bit recommended",
    memory: ["8 GB RAM / 128 GB ROM recommended", "4 GB RAM / 64 GB ROM minimum"],
    mediaFormats: ["Images: PNG, JPG, JPEG", "Videos: MP4, MKV"],
    programmaticNotes: ["Programmatic playback is fully supported on Android 11+ when WebView Version is 100 or above.", "Supported programmatic formats: VAST, URL, HTML online content."],
    source: "MW Content Software Supported & System Requirements"
  },
  {
    platform: "Windows",
    triggers: ["windows", "windows device", "windows devices", "windows player"],
    osVersion: "Windows 10 and 11",
    processor: ["Intel Core i5 or i7 recommended", "Intel Pentium II/III or AMD Processor supported"],
    systemType: "64-bit recommended; 32-bit supported",
    memory: ["8 GB RAM and above recommended", "4 GB RAM minimum", "1 GB Graphics Card and above"],
    mediaFormats: ["Images: PNG, JPG, JPEG", "Videos: MP4, MOV, WEBM, WMV"],
    programmaticNotes: ["Windows 10 and 11 fully support VAST, URL, HTML, Offline ZIP, and Online ZIP."],
    source: "MW Content Software Supported & System Requirements"
  },
  {
    platform: "Linux",
    triggers: ["linux", "linux device", "linux devices", "ubuntu"],
    osVersion: "Ubuntu 18.04 LTS and above",
    processor: ["Intel Core i5 or i7 recommended", "Intel Pentium II/III supported"],
    systemType: "64-bit recommended; 32-bit supported",
    memory: ["8 GB RAM and above recommended", "4 GB RAM minimum", "1 GB Graphics Card and above"],
    mediaFormats: ["Images: PNG, JPG, JPEG", "Videos: MP4, MOV, WEBM"],
    source: "MW Content Software Supported & System Requirements"
  },
  {
    platform: "LG webOS",
    triggers: ["lg webos", "webos", "lg"],
    osVersion: "LG webOS Signage 4.0.1",
    processor: ["alpha 5 Gen5 AI / ARM Cortex-A53, Quad-Core 1.0 GHz"],
    systemType: "64-bit recommended",
    memory: ["4 GB RAM / 16 GB ROM", "2 GB RAM / 8 GB ROM"],
    mediaFormats: ["Images: PNG, JPG, JPEG", "Videos: MP4"],
    programmaticNotes: ["LG webOS has limited feature support. Heavy HTML/VAST may require custom player handling."],
    source: "MW Content Software Supported & System Requirements"
  },
  {
    platform: "BrightSign",
    triggers: ["brightsign", "bright sign"],
    osVersion: "BrightSign HS123, XT1143, HD224",
    processor: ["ARM Cortex-A15, Quad-Core 1.0 and 2.0 GHz"],
    systemType: "64-bit recommended",
    memory: ["4 GB RAM / 16 GB ROM", "2 GB RAM / 8 GB ROM"],
    mediaFormats: ["Images: PNG, JPG, JPEG", "Videos: MP4"],
    source: "MW Content Software Supported & System Requirements"
  }
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

  // If the user asked a direct question, prefer how-to/definition or troubleshooting
  if (/\?|^\s*(how|what|why|when|where)\b/.test(message) || /^\s*(how|what|why|when|where)\b/.test(normalized)) {
    if (/\b(why|error|fail|failed|not|cannot|can't|unable|stuck)\b/.test(normalized)) {
      return "troubleshooting";
    }

    if (/\b(how|create|setup|set up|install|pair|publish|schedule|upload|add|generate|download)\b/.test(normalized)) {
      return "how_to";
    }

    if (/\b(what is|meaning|define|definition|explain)\b/.test(normalized)) {
      return "definition";
    }
  }

  // Troubleshooting signals must win over requirements keywords (e.g. "android device offline")
  if (/\b(why|error|issue|problem|not|fail|failed|offline|black|blank|wrong|missing|stuck|cannot|can't|unable)\b/.test(normalized)) {
    return "troubleshooting";
  }

  if (/\b(requirement|requirements|spec|hardware|os|operating system|support|supported|format|formats|webview|android|windows)\b/.test(normalized)) {
    return "requirements";
  }

  if (/\b(playlog|playlogs|report|proof of play|log)\b/.test(normalized)) {
    return "reporting";
  }

  if (/\b(how|create|setup|set up|install|pair|publish|schedule|upload|add|generate|download)\b/.test(normalized)) {
    return "how_to";
  }

  return "general";
}

function expandTerms(message: string, intake?: IssueIntake) {
  const normalized = normalize([message, intake?.issueCategory, intake?.description, intake?.deviceOs].filter(Boolean).join(" "));
  const words = normalized.split(/\s+/).filter(Boolean);
  const terms = new Set(
    words
      .filter((word) => word.length > 2 && !stopWords.has(word))
  );

  // Add adjacent bigrams and trigrams to capture phrase matches like "black screen", "proof of play"
  for (let i = 0; i < words.length - 1; i++) {
    const bigram = `${words[i]} ${words[i + 1]}`;
    if (bigram.length > 4 && !stopWords.has(words[i]) && !stopWords.has(words[i + 1])) {
      terms.add(bigram);
    }
    if (i < words.length - 2) {
      const trigram = `${words[i]} ${words[i + 1]} ${words[i + 2]}`;
      if (!stopWords.has(words[i]) && !stopWords.has(words[i + 2])) {
        terms.add(trigram);
      }
    }
  }

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

  return Array.from(terms).slice(0, 200);
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

function readKnowledgeChunks() {
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

let _chunkCache: ReturnType<typeof readKnowledgeChunks> | null = null;

function getCachedChunks() {
  if (!_chunkCache) {
    _chunkCache = readKnowledgeChunks();
  }
  return _chunkCache;
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
  return haystack.match(new RegExp(`(?<![a-z0-9])${escaped}(?![a-z0-9])`, "g"))?.length ?? 0;
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
      // Tuned weights: prefer phrase matches, but give more weight to headings/topics
      score += bodyHits * (normalizedTerm.includes(" ") ? 10 : 4);
      score += headingHits * 18;
      score += topicHits * 22;
    }
  }

  if (intake?.issueCategory && intake.issueCategory !== "Other" && chunk.topic === intake.issueCategory) {
    score += 100;
  }

  if (intent === "troubleshooting" && /\b(troubleshoot|issue|possible causes|checks|common mistakes|quick fixes)\b/.test(body)) {
    score += 45;
  }

  if (intent === "how_to" && /\b(steps|step|create|click|select|save|publish|install|pair)\b/.test(body)) {
    score += 40;
  }

  if (intent === "requirements" && /\b(requirements|supported|hardware|android|windows|webview|format|spec)\b/.test(body)) {
    score += 40;
  }

  if (intent === "reporting" && /\b(playlog|report|csv|pdf|download|proof)\b/.test(body)) {
    score += 40;
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

  const best = lmxKnowledge
    .map((entry) => ({
      entry,
      score:
        (normalize(entry.category) === normalizedTopic ? 100 : 0) +
        entry.keywords.reduce((total, keyword) => total + (normalizedMessage.includes(normalize(keyword)) ? 8 : 0), 0) +
        terms.reduce((total, term) => total + (entry.keywords.some((keyword) => normalize(keyword) === normalize(term)) ? 3 : 0), 0)
    }))
    .sort((a, b) => b.score - a.score)[0];

  // Require at least one keyword match to avoid returning an unrelated entry
  return (best?.score ?? 0) >= 8 ? best?.entry : undefined;
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
  const lines = uniqueLines(items).slice(0, limit);
  return lines.length > 0 ? lines.map((item) => `- ${item}`).join("\n") : "- No matching action found in the local knowledge. Ask for the screen/module and error details.";
}

function findPlaybook(message: string, terms: string[]) {
  const normalizedMessage = normalize(message);
  const normalizedTerms = terms.map(normalize);

  return supportPlaybooks
    .map((playbook) => ({
      playbook,
      score: playbook.triggers.reduce((total, trigger) => {
        const normalizedTrigger = normalize(trigger);
        const phraseHit = normalizedMessage.includes(normalizedTrigger) ? 15 : 0;
        const termHit = normalizedTerms.includes(normalizedTrigger) ? 8 : 0;
        const wordHits = normalizedTrigger
          .split(/\s+/)
          .filter((word) => word.length > 2)
          .reduce((totalWords, word) => totalWords + (normalizedMessage.includes(word) ? 1 : 0), 0);
        return total + phraseHit + termHit + wordHits;
      }, 0)
    }))
    .sort((a, b) => b.score - a.score)[0];
}

function findPlatformRequirement(message: string) {
  const normalizedMessage = normalize(message);

  // Accept explicit requirement keywords OR platform names as sufficient signal
  const asksRequirement = /\b(requirement|requirements|spec|specs|specification|hardware|os|operating system|ram|rom|processor|cpu|support|supported|recommend|recommended|minimum|compatible|android|windows|linux|webos|brightsign)\b/.test(normalizedMessage);

  if (!asksRequirement) {
    return undefined;
  }

  return platformRequirements.find((requirement) =>
    requirement.triggers.some((trigger) => normalizedMessage.includes(normalize(trigger)))
  );
}

function buildGeneralRequirementsAnswer() {
  return `LMX Content System Requirements

LMX Content supports the following platforms. Ask about a specific one for full hardware specs.

Supported platforms
- Android: Android 11 and above. Minimum 4 GB RAM / 64 GB ROM; recommended 8 GB RAM / 128 GB ROM.
- Windows: Windows 10 and 11. Minimum 4 GB RAM; recommended Intel Core i5 or i7.
- Linux: Ubuntu 18.04 LTS and above. Minimum 4 GB RAM.
- LG webOS: webOS Signage 4.0.1. 2–4 GB RAM / 8–16 GB ROM.
- BrightSign: Models HS123, XT1143, HD224.

Recommended media formats
- Images: PNG, JPG, JPEG
- Videos: MP4 (supported on all platforms); MOV, WEBM, WMV on Windows/Linux

What to check
- Confirm the device OS and version meets the minimum requirement for its platform.
- Confirm RAM, ROM, and processor class match at least the minimum — preferably the recommended spec.
- For programmatic or HTML playback, confirm WebView version 100+ (Android) or a modern browser (Windows/Linux).

Next step
- Ask the client for the exact device model, OS version, CPU, RAM, and ROM.
- Compare against the platform requirements above before approving the device.
- For full hardware details, ask: "Android requirements", "Windows requirements", etc.`;
}

function buildPlatformRequirementAnswer(requirement: PlatformRequirement) {
  return `${requirement.platform} Device Requirements

Core requirement
- OS Version: ${requirement.osVersion}
- Processor: ${requirement.processor.join(" / ")}
- System Type: ${requirement.systemType}
- Memory/Storage: ${requirement.memory.join(" / ")}

What to check
- Confirm the device OS is ${requirement.osVersion}.
- Confirm the CPU matches or is equivalent to the recommended processor class.
- Confirm the device is 64-bit where possible.
- Confirm RAM and ROM meet at least the minimum requirement, preferably the recommended requirement.
${requirement.mediaFormats ? `- Confirm media formats needed by the client are supported: ${requirement.mediaFormats.join("; ")}.` : ""}
${requirement.programmaticNotes ? `- For programmatic or widget playback, confirm: ${requirement.programmaticNotes.join(" ")}` : ""}

How to fix / action
- If the device is below the minimum requirement, do not onboard it for production playback.
- If the device meets minimum but not recommended specs, use it only for simple image/video playback and avoid heavy HTML, VAST, widgets, or split layouts.
- For new procurement, recommend the stated recommended RAM/ROM and processor class.

Next step
- Ask the client for the exact device model, Android version, CPU, RAM, ROM/storage, and WebView version if programmatic/HTML playback is required.
- Compare the device details against the requirements above before approving it.

Client response
For ${requirement.platform}, the required OS is ${requirement.osVersion}. Recommended hardware is ${requirement.processor.join(" or ")} with ${requirement.systemType}, and ${requirement.memory[0]}. Minimum accepted memory/storage is ${requirement.memory[1] ?? requirement.memory[0]}. Please share the exact device model and specs so we can confirm whether it is suitable for LMX Content.

Source
- ${requirement.source}`;
}

function actionLines(matches: LocalSearchMatch[], patterns: RegExp[]) {
  const lines = matches.flatMap((match) => bulletLines(match.content));
  const preferred = lines.filter((line) => patterns.some((pattern) => pattern.test(normalize(line))));
  return preferred.length > 0 ? preferred : lines;
}

function confidenceFor(matches: LocalSearchMatch[]) {
  const best = matches[0]?.score ?? 0;
  const second = matches[1]?.score ?? 0;

  if (best === 0) {
    return "low";
  }

  const gap = best - second;
  // Ratio of the gap to the best score — stable as corpus grows
  const gapRatio = second > 0 ? gap / best : 1;

  if (best >= 80 || (best >= 45 && gapRatio >= 0.25)) {
    return "high";
  }

  if (best >= 18) {
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

function buildTroubleshootingAnswer(topic: string, entry: KnowledgeEntry | undefined, matches: LocalSearchMatch[], message: string, terms: string[]) {
  const playbookMatch = findPlaybook(message, terms);
  const playbook = playbookMatch && playbookMatch.score >= 8 ? playbookMatch.playbook : undefined;
  const issueSpecific = actionLines(matches.slice(0, 2), [
    /\b(check|confirm|verify|review|validate|ensure|open|go to|select|compare)\b/,
    /\b(republish|restart|reboot|sync|synchronization|publish|remove|clean|update|replace|trigger)\b/
  ]);
  const steps = entry?.steps ?? [];
  const checks = playbook?.whatToCheck ?? issueSpecific;
  const fixes = playbook?.howToFix ?? [...steps, ...issueSpecific];
  const nextSteps = playbook?.nextSteps ?? [
    "Collect the affected device, network, location, playlist, campaign, publish time, and screenshot or playback evidence.",
    "Validate the result after applying the fix.",
    "Escalate with CMS screenshots, device status, schedule details, and playlog evidence if the issue continues."
  ];

  return `${playbook?.title ?? topic}

${playbook?.summary ?? entry?.overview ?? "Use the matching training knowledge below to isolate the issue and apply the correct next action."}

What to check
${formatBullets(checks, 7)}

How to fix
${formatBullets(fixes, 6)}

Next action
${formatBullets(nextSteps, 4)}

Client response
${playbook?.clientResponse ?? "We are checking the CMS setup, device status, publish/sync status, and playback evidence to identify the cause. Once verified, we will apply the correct fix and confirm the playback result."}`;
}

function buildStandardAnswer(topic: string, entry: KnowledgeEntry | undefined, matches: LocalSearchMatch[], intent: SearchIntent) {
  const matchedBullets = actionLines(matches.slice(0, 2), [/\b(click|select|go to|enter|choose|save|approve|publish|download|upload|create|set|enable|verify|confirm|check)\b/]);
  const steps = entry?.steps ?? [];
  const notes = entry?.importantNotes ?? [];
  const heading = intent === "requirements" ? "What to check" : "How to do it";
  const nextSteps =
    intent === "reporting"
      ? ["Download or regenerate the report after confirming filters and date range.", "If expected data is missing, verify playback, device sync, and selected report level."]
      : ["Verify the result in CMS and on the affected device/screen.", "If it fails, capture the error message, screenshot, and affected module before escalating."];

  return `${topic}

${entry?.overview ?? "Here is the best matching guidance from the local LMX Content training knowledge."}

${heading}
${formatBullets([...matchedBullets, ...steps], 7)}

What to check
${formatBullets(notes.length > 0 ? notes : matchedBullets.slice(3), 4)}

Next step
${formatBullets(nextSteps, 3)}`;
}

export function buildLocalSearchResponse(message: string, intake?: IssueIntake): LocalSearchResult {
  const intent = detectIntent(message);
  const queryTerms = expandTerms(message, intake);
  const chunks = getCachedChunks();
  const matches = chunks
    .map((chunk) => scoreChunk(chunk, queryTerms, intent, intake))
    .filter((match) => match.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);
  const platformRequirement = intent === "requirements" ? findPlatformRequirement(message) : undefined;

  if (platformRequirement) {
    return {
      intent,
      queryTerms,
      matches,
      confidence: "high",
      answer: buildPlatformRequirementAnswer(platformRequirement)
    };
  }

  if (intent === "requirements") {
    return {
      intent,
      queryTerms,
      matches,
      confidence: "high",
      answer: buildGeneralRequirementsAnswer()
    };
  }

  const confidence = confidenceFor(matches);

  if (confidence === "low") {
    try {
      logLowConfidenceQuery({
        message,
        intake: intake ? { issueCategory: intake.issueCategory, deviceOs: intake.deviceOs, description: intake.description } : undefined,
        queryTerms,
        topMatches: matches.slice(0, 3).map((m) => ({ topic: m.topic, heading: m.heading, score: m.score }))
      });
    } catch {
      // ignore
    }

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
      ? buildTroubleshootingAnswer(String(topTopic), entry, matches, message, queryTerms)
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
