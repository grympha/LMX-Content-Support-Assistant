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

export const lmxKnowledge: KnowledgeEntry[] = [
  {
    category: "Dashboard Overview",
    keywords: ["dashboard", "online", "offline", "storage", "status", "overview"],
    overview: "The Dashboard is the first place users review device health, online/offline status, storage usage, notifications, and release information.",
    whenToUse: ["Daily monitoring", "Checking device status", "Reviewing storage usage", "Finding pending or placeholder content"],
    steps: ["Open the LMX Content CMS Dashboard", "Review Online, Offline, and Unpaired device counters", "Check Storage Usage for capacity issues", "Open notifications for pending or placeholder content", "Review Release Information for current CMS and player versions"],
    importantNotes: ["Offline devices should be investigated from Device Manager", "Placeholder or pending content should be resolved before publishing workflows", "Storage usage should be monitored before large uploads"],
    commonMistakes: ["Ignoring offline or unpaired devices", "Uploading content without checking storage", "Missing release/version information before training or setup review"],
    nextStep: "After reviewing the Dashboard, continue with Network, Location, Playlist, Device, or Schedule setup depending on the task."
  },
  {
    category: "Create Network",
    keywords: ["network", "create network", "playlog interval", "background download"],
    overview: "A Network organizes devices, users, content rules, playback hours, playlog settings, and reporting behavior.",
    whenToUse: ["Creating a new client, tenant, region, or business unit", "Separating content schedules", "Separating user permissions", "Managing different playback hours"],
    steps: ["Go to the Network section in CMS", "Click Create", "Enter Network Name and optional Description", "Set Start Time and End Time", "Configure tags, playlog interval, background download, volume, and brightness where needed", "Keep Status enabled", "Click Add or Save"],
    importantNotes: ["Use clear naming conventions", "Keep Play Log enabled for reporting", "Enable Background Download when devices should cache content", "Create separate networks when schedules or permissions differ"],
    commonMistakes: ["Using one network for unrelated clients", "Wrong playback hours", "Play Log disabled", "Forgetting to enable Status"],
    nextStep: "Create Locations under the Network before adding devices or assigning playlists."
  },
  {
    category: "Create Location",
    keywords: ["location", "create location", "timezone", "zone", "subzone"],
    overview: "A Location represents where screens are deployed and helps organize scheduling, reporting, and device management.",
    whenToUse: ["Adding a new site, branch, floor, zone, or screen group", "Grouping devices that share content", "Ensuring schedules use the correct timezone"],
    steps: ["Go to Setup > Location", "Click Create", "Enter Location Name", "Select Country, Region, and Time Zone", "Enter Zone Name and Subzone Name", "Add tags or description if helpful", "Keep Status enabled", "Click Add or Save"],
    importantNotes: ["Timezone affects scheduling accuracy", "Locations are linked under Networks", "Use consistent naming such as COUNTRY_REGION_ZONE_SUBZONE"],
    commonMistakes: ["Wrong timezone", "Unclear location naming", "Creating devices before the location structure is ready"],
    nextStep: "Create playlists and devices for the location."
  },
  {
    category: "Create Playlist",
    keywords: ["playlist", "create playlist", "normal", "fixed", "prime", "dependent"],
    overview: "A Playlist controls the sequence, duration, and type of media playback for a location.",
    whenToUse: ["Creating a content loop", "Preparing a playlist for scheduling", "Separating normal, prime-time, fixed, or dependent content"],
    steps: ["Go to Setup > Playlist", "Click Create Playlist", "Enter Playlist Name", "Set Duration in seconds", "Select playlist Type", "Assign Location", "Keep Play Type as Timer unless another trigger is needed", "Add tags or description if helpful", "Keep Status enabled", "Click Save"],
    importantNotes: ["Playlist duration should match the intended content loop", "Prime playlists are useful for day-part campaigns", "A Default Playlist should exist as backup"],
    commonMistakes: ["Playlist duration does not match content", "Playlist assigned to wrong location", "Status disabled", "No default playlist prepared"],
    nextStep: "Add content to the playlist or create a schedule using the playlist."
  },
  {
    category: "Create Layout",
    keywords: ["layout", "screen layout", "tag", "zone", "split screen"],
    overview: "A Layout divides a screen into content zones, with each tag linked to a playlist.",
    whenToUse: ["Building split-screen displays", "Showing multiple playlists on one screen", "Creating default visual templates for a location"],
    steps: ["Go to Setup > Layout", "Click Create Layout", "Enter Layout Name", "Assign Location", "Choose Percentage or Pixel scale type", "Select Screen Type or resolution", "Add tags with playlist, position, width, and height", "Save the layout"],
    importantNotes: ["Each tag must be linked to a playlist", "Percentage layouts are better for mixed screen sizes", "Keep layouts visually simple for readability"],
    commonMistakes: ["Tags without playlists", "Too many zones", "Wrong resolution", "No default layout for the location"],
    nextStep: "Use the layout when assigning or scheduling multi-zone content."
  },
  {
    category: "Create Device",
    keywords: ["device", "create device", "device manager", "verification code"],
    overview: "A Device is the registered physical player or screen that receives scheduled content.",
    whenToUse: ["Adding a new player", "Generating a verification code", "Linking a screen to a location and network"],
    steps: ["Go to Device Manager", "Click Add Device", "Enter Device Name", "Assign Location", "Confirm Network, Start Time, End Time, Screen Type, and Status", "Save the device", "Copy the generated verification code"],
    importantNotes: ["The verification code is used by the player app", "The device must be assigned to the correct location", "Status should remain enabled for active devices"],
    commonMistakes: ["Wrong location assignment", "Verification code reused after pairing", "Device name not unique", "Status disabled"],
    nextStep: "Install or open the player app and pair it using the verification code."
  },
  {
    category: "Device Pairing",
    keywords: ["pair", "pairing", "verification", "code", "register"],
    overview: "Device pairing links the physical player app to the CMS device record using a one-time verification code.",
    whenToUse: ["New player installation", "Factory reset", "Replacing a device", "Completing device registration"],
    steps: ["Create the device in CMS", "Copy the generated verification code", "Open the MW Content player app on the device", "Choose Login with Verification Code", "Enter the verification code", "Confirm the device appears online or syncing in CMS"],
    importantNotes: ["Verification codes are one-time use only", "The device needs internet access", "Pairing should match the intended tenant, network, and location"],
    commonMistakes: ["Using expired or already-used code", "Pairing under the wrong tenant", "Device has no internet", "Wrong player app version"],
    nextStep: "After pairing, publish or sync content to validate playback."
  },
  {
    category: "Default Playlist",
    keywords: ["default playlist", "fallback", "image", "video", "publish error"],
    overview: "Default Playlist is required fallback content and is needed before scheduling and publishing workflows can proceed.",
    whenToUse: ["Preparing a new setup", "Fixing publish error about default playlist", "Ensuring fallback content exists"],
    steps: ["Go to Setup > Default Playlist", "Click Create or add content", "Select one image creative", "Create schedule with duration, start/end date, daypart or spot", "Save and approve", "Repeat for one video creative", "Confirm both image and video are scheduled"],
    importantNotes: ["At least one image and one video should be scheduled", "Uploading alone is not enough", "Content must be saved and approved"],
    commonMistakes: ["Only uploading default content", "Missing image or video schedule", "Forgetting approval", "Unsupported file format"],
    nextStep: "Once Default Playlist is ready, continue with content scheduling and publishing."
  },
  {
    category: "Schedule Content",
    keywords: ["schedule", "scheduling", "campaign", "daypart", "spot", "publish"],
    overview: "Scheduling content assigns media or campaigns to the correct playlist, location, time, and playback rules.",
    whenToUse: ["Publishing a campaign", "Setting start/end dates", "Assigning content to playlist", "Creating daypart or spot playback"],
    steps: ["Confirm Network and Location are ready", "Confirm Playlist exists", "Upload or select supported content", "Create the schedule", "Set duration, start date, end date, daypart or spot", "Save the schedule", "Approve if required", "Publish to the assigned playlist/devices"],
    importantNotes: ["Timezone must match the location", "Default Playlist must contain required image/video schedules", "The device must sync after publish", "Use supported file formats"],
    commonMistakes: ["Wrong playlist or location", "Schedule outside active time", "Not approving content", "Publishing before Default Playlist is prepared"],
    nextStep: "Check the device sync/playback status and validate with playlist metrics or playlogs."
  },
  {
    category: "Publish Content",
    keywords: ["publish", "publishing", "unable to publish", "error"],
    overview: "Publishing sends approved schedules and playlist changes to the relevant devices.",
    whenToUse: ["After scheduling content", "After changing playlist content", "When CMS shows a publish requirement or error"],
    steps: ["Confirm schedule setup is complete", "Confirm Default Playlist has at least one image and one video scheduled", "Confirm content uses valid formats such as MP4, JPG, or PNG", "Save and approve content where required", "Click Publish", "Wait for device sync"],
    importantNotes: ["A common publish error means Default Playlist does not have required scheduled image/video content", "Uploaded content must be scheduled, not only stored", "Device sync may take time"],
    commonMistakes: ["Default Playlist missing image or video", "Unsupported file type", "Schedule saved but not approved", "Wrong target playlist"],
    nextStep: "Validate playback on the device and check playlogs or playlist metrics."
  },
  {
    category: "Programmatic / VAST",
    keywords: ["programmatic", "vast", "url", "ima", "hivestack", "dv360", "ad"],
    overview: "Programmatic and VAST content require correct ad configuration, fallback content, supported device platform, WebView/browser compatibility, and stable internet.",
    whenToUse: ["Scheduling Google IMA/VAST", "Scheduling URL content", "Setting up Hivestack or DV360", "Testing programmatic playback"],
    steps: ["Confirm device platform supports the format", "Check WebView/browser requirements", "Create the URL, VAST, or programmatic schedule", "Set ad slot duration", "Add filler/fallback content", "Enter required API key, organization ID, screen ID, or ad unit ID", "Save and publish", "Validate playback"],
    importantNotes: ["Windows and Android 11+ are preferred for programmatic-heavy networks", "Android WebView should be modern", "Fallback content should be configured for no-fill or ad failures"],
    commonMistakes: ["No filler content", "Wrong ad unit or screen ID", "Unsupported OS/WebView", "Network blocks ad endpoints"],
    nextStep: "Test with a known working device and collect configuration details if playback fails."
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

The assistant is now the LMX Content Training Assistant. Its purpose is to teach users how to use LMX Content CMS using the uploaded LMX Content Training Module.

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
