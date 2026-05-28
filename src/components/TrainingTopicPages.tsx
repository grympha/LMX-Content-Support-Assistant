"use client";

type LessonCardProps = { title: string; body: string; items: string[]; note?: string };

function LessonCard({ title, body, items, note }: LessonCardProps) {
  return (
    <div className="rounded-md border border-line bg-mist p-3">
      <h4 className="font-semibold text-signal">{title}</h4>
      <p className="mt-1">{body}</p>
      <ul className="mt-2 list-disc space-y-1 pl-5">
        {items.map((item) => <li key={item}>{item}</li>)}
      </ul>
      {note ? <p className="mt-2 font-medium text-slate-800">{note}</p> : null}
    </div>
  );
}

function Checklist({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-md border border-line bg-mist p-3">
      <h4 className="font-semibold text-signal">{title}</h4>
      <ul className="mt-2 list-disc space-y-1 pl-5">
        {items.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </div>
  );
}

function CodeLine({ children }: { children: string }) {
  return <div className="mt-2 rounded-md bg-slatePanel px-3 py-2 font-mono text-xs text-white">{children}</div>;
}

export function DashboardTrainingPage() {
  return (
    <section className="space-y-4 text-sm leading-6 text-slate-700">
      <article className="rounded-lg border border-line bg-white p-4">
        <h2 className="text-base font-semibold text-ink">Dashboard Page</h2>
        <div className="mt-3 overflow-hidden rounded-md border border-line bg-white"><img src="/dashboard-page-screenshot.svg" alt="LMX Content CMS dashboard screenshot" className="w-full" /></div>
        <h3 className="mt-4 font-semibold text-signal">Overview</h3>
        <p className="mt-2">The Dashboard is the main landing page of the LMX Content CMS platform. It provides a high-level overview of device activity, network status, storage usage, and operational monitoring.</p>
        <p className="mt-2">This page helps users quickly monitor the health and status of the digital signage environment without navigating through multiple menus.</p>
        <h3 className="mt-4 font-semibold text-signal">Commonly used for</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5"><li>Monitoring online and offline devices</li><li>Checking unpaired devices</li><li>Reviewing device connectivity</li><li>Monitoring storage usage</li><li>Viewing network activity</li><li>Quickly identifying playback or operational issues</li></ul>
      </article>
      <article className="rounded-lg border border-line bg-white p-4">
        <h3 className="font-semibold text-ink">Main Dashboard Components</h3>
        <div className="mt-3 grid gap-3 xl:grid-cols-2">
          <LessonCard title="1. Online Device(s)" body="Displays the number of currently connected and active devices." items={["Verify active player connectivity", "Monitor operational screens", "Confirm devices are communicating with CMS"]} note="Green indicator: Device is online and reporting normally." />
          <LessonCard title="2. Offline Device(s)" body="Displays devices currently disconnected or not communicating with CMS." items={["Internet issue", "Device powered off", "Player application stopped", "Network instability", "Device sleep mode", "Player crash"]} />
          <LessonCard title="3. Unpaired Device(s)" body="Displays devices that are not yet paired or verified with CMS." items={["Device created but not activated", "Incorrect verification code", "Pairing process incomplete", "Device reset or app data cleared"]} note="Verification codes are one-time use only." />
          <LessonCard title="4. Device Status Table" body="Displays device name, current connectivity status, and activity indicator." items={["Green = Online", "Yellow = Warning or unstable", "Red = Offline"]} />
          <LessonCard title="5. Network Filter" body="Allows users to filter devices by network." items={["Client-specific monitoring", "Regional troubleshooting", "Large deployment management"]} />
          <LessonCard title="6. Device Search" body="Search for a specific device using device name or partial keyword." items={["Troubleshooting support calls", "Finding one device quickly", "Filtering large device lists"]} />
          <LessonCard title="7. Online Network Chart" body="Displays network activity visualization." items={["Monitor device distribution", "Understand network connectivity trends", "Identify active networks"]} />
          <LessonCard title="8. Storage Indicator" body="Displays current storage usage and remaining storage capacity." items={["Prevent storage full issues", "Monitor content download capacity", "Identify potential playback risk"]} note="Low storage may cause sync failure, playback issues, or application instability." />
        </div>
      </article>
    </section>
  );
}

export function NetworkTrainingPage() {
  return (
    <section className="space-y-4 text-sm leading-6 text-slate-700">
      <article className="rounded-lg border border-line bg-white p-4">
        <h2 className="text-base font-semibold text-ink">Create Network</h2>
        <div className="mt-3 overflow-hidden rounded-md border border-line bg-white"><img src="/create-network-screenshot.svg" alt="LMX Content CMS Add Network window" className="w-full" /></div>
        <h3 className="mt-4 font-semibold text-signal">Overview</h3>
        <p className="mt-2">The Network module is used to organize and manage devices, schedules, playlists, and operational settings within the LMX Content CMS platform.</p>
        <p className="mt-2">A Network acts as the primary grouping structure for digital signage deployments. Devices must belong to a Network before content scheduling and playback management can function properly.</p>
        <ul className="mt-2 list-disc space-y-1 pl-5"><li>Client deployment grouping</li><li>Regional screen grouping</li><li>Retail branch grouping</li><li>Airport or transportation deployment grouping</li></ul>
      </article>
      <article className="rounded-lg border border-line bg-white p-4"><h3 className="font-semibold text-ink">Accessing the Network Module</h3><p className="mt-2">Navigate to:</p><CodeLine>Dashboard - Network</CodeLine><p className="mt-3">Click:</p><CodeLine>Create</CodeLine><p className="mt-3">The Add Network window will appear.</p></article>
      <article className="rounded-lg border border-line bg-white p-4"><h3 className="font-semibold text-ink">Main Configuration Fields</h3><div className="mt-3 grid gap-3 xl:grid-cols-2"><LessonCard title="Network Name" body="Defines the name of the network." items={["Use clear structured naming", "Examples: MY_Retail_Main, SG_Airport_T1, ClientA_KL"]} /><LessonCard title="Description and Tags" body="Describe the network purpose and categorize it for filtering." items={["Internal operations", "Troubleshooting", "Retail", "Malaysia", "Airport", "DOOH"]} /></div></article>
      <article className="rounded-lg border border-line bg-white p-4"><h3 className="font-semibold text-ink">Device Settings</h3><div className="mt-3 grid gap-3 xl:grid-cols-2"><LessonCard title="Start Time / End Time" body="Defines the playback operational window." items={["Example: 08:00 - 22:00", "24-hour: 00:00 - 23:59"]} note="Incorrect playback windows may cause blank screens or default playlist playback." /><LessonCard title="Volume, Brightness, Playlog Interval" body="Controls audio, screen brightness, and how often devices report playback logs." items={["Volume example: 40%", "Brightness example: 50%", "Playlog example: 10 minutes"]} /></div></article>
      <article className="rounded-lg border border-line bg-white p-4"><h3 className="font-semibold text-ink">Important Notes</h3><ul className="mt-2 list-disc space-y-1 pl-5"><li>Networks are mandatory before creating locations and devices.</li><li>Devices must be mapped to the correct network to receive schedules properly.</li><li>Background Download is strongly recommended for production deployments.</li><li>Playlog reporting depends on proper network configuration.</li></ul></article>
    </section>
  );
}

export function LocationTrainingPage() {
  return (
    <section className="space-y-4 text-sm leading-6 text-slate-700">
      <article className="rounded-lg border border-line bg-white p-4">
        <h2 className="text-base font-semibold text-ink">Create Location</h2>
        <div className="mt-3 overflow-hidden rounded-md border border-line bg-white"><img src="/create-location-screenshot.svg" alt="LMX Content CMS Add Location window" className="w-full" /></div>
        <h3 className="mt-4 font-semibold text-signal">Overview</h3>
        <p className="mt-2">The Location module is used to define and organize the physical or logical placement of devices within the LMX Content CMS platform.</p>
        <p className="mt-2">A Location helps group devices based on country, region, city, office, branch, store, or deployment area.</p>
        <p className="mt-2">Locations are important for device organization, scheduling management, troubleshooting, reporting, and operational monitoring.</p>
      </article>
      <article className="rounded-lg border border-line bg-white p-4"><h3 className="font-semibold text-ink">Accessing the Location Module</h3><p className="mt-2">Navigate to:</p><CodeLine>Dashboard - Setup - Location</CodeLine><p className="mt-3">Click:</p><CodeLine>Create</CodeLine><p className="mt-3">The Add Location window will appear.</p></article>
      <article className="rounded-lg border border-line bg-white p-4"><h3 className="font-semibold text-ink">Main Configuration Fields</h3><div className="mt-3 grid gap-3 xl:grid-cols-2"><LessonCard title="Location Name" body="Defines the location identifier." items={["KL Office Lobby", "Airport Terminal 1", "Retail Branch Shah Alam"]} /><LessonCard title="Country, Region, Time Zone" body="Controls operational grouping and playback timing." items={["Malaysia", "Singapore", "South Africa", "Asia/Kuala_Lumpur"]} note="Incorrect timezone may cause wrong playback timing or reporting mismatch." /><LessonCard title="Zone and Sub Zone" body="Defines operational area and detailed grouping." items={["Kuala Lumpur", "Retail Zone", "Level 1", "Lobby"]} /><LessonCard title="Tag, Description, Status" body="Used for filtering, internal notes, and active operation." items={["Retail", "Indoor", "Airport", "Status should be enabled"]} /></div></article>
      <article className="rounded-lg border border-line bg-white p-4"><h3 className="font-semibold text-ink">Important Notes</h3><ul className="mt-2 list-disc space-y-1 pl-5"><li>Locations should be created after Network creation.</li><li>Devices must be assigned to the correct location for proper scheduling and monitoring.</li><li>Timezone configuration directly affects playback schedules.</li><li>Structured location naming improves support and operational management.</li></ul></article>
    </section>
  );
}

export function PlaylistTrainingPage() {
  return (
    <section className="space-y-4 text-sm leading-6 text-slate-700">
      <article className="rounded-lg border border-line bg-white p-4">
        <h2 className="text-base font-semibold text-ink">Create Playlist</h2>
        <div className="mt-3 overflow-hidden rounded-md border border-line bg-white"><img src="/create-playlist-screenshot.svg" alt="LMX Content CMS Add PlayList window" className="w-full" /></div>
        <h3 className="mt-4 font-semibold text-signal">Overview</h3>
        <p className="mt-2">The Playlist module is used to organize and manage the playback sequence of content within the LMX Content CMS platform.</p>
        <p className="mt-2">A Playlist controls what content will play, playback duration, playback order, scheduling behavior, and content grouping.</p>
        <p className="mt-2">Playlists can contain images, videos, HTML5 ZIP content, URL content, widgets, and VAST or programmatic content.</p>
        <p className="mt-2 font-medium text-slate-800">A properly configured Playlist is required before content can be scheduled and published to devices.</p>
      </article>

      <article className="rounded-lg border border-line bg-white p-4"><h3 className="font-semibold text-ink">Accessing the Playlist Module</h3><p className="mt-2">Navigate to:</p><CodeLine>Dashboard - Setup - Play List</CodeLine><p className="mt-3">To create a new playlist, click:</p><CodeLine>Create</CodeLine><p className="mt-3">The Add Playlist window will appear.</p></article>

      <article className="rounded-lg border border-line bg-white p-4"><h3 className="font-semibold text-ink">Step-by-Step Guide</h3><div className="mt-3 grid gap-3 xl:grid-cols-2">
        <LessonCard title="1. Enter Playlist Name" body="Enter a meaningful playlist name in Play List Name." items={["Recommended format: COUNTRY_LOCATION_PURPOSE", "Examples: MY_KL_MainAds, SG_Airport_T1, Retail_Branch01", "Avoid: Test, Playlist1, ABC"]} />
        <LessonCard title="2. Configure Duration" body="Enter the total playlist playback duration in Duration (Seconds)." items={["Example: 100 seconds", "Controls playback loop timing", "Validate duration against actual content timing"]} note="Incorrect duration may cause content overlap, timing mismatch, or scheduling inconsistency." />
        <LessonCard title="3. Select Playlist Type" body="Choose the playlist scheduling behavior." items={["Fixed: standard fixed playback order", "Prime: premium or high-priority playback", "Dependent: linked or conditional playback logic"]} />
        <LessonCard title="4. Select Location" body="Choose the location where the playlist will be used." items={["Ensures correct device mapping", "Supports scheduling", "Prevents reporting mismatch"]} note="Wrong location assignment may cause wrong content playback or device scheduling issues." />
        <LessonCard title="5. Configure Play Type" body="Use Timer for standard playback timing behavior." items={["Recommended: Enabled for standard deployments"]} />
        <LessonCard title="6. Tags and Description" body="Optional fields for filtering, operational grouping, and internal notes." items={["Retail", "Malaysia", "Airport", "PrimeTime", "DOOH"]} />
      </div></article>

      <article className="rounded-lg border border-line bg-white p-4"><h3 className="font-semibold text-ink">Operational Settings</h3><div className="mt-3 grid gap-3 xl:grid-cols-3"><Checklist title="Media Partner" items={["Enable only for external media partners", "Use for advertising partner workflows", "Otherwise leave disabled"]} /><Checklist title="Status" items={["Recommended: Enabled", "If disabled, playlist may not function", "If disabled, content may not publish correctly"]} /><Checklist title="Display Timer" items={["Controls timer visibility during playback", "Usually disabled for standard playback environments"]} /></div></article>

      <article className="rounded-lg border border-line bg-white p-4"><h3 className="font-semibold text-ink">Save Playlist</h3><p className="mt-2">After completing all required fields, click:</p><CodeLine>Save</CodeLine><p className="mt-3">The playlist will now appear in the Playlist list.</p></article>

      <article className="rounded-lg border border-line bg-white p-4"><h3 className="font-semibold text-ink">What Happens Next</h3><ul className="mt-2 list-disc space-y-1 pl-5"><li>Content can be added.</li><li>Scheduling can be configured.</li><li>Campaigns can be approved.</li><li>Content can be published to devices.</li></ul></article>

      <article className="rounded-lg border border-line bg-white p-4"><h3 className="font-semibold text-ink">Common Mistakes</h3><div className="mt-3 grid gap-3 xl:grid-cols-2"><LessonCard title="Playlist Created Without Content" body="Screen may show black screen, default playlist, or no playback." items={["Fix: add content into the playlist"]} /><LessonCard title="Wrong Location Selected" body="Content plays on incorrect devices." items={["Verify location assignment"]} /><LessonCard title="Playlist Status Disabled" body="Playlist cannot be scheduled properly." items={["Ensure Status = Enabled"]} /><LessonCard title="Incorrect Duration" body="Playback timing mismatch." items={["Validate Duration (Seconds) against actual content timing"]} /><LessonCard title="No Content Scheduling" body="Playlist exists but content never plays." items={["Content uploaded", "Content scheduled", "Campaign approved", "Publish completed"]} /></div></article>

      <article className="rounded-lg border border-line bg-white p-4"><h3 className="font-semibold text-ink">Important Notes</h3><ul className="mt-2 list-disc space-y-1 pl-5"><li>Playlist creation alone does not trigger playback.</li><li>Content must still be uploaded, assigned, scheduled, approved, and published.</li><li>Devices must be mapped correctly to Network, Location, and Playlist.</li></ul><h3 className="mt-4 font-semibold text-ink">Best Practice</h3><CodeLine>Create Playlist - Upload Content - Assign Content - Schedule Campaign - Approve Content - Publish Campaign - Verify Playback</CodeLine><h3 className="mt-4 font-semibold text-ink">Next Step</h3><ol className="mt-2 list-decimal space-y-1 pl-5"><li>Upload Content</li><li>Schedule Content</li><li>Approve Campaign</li><li>Publish Content</li><li>Verify Playback on Device</li></ol></article>
    </section>
  );
}

export function LayoutTrainingPage() {
  return (
    <section className="space-y-4 text-sm leading-6 text-slate-700">
      <article className="rounded-lg border border-line bg-white p-4">
        <h2 className="text-base font-semibold text-ink">Create Layout</h2>
        <div className="mt-3 overflow-hidden rounded-md border border-line bg-white"><img src="/create-layout-screenshot.svg" alt="LMX Content CMS Layout configuration page" className="w-full" /></div>
        <h3 className="mt-4 font-semibold text-signal">Overview</h3>
        <p className="mt-2">The Layout module is used to define how content is displayed on the screen within the LMX Content CMS platform.</p>
        <p className="mt-2">Layouts control screen zone arrangement, content positioning, split-screen configuration, playlist placement, scrolling areas, and multi-content display behavior.</p>
        <p className="mt-2">A Layout allows users to divide the screen into multiple sections and assign different playlists to each section.</p>
        <ul className="mt-2 list-disc space-y-1 pl-5"><li>Full-screen video</li><li>Video with scrolling ticker</li><li>Split-screen advertisements</li><li>Menu board layouts</li><li>Multi-zone DOOH playback</li></ul>
      </article>

      <article className="rounded-lg border border-line bg-white p-4"><h3 className="font-semibold text-ink">Accessing the Layout Module</h3><p className="mt-2">Navigate to:</p><CodeLine>Dashboard - Setup - Layout</CodeLine><p className="mt-3">To create a new layout, click:</p><CodeLine>Create</CodeLine><p className="mt-3">The Layout configuration page will appear.</p></article>

      <article className="rounded-lg border border-line bg-white p-4"><h3 className="font-semibold text-ink">Main Configuration Fields</h3><div className="mt-3 grid gap-3 xl:grid-cols-2">
        <LessonCard title="1. Layout Name" body="Defines the layout identifier." items={["Use clear structured naming", "Examples: MY_KL_FullScreen, Airport_SplitVertical, Retail_MenuBoard", "Avoid: Test, Layout1, ABC"]} />
        <LessonCard title="2. Location" body="Select the location where the layout will be used." items={["Ensures correct playlist and device mapping", "Prevents incorrect playback", "Prevents playlist mismatch"]} />
        <LessonCard title="3. Layout Scale" body="Defines the screen scaling unit." items={["Common option: Percentage", "Controls zone sizing", "Controls layout positioning", "Controls screen division"]} />
        <LessonCard title="4. Is Default Layout?" body="Defines whether this layout becomes the default screen layout." items={["Enable only if it should automatically apply to devices", "Verify before saving"]} note="Incorrect default layout configuration may cause wrong content arrangement or unintended screen display." />
        <LessonCard title="5. Status" body="Controls whether the layout can be applied operationally." items={["Recommended: Enabled", "If disabled, layout cannot be applied properly", "Devices may fallback to other layouts"]} />
        <LessonCard title="6. Description" body="Optional internal notes for operational reference." items={["Example: Split vertical layout for airport advertising screens", "Useful for support and deployment tracking"]} />
      </div></article>

      <article className="rounded-lg border border-line bg-white p-4"><h3 className="font-semibold text-ink">Existing Layout Types</h3><div className="mt-3 grid gap-3 xl:grid-cols-2">
        <LessonCard title="No Split" body="Single full-screen layout." items={["Full-screen video", "Standard advertisements", "Simple playback"]} />
        <LessonCard title="Split Vertical" body="Splits the screen vertically into multiple zones." items={["Video with side banner", "Advertising with information panel"]} />
        <LessonCard title="Split Horizontal" body="Splits the screen horizontally." items={["Top banner with main content", "Ticker with video"]} />
        <LessonCard title="Four Square" body="Divides the screen into four equal zones." items={["Menu boards", "Multiple simultaneous advertisements", "Information dashboards"]} />
        <LessonCard title="One Third Splits" body="Creates one-third vertical or horizontal split layouts." items={["Main content with side information", "Scrolling announcements", "News ticker layouts"]} />
        <LessonCard title="Scroll Layout Variations" body="Supports split layouts with top or bottom scrolling areas." items={["DOOH informational displays", "Transportation systems", "Retail announcements", "Live ticker displays"]} />
      </div></article>

      <article className="rounded-lg border border-line bg-white p-4"><h3 className="font-semibold text-ink">Zone Configuration</h3><div className="mt-3 grid gap-3 xl:grid-cols-2">
        <LessonCard title="7. Tag Name" body="Defines the zone identifier." items={["Tag1", "MainVideo", "Ticker", "SideBanner"]} note="Each zone can have different playlists assigned." />
        <LessonCard title="8. Play Lists" body="Assigns a playlist to the selected zone." items={["Valid playlist assignment", "Proper scheduling", "Approved content"]} note="Each zone needs a valid playlist for playback." />
        <LessonCard title="9. Left / Top" body="Defines zone position on the screen." items={["Controls zone placement", "Controls alignment", "Controls screen arrangement"]} />
        <LessonCard title="10. Width / Height" body="Defines zone size." items={["Example: Width = 100", "Example: Height = 100", "Controls content display area"]} />
        <LessonCard title="11. Border Configuration" body="Optional visual border for zone separation." items={["Useful for debugging", "Useful for testing layouts", "Usually disabled in production"]} />
      </div></article>

      <article className="rounded-lg border border-line bg-white p-4"><h3 className="font-semibold text-ink">Saving the Layout</h3><p className="mt-2">After configuring all required settings, click:</p><CodeLine>Save</CodeLine><p className="mt-3">The layout will now appear in the Layout list.</p></article>

      <article className="rounded-lg border border-line bg-white p-4"><h3 className="font-semibold text-ink">Common Mistakes</h3><div className="mt-3 grid gap-3 xl:grid-cols-2">
        <LessonCard title="Playlist Not Assigned" body="Zone appears blank." items={["Fix: assign valid playlist to each zone"]} />
        <LessonCard title="Wrong Layout Type Selected" body="Content displays incorrectly." items={["Choose layout based on screen orientation", "Choose layout based on content type", "Choose layout based on deployment requirement"]} />
        <LessonCard title="Incorrect Width / Height" body="Content overlaps or disappears." items={["Validate Width", "Validate Height", "Validate Left", "Validate Top"]} />
        <LessonCard title="Layout Status Disabled" body="Layout does not apply." items={["Ensure Status = Enabled"]} />
        <LessonCard title="Incorrect Default Layout" body="Wrong layout automatically applied." items={["Verify Is Default Layout before saving"]} />
      </div></article>

      <article className="rounded-lg border border-line bg-white p-4"><h3 className="font-semibold text-ink">Important Notes</h3><ul className="mt-2 list-disc space-y-1 pl-5"><li>Layout controls screen structure only.</li><li>Content must still be uploaded, assigned to playlist, scheduled, approved, and published.</li><li>Multi-zone layouts may require stronger device hardware.</li><li>Complex layouts may impact low-spec Android devices.</li></ul><h3 className="mt-4 font-semibold text-ink">Best Practice</h3><CodeLine>Create Layout - Create Playlist - Assign Playlist to Zones - Schedule Content - Publish Campaign - Verify Playback</CodeLine><p className="mt-3">Recommended for basic deployments: <span className="font-semibold text-ink">No Split</span></p><p className="mt-1">Recommended for advanced deployments: <span className="font-semibold text-ink">Split layouts with ticker support</span></p></article>

      <article className="rounded-lg border border-line bg-white p-4"><h3 className="font-semibold text-ink">Troubleshooting Tip</h3><p className="mt-2 font-medium text-slate-800">If users report: Layout created but screen is blank</p><ul className="mt-2 list-disc space-y-1 pl-5"><li>Check playlist assignment</li><li>Check layout status</li><li>Check content scheduling</li><li>Check publish status</li><li>Check device compatibility</li><li>Check zone dimensions</li><li>Check screen orientation</li></ul><h3 className="mt-4 font-semibold text-ink">Next Step</h3><ol className="mt-2 list-decimal space-y-1 pl-5"><li>Create Device</li><li>Assign Playlist</li><li>Schedule Content</li><li>Publish Campaign</li><li>Verify Device Playback</li></ol></article>
    </section>
  );
}
