export type IssueCategory =
  | "Dashboard Overview"
  | "Create Network"
  | "Create Location"
  | "Create Playlist"
  | "Create Layout"
  | "Create Device"
  | "Device Pairing"
  | "Storage Management"
  | "Default Playlist"
  | "Schedule Content"
  | "Bundle Scheduling"
  | "Publish Content"
  | "Playlogs"
  | "User Management"
  | "Android Installation"
  | "Windows Installation"
  | "Device Requirements"
  | "Programmatic / VAST"
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
  category: IssueCategory;
  keywords: string[];
  overview: string;
  whenToUse: string[];
  steps: string[];
  importantNotes: string[];
  commonMistakes: string[];
  nextStep: string;
};

export const issueCategories: IssueCategory[] = [
  "Dashboard Overview",
  "Create Network",
  "Create Location",
  "Create Playlist",
  "Create Layout",
  "Create Device",
  "Device Pairing",
  "Storage Management",
  "Default Playlist",
  "Schedule Content",
  "Bundle Scheduling",
  "Publish Content",
  "Playlogs",
  "User Management",
  "Android Installation",
  "Windows Installation",
  "Device Requirements",
  "Programmatic / VAST",
  "Other"
];

function lesson(
  category: IssueCategory,
  keywords: string[],
  overview: string,
  steps: string[],
  notes: string[],
  mistakes: string[],
  nextStep: string
): KnowledgeEntry {
  return {
    category,
    keywords,
    overview,
    whenToUse: [`Training users on ${category}`, "Guiding new CMS users", "Confirming the correct CMS workflow"],
    steps,
    importantNotes: notes,
    commonMistakes: mistakes,
    nextStep
  };
}

export const lmxKnowledge: KnowledgeEntry[] = [
  lesson("Dashboard Overview", ["dashboard", "online", "offline", "storage", "status"], "Use the Dashboard to review device health, storage usage, notifications, and CMS/player release information.", ["Open Dashboard", "Review Online, Offline, and Unpaired counters", "Check Storage Usage", "Open notifications", "Review release/player version information"], ["Investigate offline or unpaired devices from Device Manager", "Resolve pending or placeholder content early"], ["Ignoring offline devices", "Missing storage warnings"], "Continue with Network, Location, Playlist, Device, or Schedule setup."),
  lesson("Create Network", ["network", "playlog interval", "background download"], "A Network organizes devices, users, playback hours, reporting, and content rules.", ["Go to Network", "Click Create", "Enter Network Name", "Set Start Time and End Time", "Configure tags, playlog interval, background download, volume, and brightness if needed", "Keep Status enabled", "Save"], ["Keep Play Log enabled", "Use clear naming", "Use separate networks when schedules or access differ"], ["Wrong playback hours", "Play Log disabled", "Status disabled"], "Create Locations under the Network."),
  lesson("Create Location", ["location", "timezone", "zone", "subzone"], "A Location represents where screens are deployed and controls schedule timezone context.", ["Go to Setup > Location", "Click Create", "Enter Location Name", "Select Country, Region, and Time Zone", "Enter Zone and Subzone", "Keep Status enabled", "Save"], ["Timezone affects scheduling accuracy", "Use consistent location naming"], ["Wrong timezone", "Unclear naming", "Creating devices before locations are ready"], "Create playlists and devices for the location."),
  lesson("Create Playlist", ["playlist", "normal", "fixed", "prime", "dependent"], "A Playlist controls the media sequence, duration, and playback type for a location.", ["Go to Setup > Playlist", "Click Create Playlist", "Enter Playlist Name", "Set Duration", "Select Type", "Assign Location", "Keep Play Type as Timer unless needed", "Keep Status enabled", "Save"], ["Match playlist duration to the content loop", "Use Prime for day-part campaigns"], ["Wrong location", "Duration mismatch", "Status disabled"], "Add content or create a schedule using the playlist."),
  lesson("Create Layout", ["layout", "tag", "zone", "split screen"], "A Layout divides a screen into zones, with each tag linked to a playlist.", ["Go to Setup > Layout", "Click Create Layout", "Enter Layout Name", "Assign Location", "Choose Percentage or Pixel scale", "Select Screen Type", "Add tags with playlist and dimensions", "Save"], ["Every tag needs a playlist", "Use percentage scaling for mixed screen sizes"], ["Tags without playlists", "Too many zones", "Wrong resolution"], "Use the layout for multi-zone content playback."),
  lesson("Create Device", ["device", "device manager", "verification code"], "A Device is the CMS record for the physical player or screen.", ["Go to Device Manager", "Click Add Device", "Enter Device Name", "Assign Location", "Confirm Network, playback time, screen type, and Status", "Save", "Copy verification code"], ["Device must be in the correct location", "Status should be enabled"], ["Wrong location", "Non-unique device name", "Status disabled"], "Open the player app and pair with the verification code."),
  lesson("Device Pairing", ["pair", "pairing", "verification", "code"], "Pairing links the physical player app to the CMS device record.", ["Create the device in CMS", "Copy the verification code", "Open the player app", "Choose Login with Verification Code", "Enter the code", "Confirm device sync"], ["Verification codes are one-time use only", "Device needs internet access"], ["Expired code", "Wrong tenant or location", "No internet"], "Publish test content and validate playback."),
  lesson("Storage Management", ["storage", "upload", "media", "folder"], "Storage is used to upload, organize, manage, and clean up media files.", ["Open Storage", "Check available capacity", "Upload supported files", "Organize folders", "Use assets in playlists or schedules", "Remove unused files carefully"], ["Deleting content can affect active playlists", "Check supported formats"], ["Deleting scheduled content", "Ignoring capacity"], "Add uploaded content to a playlist or schedule."),
  lesson("Default Playlist", ["default playlist", "fallback", "image", "video"], "Default Playlist is required fallback content and must be prepared before scheduling and publishing.", ["Go to Setup > Default Playlist", "Add one image creative", "Create schedule and save", "Approve it", "Add one video creative", "Create schedule and save", "Approve it"], ["At least one scheduled image and one scheduled video are required", "Uploading alone is not enough"], ["Missing image or video schedule", "Forgetting approval"], "Continue with scheduling and publishing."),
  lesson("Schedule Content", ["schedule", "scheduling", "campaign", "daypart", "spot"], "Scheduling assigns content to the correct playlist, location, time, and playback rules.", ["Confirm Network and Location", "Confirm Playlist", "Upload or select supported content", "Create schedule", "Set duration, dates, daypart or spot", "Save", "Approve if required", "Publish"], ["Timezone must match location", "Default Playlist must be ready", "Device must sync after publish"], ["Wrong playlist", "Schedule outside active time", "Not approving content"], "Validate playback with device status, metrics, or playlogs."),
  lesson("Bundle Scheduling", ["bundle", "bundle schedule"], "Bundle scheduling manages grouped schedules or related content together.", ["Confirm target network and location", "Prepare playlist and content", "Create or select bundle schedule", "Set active dates and timing", "Save and approve", "Publish", "Validate playback"], ["Default Playlist requirements still apply", "Device sync is still required"], ["Wrong target playlist", "Missing approval"], "Check metrics or playlogs."),
  lesson("Publish Content", ["publish", "publishing", "unable to publish", "error"], "Publishing sends approved schedules and playlist changes to devices.", ["Confirm schedule setup", "Confirm Default Playlist has scheduled image and video", "Confirm valid formats", "Save and approve content", "Click Publish", "Wait for device sync"], ["A common publish error means Default Playlist requirements are not met"], ["Uploading but not scheduling", "Unsupported format", "Wrong target playlist"], "Validate playback and check playlogs."),
  lesson("Playlogs", ["playlog", "playlogs", "report", "proof of play"], "Playlogs confirm what content played on devices for reporting and validation.", ["Open Playlogs or reports", "Select date range", "Filter by network, location, device, campaign, or content", "Review records", "Export if needed"], ["Play Log should be enabled", "Offline devices may upload later"], ["Wrong date range", "Checking before upload", "Expecting logs for content that did not play"], "Compare playlogs with schedule and device status."),
  lesson("User Management", ["user", "roles", "permissions"], "User Management controls who can access CMS modules, networks, and functions.", ["Open user management", "Create or invite user", "Enter details", "Assign role", "Assign network/module access", "Save", "Ask user to confirm access"], ["Use minimum required permission", "Match access to responsibility"], ["Too much access", "Wrong network assignment"], "Confirm the user can access the needed CMS area."),
  lesson("Android Installation", ["android", "install", "installation", "verification code"], "Android installation sets up the MW Content player and pairs it to CMS.", ["Create device in CMS", "Copy verification code", "Download Android app", "Install app", "Allow permissions", "Choose Login with Verification Code", "Enter code", "Confirm sync"], ["Android 11+ is recommended", "Verification codes are one-time use only"], ["Skipping permissions", "Expired code", "Wrong device record"], "Publish test content."),
  lesson("Windows Installation", ["windows", "install", "administrator"], "Windows installation sets up the MW Content player on a Windows device.", ["Create device in CMS", "Download installer", "Right click installer", "Run as Administrator", "Choose Run Anyway if prompted", "Enter verification code", "Confirm sync"], ["Windows 10 and 11 are supported", "Keep drivers and codecs updated"], ["Not running as administrator", "Wrong verification code"], "Publish test content."),
  lesson("Device Requirements", ["requirements", "spec", "webview", "ram", "storage", "android 11"], "Device requirements confirm whether hardware, OS, storage, RAM, browser/WebView, and media support are suitable.", ["Identify platform", "Check OS version", "Check CPU, RAM, storage, and graphics", "Check WebView/browser", "Check supported media formats", "Compare with recommended devices"], ["Android should be Android 11+", "Modern WebView matters for VAST/HTML", "Windows is best for programmatic-heavy networks"], ["Approving weak hardware", "Ignoring WebView", "Using unsupported OS"], "Use requirements before approving deployment."),
  lesson("Programmatic / VAST", ["programmatic", "vast", "url", "ima", "hivestack", "dv360"], "Programmatic and VAST need correct ad setup, fallback content, compatible platform, modern WebView/browser, and stable internet.", ["Confirm platform support", "Check WebView/browser requirements", "Create URL, VAST, or programmatic schedule", "Set ad slot duration", "Add filler content", "Enter required IDs or API keys", "Save and publish", "Validate playback"], ["Windows and Android 11+ are preferred", "Fallback content is important for no-fill"], ["No filler content", "Wrong screen ID", "Unsupported OS"], "Test on a known working device.")
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

  return scored[0]?.score > 0 ? scored[0].entry : lmxKnowledge.find((entry) => entry.category === "Schedule Content") ?? lmxKnowledge[0];
}

export function missingIntakeFields(intake?: IssueIntake): string[] {
  if (!intake) {
    return ["Training Topic", "Current Step / Goal"];
  }

  const checks: Array<[keyof IssueIntake, string]> = [
    ["issueCategory", "Training Topic"],
    ["description", "Current Step / Goal"]
  ];

  return checks.filter(([key]) => !intake[key]).map(([, label]) => label);
}

export function buildFallbackResponse(message: string, intake?: IssueIntake): string {
  const entry = findKnowledgeEntry(message, intake);
  const missing = missingIntakeFields(intake);
  const contextLine = intake?.clientTenant || intake?.network || intake?.location
    ? ` Training context: ${[intake?.clientTenant, intake?.network, intake?.location, intake?.contentCampaign].filter(Boolean).join(" / ")}.`
    : "";
  const missingLine = missing.length > 0 ? ` Ask the user for: ${missing.join(", ")}.` : "";

  return [
    `Overview:\n${entry.overview}${contextLine}${missingLine}`,
    `When to Use:\n${formatList(entry.whenToUse)}`,
    `Step-by-Step Guide:\n${formatList(entry.steps)}`,
    `Important Notes:\n${formatList(entry.importantNotes)}`,
    `Common Mistakes:\n${formatList(entry.commonMistakes)}`,
    `Next Step:\n${entry.nextStep}`
  ].join("\n\n");
}

export const assistantSystemPrompt = `Act as a senior LMX Content CMS trainer.

The assistant is the LMX Content Training Assistant. Its purpose is to teach users how to use LMX Content CMS using the uploaded LMX Content Training Module.

Every response must follow this format:

Overview:
When to Use:
Step-by-Step Guide:
Important Notes:
Common Mistakes:
Next Step:

Rules:
- Teach clearly and practically.
- Give step-by-step instructions for CMS workflows.
- Use the uploaded LMX Content Training Module as the primary source.
- Do not guess if a step is not covered. Ask what screen, module, or workflow the user is currently on.
- Focus on training users to create networks, locations, playlists, layouts, devices, default playlists, schedules, publishing flows, playlogs, storage, users, installations, and device requirements.
- Keep wording professional and easy for non-technical users.
- For scheduling or publishing, remind users that Default Playlist requires at least one scheduled image and one scheduled video.
- For device setup, remind users that verification codes are one-time use only.
- For programmatic/VAST, mention platform, WebView/browser support, stable internet, and fallback/filler content when relevant.`;
