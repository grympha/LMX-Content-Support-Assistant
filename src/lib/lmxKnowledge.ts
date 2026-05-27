export type IssueCategory =
  | "Black Screen"
  | "Device Offline"
  | "Content Not Playing"
  | "Content Not Syncing"
  | "Default Playlist Showing"
  | "Missing Playlog"
  | "Device Pairing Issue"
  | "Publishing Issue"
  | "Android Compatibility"
  | "Programmatic Issue"
  | "Other";

export type IssueIntake = {
  clientTenant?: string;
  network?: string;
  location?: string;
  deviceName?: string;
  deviceOs?: string;
  issueCategory?: IssueCategory | "";
  contentCampaign?: string;
  startTime?: string;
  mediaLink?: string;
  description?: string;
};

export type KnowledgeEntry = {
  category: IssueCategory | "Scheduling Content";
  keywords: string[];
  summary: string;
  possibleCause: string[];
  checksRequired: string[];
  recommendedAction: string[];
  escalationNeeded: string;
  clientReplyDraft: string;
};

export const issueCategories: IssueCategory[] = [
  "Black Screen",
  "Device Offline",
  "Content Not Playing",
  "Content Not Syncing",
  "Default Playlist Showing",
  "Missing Playlog",
  "Device Pairing Issue",
  "Publishing Issue",
  "Android Compatibility",
  "Programmatic Issue",
  "Other"
];

export const lmxKnowledge: KnowledgeEntry[] = [
  {
    category: "Scheduling Content",
    keywords: ["schedule", "scheduling", "campaign time", "start date", "end date"],
    summary: "Scheduling issues usually come from campaign timing, playlist assignment, publish status, timezone, or device sync delay.",
    possibleCause: ["Incorrect start or end date", "Wrong timezone", "Content assigned to the wrong network, location, or device", "Campaign saved but not published", "Device has not synced after publish"],
    checksRequired: ["Confirm campaign start and end time", "Confirm target network, location, device, and playlist", "Check publish status in CMS", "Check device online and last sync time", "Confirm content format is supported by the player"],
    recommendedAction: ["Correct the schedule and targeting if needed", "Publish the campaign again", "Trigger or wait for device sync", "Ask for campaign name, device name, and screenshot if still not playing"],
    escalationNeeded: "Escalate only if the campaign is correctly published, the device is syncing, and content still does not appear after normal sync time.",
    clientReplyDraft: "We are checking the campaign schedule, target assignment, and publish status. We will also verify whether the device has synced after the latest publish."
  },
  {
    category: "Android Compatibility",
    keywords: ["android", "compatibility", "device spec", "hardware", "webview", "ram", "storage"],
    summary: "Android support should be checked against the official LMX baseline before confirming suitability.",
    possibleCause: ["Android version below requirement", "Insufficient RAM", "Insufficient storage", "Weak CPU", "Outdated or incompatible Android WebView"],
    checksRequired: ["Android 11 or newer", "Minimum 4GB RAM", "Minimum 32GB or 64GB storage", "Quad-core CPU", "Android WebView compatibility and update status"],
    recommendedAction: ["Request full device model, Android version, RAM, storage, CPU, and WebView version", "Avoid confirming support until all required specs are verified", "Recommend a tested device if the model does not meet baseline requirements"],
    escalationNeeded: "Escalate to engineering or product only when the device meets baseline requirements but still fails during player installation, playback, or WebView rendering.",
    clientReplyDraft: "To confirm Android compatibility, please share the device model, Android version, RAM, storage capacity, CPU details, and WebView version. We will compare it against the LMX player requirements before confirming suitability."
  },
  {
    category: "Black Screen",
    keywords: ["black screen", "blank screen", "screen black", "no display"],
    summary: "Black screen troubleshooting must cover the device, player app, storage, network, CMS publish status, content compatibility, display, and programmatic delivery where relevant.",
    possibleCause: ["Player app crashed or not running", "Device storage is full", "Network interruption during content download", "No valid published content", "Unsupported or corrupted content", "Display input or HDMI issue", "Programmatic ad delivery returned no fill or failed to render"],
    checksRequired: ["Device power and status", "Player app running state", "Available storage", "Network connectivity", "CMS publish status", "Content file type, resolution, and duration", "Screen input, cable, and display power", "Programmatic delivery logs if applicable"],
    recommendedAction: ["Restart player app or device", "Clear storage only through approved support steps", "Republish known-good content", "Test with a simple image or video", "Confirm display input and cable", "Collect screenshot, device logs, and campaign details before escalation"],
    escalationNeeded: "Escalate if device, player app, storage, network, CMS publish status, content compatibility, display, and programmatic delivery checks all pass but the screen remains black.",
    clientReplyDraft: "We are checking the player status, device storage, network, published content, content compatibility, and screen connection. If programmatic content is involved, we will also review delivery behavior without assigning internal blame."
  },
  {
    category: "Device Offline",
    keywords: ["offline", "device offline", "heartbeat", "still playing", "online status"],
    summary: "A device can show offline in CMS while still playing cached content locally.",
    possibleCause: ["Heartbeat not reaching CMS", "Unstable network", "Firewall or DNS restriction", "Device sleep mode", "Player app crash", "Internet drop while cached playlist continues"],
    checksRequired: ["Last heartbeat time", "Network connection and internet stability", "Sleep mode or power saving settings", "Firewall and DNS access", "Player app running state", "Whether cached content is still playing"],
    recommendedAction: ["Ask onsite team to confirm internet access", "Restart network connection and player app", "Disable sleep or battery optimization", "Check firewall allowlist", "Collect last heartbeat and device logs if issue persists"],
    escalationNeeded: "Escalate if network, firewall, sleep mode, and player app checks pass but the heartbeat still does not recover.",
    clientReplyDraft: "The screen may continue playing cached content even if the CMS shows the device offline. We are checking the heartbeat, network stability, sleep settings, firewall access, and player app status."
  },
  {
    category: "Missing Playlog",
    keywords: ["playlog", "missing log", "proof of play", "report missing"],
    summary: "Missing playlog cases depend on whether the player was active, content actually played, the date range is valid, and the device could upload logs.",
    possibleCause: ["Player was inactive", "Content did not actually play", "Selected date range is outside retention or reporting limits", "Device was offline and logs have not uploaded", "Playback event failed to sync"],
    checksRequired: ["Player active state during the period", "Campaign and content playback confirmation", "Report date range", "Device connectivity during and after playback", "Any delayed upload behavior"],
    recommendedAction: ["Confirm exact date, content, device, and campaign", "Check if device came online after playback", "Re-run report with the correct date range", "Collect playback evidence and device logs when needed"],
    escalationNeeded: "Escalate if playback is confirmed, date range is valid, the device is online, and playlog still does not appear after expected upload time.",
    clientReplyDraft: "We are verifying whether the player was active, the content actually played, the report date range is valid, and the device had connectivity to upload playlogs."
  },
  {
    category: "Default Playlist Showing",
    keywords: ["default playlist", "fallback playlist", "wrong playlist", "default content"],
    summary: "Default playlist appears when the device has no valid higher-priority playable content or cannot sync the assigned content.",
    possibleCause: ["Campaign not published", "Schedule not active", "Targeting mismatch", "Content download failed", "Assigned content unsupported", "Device has not synced"],
    checksRequired: ["Current active campaign schedule", "Device and location targeting", "CMS publish status", "Playlist priority", "Device sync time", "Content compatibility and download status"],
    recommendedAction: ["Correct targeting and active schedule", "Republish campaign", "Trigger device sync", "Test with a supported known-good asset", "Ask for device name and campaign if missing"],
    escalationNeeded: "Escalate if targeting, schedule, publish, sync, and content compatibility all look correct but default playlist still overrides assigned content.",
    clientReplyDraft: "The default playlist normally appears when no valid assigned content is available to the player. We are checking schedule, targeting, publish status, sync, and content compatibility."
  },
  {
    category: "Publishing Issue",
    keywords: ["publish", "publishing", "cannot publish", "publish failed"],
    summary: "Publishing issues are usually caused by validation, targeting, content readiness, schedule conflicts, or CMS processing delay.",
    possibleCause: ["Required fields missing", "Invalid targeting", "Unsupported content", "Schedule conflict", "Temporary CMS processing delay"],
    checksRequired: ["CMS error message", "Campaign setup completeness", "Content processing status", "Target network, location, and devices", "Schedule validity"],
    recommendedAction: ["Capture the exact error message", "Validate campaign fields and content status", "Save and publish again", "Try a known-good asset if content processing is suspected", "Escalate with campaign ID and screenshots if repeatable"],
    escalationNeeded: "Escalate when the same publish action fails repeatedly with a valid campaign setup and clear reproduction details.",
    clientReplyDraft: "We are reviewing the campaign setup, content readiness, schedule, and publish error message. Please share the exact error shown if the issue repeats."
  },
  {
    category: "Device Pairing Issue",
    keywords: ["pair", "pairing", "activation", "code", "device code"],
    summary: "Pairing issues usually involve expired codes, wrong tenant, connectivity, duplicate registration, or player app setup.",
    possibleCause: ["Expired pairing code", "Wrong tenant or network selected", "Device already paired elsewhere", "Network cannot reach CMS", "Player app version issue"],
    checksRequired: ["Tenant and network", "Pairing code freshness", "Device internet access", "Existing device registration", "Player app version"],
    recommendedAction: ["Generate a new pairing code", "Confirm tenant and network", "Remove duplicate or stale registration if approved", "Restart player app", "Collect code, device name, and screenshot if still failing"],
    escalationNeeded: "Escalate if a fresh code, correct tenant, active network, and clean device registration still fail.",
    clientReplyDraft: "We are checking the pairing code, tenant, network, device connectivity, and whether the device may already be registered."
  },
  {
    category: "Content Not Syncing",
    keywords: ["sync", "not syncing", "download", "content missing", "stuck"],
    summary: "Content sync issues need device connectivity, storage, publish status, content compatibility, and download state checks.",
    possibleCause: ["Device offline", "Storage full", "Campaign not published", "Large file still downloading", "Unsupported file", "Network blocks download endpoint"],
    checksRequired: ["Device online and last sync", "Storage availability", "CMS publish status", "File size and type", "Network stability", "Download or player logs"],
    recommendedAction: ["Republish and trigger sync", "Free storage through approved steps", "Test with a smaller known-good file", "Verify firewall and internet access", "Collect logs if sync remains stuck"],
    escalationNeeded: "Escalate when device connectivity, storage, publish status, and file compatibility are confirmed but sync still fails.",
    clientReplyDraft: "We are checking whether the device is online, has enough storage, has received the latest publish, and can download the assigned content."
  },
  {
    category: "Programmatic Issue",
    keywords: ["programmatic", "ad", "vast", "bid", "no fill", "delivery", "ad tag"],
    summary: "Programmatic troubleshooting should separate CMS/player health from ad decisioning, creative delivery, and rendering.",
    possibleCause: ["No fill from demand source", "Invalid or blocked ad tag", "Creative format not compatible", "Network blocks ad delivery", "Player cannot render returned creative"],
    checksRequired: ["Campaign and device setup", "Ad tag or programmatic configuration", "Delivery response or no-fill behavior", "Creative format and duration", "Network access to ad endpoints", "Player logs around ad request time"],
    recommendedAction: ["Confirm exact device, time, campaign, and ad configuration", "Test with a known-good non-programmatic asset", "Review delivery response if available", "Collect player logs and screenshot/video evidence"],
    escalationNeeded: "Escalate when CMS setup and player health are confirmed and the issue points to delivery response, creative rendering, or platform integration behavior.",
    clientReplyDraft: "We are checking the player and CMS setup first, then reviewing programmatic delivery behavior such as ad response, creative compatibility, and network access."
  }
];

const formatList = (items: string[]) => items.map((item) => `- ${item}`).join("\n");

export function findKnowledgeEntry(message: string, intake?: IssueIntake): KnowledgeEntry {
  const haystack = `${message} ${intake?.issueCategory ?? ""} ${intake?.description ?? ""}`.toLowerCase();

  const exactCategory = lmxKnowledge.find((entry) => entry.category === intake?.issueCategory);
  if (exactCategory && intake?.issueCategory !== "Other") {
    return exactCategory;
  }

  const scored = lmxKnowledge
    .map((entry) => ({
      entry,
      score: entry.keywords.reduce((total, keyword) => total + (haystack.includes(keyword) ? 1 : 0), 0)
    }))
    .sort((a, b) => b.score - a.score);

  return scored[0]?.score > 0 ? scored[0].entry : lmxKnowledge.find((entry) => entry.category === "Publishing Issue") ?? lmxKnowledge[0];
}

export function missingIntakeFields(intake?: IssueIntake): string[] {
  if (!intake) {
    return ["Client / Tenant", "Device Name", "Device OS", "Issue Category", "Description"];
  }

  const checks: Array<[keyof IssueIntake, string]> = [
    ["clientTenant", "Client / Tenant"],
    ["deviceName", "Device Name"],
    ["deviceOs", "Device OS"],
    ["issueCategory", "Issue Category"],
    ["description", "Description"]
  ];

  return checks.filter(([key]) => !intake[key]).map(([, label]) => label);
}

export function buildFallbackResponse(message: string, intake?: IssueIntake): string {
  const entry = findKnowledgeEntry(message, intake);
  const missing = missingIntakeFields(intake);
  const contextLine = intake?.clientTenant || intake?.deviceName
    ? ` Case context: ${[intake?.clientTenant, intake?.network, intake?.location, intake?.deviceName].filter(Boolean).join(" / ")}.`
    : "";
  const missingLine = missing.length > 0 ? ` Missing information to request: ${missing.join(", ")}.` : "";

  return [
    `Summary:\n${entry.summary}${contextLine}${missingLine}`,
    `Possible Cause:\n${formatList(entry.possibleCause)}`,
    `Checks Required:\n${formatList(entry.checksRequired)}`,
    `Recommended Action:\n${formatList(entry.recommendedAction)}`,
    `Escalation Needed:\n${entry.escalationNeeded}`,
    `Client Reply Draft:\n${entry.clientReplyDraft}`
  ].join("\n\n");
}

export const assistantSystemPrompt = `Act as a senior LMX Content CMS support engineer.

Every response must follow exactly this format:

Summary:
Possible Cause:
Checks Required:
Recommended Action:
Escalation Needed:
Client Reply Draft:

Rules:
- Be clear, practical, professional, and troubleshooting focused.
- Do not guess. Ask for missing information when needed.
- Use neutral client communication and never expose internal blame.
- For black screen cases, always check device, player app, storage, network, CMS publish status, content compatibility, screen/display, and programmatic delivery if relevant.
- For Android compatibility, compare against official LMX requirements: Android 11+, 4GB RAM minimum, 32GB/64GB storage minimum, quad-core CPU, and WebView compatibility.
- For device offline cases, check heartbeat, network, sleep mode, firewall, player crash, and internet stability.
- For playlog cases, check player active state, whether content actually played, date limitations, and device connectivity.`;
