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
  | "Installation of LMX Content App"
  | "Supported Operating Systems & Hardware"
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
  "Installation of LMX Content App",
  "Supported Operating Systems & Hardware",
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
  lesson("Dashboard Overview", ["dashboard", "online", "offline", "storage", "status"], "Use the Dashboard to review device health, storage usage, notifications, and CMS/player release information.", ["Go to Dashboard", "Review Online Device(s)", "Review Offline Device(s)", "Review Unpaired Device(s)", "Check the Device Status Table", "Use Network Filter or Device Search if needed", "Check Online Network chart and Storage Indicator"], ["Dashboard status depends on device heartbeat", "Offline devices may still play cached content"], ["Ignoring offline devices", "Missing storage warnings"], "Continue with Network, Location, Playlist, Device, or Schedule setup."),
  lesson("Create Network", ["network", "playlog interval", "background download"], "A Network organizes devices, schedules, playlists, users, playback hours, reporting, and content rules.", ["Go to Dashboard > Network", "Click Create", "Enter Network Name", "Add Description and Tags if needed", "Set Start Time and End Time", "Set Volume Range and Screen Brightness if needed", "Set Playlog Interval", "Select Schedule Type and Playlist if required", "Enable Play Log", "Enable Background Download", "Enable Active", "Click Add"], ["Networks are mandatory before creating locations and devices", "Background Download is strongly recommended for production"], ["Active disabled", "Wrong playback time", "Playlog disabled", "Poor naming convention"], "Create Locations under the Network."),
  lesson("Create Location", ["location", "timezone", "zone", "subzone"], "A Location represents where screens are deployed and controls schedule timezone context.", ["Go to Dashboard > Setup > Location", "Click Create", "Enter Location Name", "Select Country", "Enter Region", "Select Time Zone", "Enter Zone Name", "Enter Sub Zone Name", "Add Tag and Description if needed", "Enable Status", "Click Add"], ["Timezone affects scheduling accuracy", "Use consistent location naming"], ["Wrong timezone", "Unclear naming", "Creating devices before locations are ready"], "Create playlists and devices for the location."),
  lesson("Create Playlist", ["playlist", "normal", "fixed", "prime", "dependent"], "A Playlist controls the media sequence, duration, playback order, and content grouping.", ["Go to Dashboard > Setup > Play List", "Click Create", "Enter Play List Name", "Set Duration in seconds", "Select Type: Fixed, Prime, or Dependent", "Select Location", "Keep Play Type as Timer for standard playback", "Add Tags and Description if needed", "Enable Status", "Click Save"], ["Playlist creation alone does not trigger playback", "Content must still be uploaded, assigned, scheduled, approved, and published"], ["Playlist without content", "Wrong location", "Status disabled", "Incorrect duration"], "Upload Content, Schedule Content, Approve Campaign, and Publish Content."),
  lesson("Create Layout", ["layout", "tag", "zone", "split screen", "screen type", "resolution"], "A Layout divides a screen into zones, with each tag linked to a playlist.", ["Go to Setup > Layout", "Click Create Layout", "Enter Layout Name", "Assign the layout to a Location", "Assign the playlist", "Choose Layout Scale Type: Percentage or Pixel", "Select Screen Type or resolution", "Add Tags (optional)", "Save the layout"], ["Every tag needs a playlist", "Use No Split for basic full-screen playback"], ["Tags without playlists", "Wrong layout type", "Wrong width or height", "Status disabled"], "Create Device, Schedule Content, Publish Campaign, and verify playback."),
  lesson("Create Device", ["device", "device manager", "verification code"], "A Device is the CMS record for the physical player or screen.", ["Go to Dashboard > Device Manager", "Click Create", "Enter Device Name", "Select Network", "Select Location", "Configure screen resolution", "Click Save or Add", "Install the LMX Content Player app", "Open the player app", "Enter the verification code to pair the device"], ["Device must be in the correct network and location", "Verification codes are one-time use only"], ["Wrong network or location", "Device not paired", "Wrong screen resolution", "Unsupported hardware"], "Upload Content, Schedule Content, Approve Campaign, and Publish Content."),
  lesson("Device Pairing", ["pair", "pairing", "verification", "code"], "Pairing links the physical player app to the CMS device record.", ["Create the device in CMS", "Install the player application", "Open the player application", "Copy the verification code shown on screen", "Open Device Manager in CMS", "Select Pair Device", "Enter the verification code", "Click Pair or Verify", "Confirm device status becomes Online"], ["Verification codes are one-time use only", "Stable internet is required during pairing"], ["Invalid verification code", "Device stuck as unpaired", "Wrong device paired", "Player not showing verification code"], "Publish test content and validate playback."),
  lesson("Storage Management", ["storage", "upload", "media", "folder"], "Storage is used to upload, organize, manage, and clean up media files.", ["Go to Dashboard > Main Storage", "Select Tenant, Network, or Common Storage", "Click Upload", "Select or drag and drop files", "Choose Upload or Upload & Schedule", "Verify the uploaded files", "Organize files into folders if needed", "Use the content in playlist or schedule"], ["Only supported file formats can be scheduled and played", "Scheduled content cannot be deleted"], ["Unsupported file format", "Oversized file", "Wrong folder", "Deleting active content"], "Assign uploaded content to a playlist or schedule."),
  lesson("Default Playlist", ["default playlist", "fallback", "image", "video"], "Default Playlist is fallback content used when scheduled or targeted content is unavailable.", ["Go to Dashboard > Setup > Default PlayList", "Create or open the Default Playlist", "Upload fallback content", "Schedule at least 1 image file", "Save the Default Playlist", "Publish the content", "Verify fallback playback on device"], ["Default Playlist is a fallback mechanism only", "At least one image should always remain active"], ["No image scheduled", "No default playlist configured", "Unsupported media", "Publish incomplete"], "Schedule Campaign, Publish Content, and verify playback."),
  lesson("Schedule Content", ["schedule", "scheduling", "campaign", "daypart", "spot"], "Scheduling controls when, where, and how content will play on devices.", ["Go to Dashboard > Schedule Content", "Select Network", "Select Location", "Select Playlist", "Choose content to schedule", "Set Start Date and End Date", "Set Start Time and End Time", "Select playback days", "Set priority if required", "Click Save", "Approve the content if required", "Publish the content"], ["Scheduling alone does not trigger playback", "Content must be approved and published"], ["Playlist empty", "Schedule expired", "Wrong playback timing", "Content not published", "Device offline"], "Approve Campaign, Publish Content, and verify device playback."),
  lesson("Bundle Scheduling", ["bundle", "bundle schedule"], "Bundle scheduling lets users schedule multiple content items together.", ["Go to Dashboard > Main Storage", "Select the content files", "Click Create Schedule", "Select Network", "Select Playlist", "Click Save", "Approve the content", "Make sure Publish to all mapped network is checked", "Publish the content", "Verify playback"], ["Bundles still require approval and publishing", "Publish to all mapped network should be checked for production"], ["Content not approved", "Publish incomplete", "Playlist mapping incorrect", "Device offline"], "Publish Campaign, verify playback, and monitor synchronization."),
  lesson("Publish Content", ["publish", "publishing", "unable to publish", "error"], "Publishing sends approved schedules, playlists, and media updates to devices.", ["Go to Dashboard > Schedule Content", "Select Network", "Select Location", "Select Playlist", "Verify schedule configuration", "Confirm content is approved", "Check Publish to all mapped network", "Click Publish", "Wait for synchronization", "Verify playback on device"], ["Publishing is mandatory after scheduling", "Devices must be online to receive updates"], ["Device offline", "Publish incomplete", "Unsupported media", "Expired schedule", "Playlist empty"], "Verify Device Playback, Monitor Synchronization, and Check Playlogs."),
  lesson("Playlogs", ["playlog", "playlogs", "report", "proof of play"], "Playlogs record media playback activity for reporting and troubleshooting.", ["Go to Dashboard > Playlog", "Click Get New Log", "Select From Date and To Date", "Select device filter", "Select content filter", "Customize headers if needed", "Choose CSV or PDF", "Click Get Log", "Download and review the report"], ["General Playlog download is limited to 30 days including current date", "Device-level playlog is available up to the previous day"], ["Wrong date range", "Device offline", "Playlog disabled", "Content did not actually play"], "Validate campaign delivery and export client reports."),
  lesson("User Management", ["user", "roles", "permissions", "rbac"], "User Management controls CMS access, roles, permissions, and network visibility.", ["Go to Dashboard > Setup > User", "Click Create User", "Enter Username", "Enter Email", "Enter First Name and Last Name", "Select User Type", "Choose Language", "Enable Status", "Assign required access", "Click Add"], ["Only Tenant Admins can create users", "Assign minimum required access"], ["Wrong role", "Account disabled", "Network restriction", "Too much access"], "Verify the user can log in and access the required module."),
  lesson("Installation of LMX Content App", ["android", "windows", "install", "installation", "apk", "installer", "verification code", "software render", "sr build"], "Install and register the LMX Content Player application for Android and Windows devices.", ["Create the device in CMS first", "Download the correct Android APK or Windows installer", "For Android, install the APK and allow required permissions", "For Windows, right-click the installer and run as administrator", "Open the LMX Content Player application", "Select Login with Verification Code", "Enter the one-time verification code from CMS", "Verify pairing and synchronization", "Publish test content and verify playback"], ["For updates, install the latest version directly without uninstalling", "Verification codes are one-time use only", "Low-spec devices may require the Software Render build"], ["Installing before creating the CMS device", "Skipping Android permissions", "Not running Windows installer as administrator", "Using an expired code"], "Pair Device, Publish Content, and verify playback."),
  lesson("Supported Operating Systems & Hardware", ["requirements", "spec", "hardware", "operating system", "os", "webview", "ram", "storage", "android 11", "windows 10", "windows 11", "linux", "webos", "brightsign"], "LMX Content CMS supports Windows, Linux, Android, LG webOS, and BrightSign hardware.", ["Identify the target platform", "Check OS version", "Check CPU, RAM, storage, graphics, and system type", "For Android, confirm Android 11+", "For Android programmatic or HTML content, confirm WebView version 100 or above", "Check supported media formats", "Use recommended hardware for VAST, HTML ZIP, URL widgets, and split layouts", "Install the latest player", "Publish a test campaign and verify playback"], ["Windows 10 and 11 are supported; Windows 7 is no longer supported", "Android 11+ is recommended", "Low-end Android devices may struggle with VAST, HTML ZIP, URL widgets, and split layouts", "Programmatic playback requires modern browser or WebView support"], ["Approving weak hardware for advanced content", "Ignoring Android WebView version", "Using unsupported OS versions", "Using oversized media"], "Install the player application, pair the device, and verify playback."),
  lesson("Programmatic / VAST", ["programmatic", "vast", "url", "ima", "hivestack", "dv360"], "Programmatic and VAST need correct ad setup, fallback content, compatible platform, modern WebView/browser, and stable internet.", ["Confirm platform support", "Check WebView or browser requirements", "Create URL, VAST, or programmatic schedule", "Set ad slot duration", "Add filler content", "Enter required IDs or API keys", "Save and publish", "Validate playback"], ["Windows and Android 11+ are preferred", "Fallback content is important for no-fill"], ["No filler content", "Wrong screen ID", "Unsupported OS"], "Test on a known working device.")
];

function withPeriod(item: string) {
  return /[.!?]$/.test(item) ? item : `${item}.`;
}

function formatNumbered(items: string[]) {
  return items.map((item, index) => `${index + 1}. ${withPeriod(item)}`).join("\n");
}

function actionTitle(category: IssueCategory) {
  const titles: Partial<Record<IssueCategory, string>> = {
    "Dashboard Overview": "To Review the Dashboard:-",
    "Create Network": "To Create a Network:-",
    "Create Location": "To Create a Location:-",
    "Create Playlist": "To Create a Playlist:-",
    "Create Layout": "To Create a Layout:-",
    "Create Device": "To Create a Device:-",
    "Device Pairing": "To Pair a Device:-",
    "Storage Management": "To Upload and Manage Storage:-",
    "Default Playlist": "To Set Up the Default Playlist:-",
    "Schedule Content": "To Schedule Content:-",
    "Bundle Scheduling": "To Schedule a Bundle:-",
    "Publish Content": "To Publish Content:-",
    Playlogs: "To Check Playlogs:-",
    "User Management": "To Create a User:-",
    "Installation of LMX Content App": "To Install LMX Content App:-",
    "Supported Operating Systems & Hardware": "To Check Supported Operating Systems & Hardware:-",
    "Programmatic / VAST": "To Set Up Programmatic or VAST Content:-",
    Other: "Recommended Steps:-"
  };

  return titles[category] ?? `${category}:-`;
}

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
  return `${actionTitle(entry.category)}\n${formatNumbered(entry.steps)}`;
}

export const assistantSystemPrompt = `Act as a senior LMX Content CMS trainer.

The assistant is the LMX Content Training Assistant. Its purpose is to teach users how to use LMX Content CMS using the uploaded LMX Content Training Module.

Answer style:
- Keep answers short, direct, and easy to understand.
- For how-to questions, start with: To [Action]:-
- Use a numbered list of practical steps.
- Do not include Overview, When to Use, Important Notes, Common Mistakes, or long explanations unless the user asks for detail.
- Search across all training topics and answer based on the best matching topic.

Rules:
- Teach clearly and practically.
- Give step-by-step instructions for CMS workflows.
- Use the uploaded LMX Content Training Module as the primary source.
- Do not guess if a step is not covered. Ask what screen, module, or workflow the user is currently on.
- Focus on training users to create networks, locations, playlists, layouts, devices, default playlists, schedules, publishing flows, playlogs, storage, users, app installation, and supported operating systems/hardware.
- Keep wording professional and easy for non-technical users.
- For scheduling or publishing, remind users that Default Playlist requires at least one scheduled image.
- For device setup and app installation, remind users that verification codes are one-time use only.
- For app updates, remind users to install the latest version directly without uninstalling the previous version.
- For programmatic/VAST, mention platform, WebView/browser support, stable internet, and fallback/filler content when relevant.`;
