"use client";

type LessonCardProps = {
  title: string;
  body: string;
  items: string[];
  note?: string;
};

function LessonCard({ title, body, items, note }: LessonCardProps) {
  return (
    <div className="rounded-md border border-line bg-mist p-3">
      <h4 className="font-semibold text-signal">{title}</h4>
      <p className="mt-1">{body}</p>
      <ul className="mt-2 list-disc space-y-1 pl-5">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
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
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
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
        <div className="mt-3 overflow-hidden rounded-md border border-line bg-white">
          <img src="/dashboard-page-screenshot.svg" alt="LMX Content CMS dashboard screenshot" className="w-full" />
        </div>
        <h3 className="mt-4 font-semibold text-signal">Overview</h3>
        <p className="mt-2">The Dashboard is the main landing page of the LMX Content CMS platform. It provides a high-level overview of device activity, network status, storage usage, and operational monitoring.</p>
        <p className="mt-2">This page helps users quickly monitor the health and status of the digital signage environment without navigating through multiple menus.</p>
        <h3 className="mt-4 font-semibold text-signal">Commonly used for</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Monitoring online and offline devices</li>
          <li>Checking unpaired devices</li>
          <li>Reviewing device connectivity</li>
          <li>Monitoring storage usage</li>
          <li>Viewing network activity</li>
          <li>Quickly identifying playback or operational issues</li>
        </ul>
      </article>
      <article className="rounded-lg border border-line bg-white p-4">
        <h3 className="font-semibold text-ink">Main Dashboard Components</h3>
        <div className="mt-3 grid gap-3 xl:grid-cols-2">
          <LessonCard title="1. Online Device(s)" body="Displays the number of currently connected and active devices." items={["Verify active player connectivity", "Monitor operational screens", "Confirm devices are communicating with CMS"]} note="Green indicator: Device is online and reporting normally." />
          <LessonCard title="2. Offline Device(s)" body="Displays devices currently disconnected or not communicating with CMS." items={["Internet issue", "Device powered off", "Player application stopped", "Network instability", "Device sleep mode", "Player crash"]} />
          <LessonCard title="3. Unpaired Device(s)" body="Displays devices that are not yet paired or verified with the CMS platform." items={["Device created but not activated", "Incorrect verification code", "Pairing process incomplete", "Device reset or app data cleared"]} note="Verification codes are one-time use only." />
          <LessonCard title="4. Device Status Table" body="Displays device name, current connectivity status, and activity indicator." items={["Green = Online", "Yellow = Warning or unstable", "Red = Offline"]} />
          <LessonCard title="5. Network Filter" body="Allows users to filter devices by network." items={["Client-specific monitoring", "Regional troubleshooting", "Large deployment management"]} />
          <LessonCard title="6. Device Search" body="Search for a specific device using device name or partial keyword." items={["Troubleshooting support calls", "Finding one device quickly", "Filtering large device lists"]} />
          <LessonCard title="7. Online Network Chart" body="Displays network activity visualization." items={["Monitor device distribution", "Understand network connectivity trends", "Identify active networks"]} />
          <LessonCard title="8. Storage Indicator" body="Displays current storage usage and remaining storage capacity." items={["Prevent storage full issues", "Monitor content download capacity", "Identify potential playback risk"]} note="Low storage may cause sync failure, playback issues, or application instability." />
        </div>
      </article>
      <article className="rounded-lg border border-line bg-white p-4">
        <h3 className="font-semibold text-ink">Common Dashboard Checks</h3>
        <div className="mt-3 grid gap-3 xl:grid-cols-3">
          <Checklist title="When Device is Offline" items={["Internet connection", "Device power", "Player application status", "CMS heartbeat", "Firewall or network restriction"]} />
          <Checklist title="When Device Shows Online but Screen is Black" items={["HDMI or display source", "Published content", "Playlist assignment", "Content compatibility", "Player application health"]} />
          <Checklist title="When Devices are Unpaired" items={["Verification code validity", "Device mapping", "Player login status", "CMS pairing process"]} />
        </div>
      </article>
      <article className="rounded-lg border border-line bg-white p-4">
        <h3 className="font-semibold text-ink">Important Notes</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Dashboard information updates based on device heartbeat and CMS communication.</li>
          <li>Device status may delay if internet connection is unstable.</li>
          <li>Offline devices may still display cached content locally.</li>
          <li>Storage usage should be monitored regularly to avoid content synchronization issues.</li>
        </ul>
        <h3 className="mt-4 font-semibold text-ink">Best Practice</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5"><li>Check offline device count daily.</li><li>Review unpaired devices.</li><li>Monitor storage usage.</li><li>Validate active network distribution.</li><li>Investigate abnormal status indicators immediately.</li></ul>
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
      <article className="rounded-lg border border-line bg-white p-4"><h3 className="font-semibold text-ink">Main Configuration Fields</h3><div className="mt-3 grid gap-3 xl:grid-cols-2">
        <LessonCard title="1. Network Name" body="Defines the name of the network." items={["Use a clear structured naming convention", "Examples: MY_Retail_Main, SG_Airport_T1, ClientA_KL"]} />
        <LessonCard title="2. Description" body="Optional field used to explain the network purpose." items={["Internal operations", "Troubleshooting", "Deployment identification"]} />
        <LessonCard title="3. Tags" body="Used for filtering and categorization." items={["Retail", "Malaysia", "Airport", "DOOH"]} />
      </div></article>
      <article className="rounded-lg border border-line bg-white p-4"><h3 className="font-semibold text-ink">Device Settings Section</h3><div className="mt-3 grid gap-3 xl:grid-cols-2">
        <LessonCard title="4. Start Time / End Time" body="Defines the playback operational window for the network." items={["Example: 08:00 - 22:00", "For 24-hour operation: 00:00 - 23:59"]} note="Incorrect playback windows may cause blank screens, content not playing, or default playlist playback." />
        <LessonCard title="5. Volume Range" body="Sets the default device audio level." items={["Example: 40%", "Avoid setting volume too high for public environments"]} />
        <LessonCard title="6. Screen Brightness" body="Sets the default display brightness level." items={["Example: 50%", "Indoor or outdoor adjustment", "Energy management", "Screen visibility optimization"]} />
        <LessonCard title="7. Playlog Interval (min)" body="Defines how often devices report playback logs to CMS." items={["Example: 10 minutes", "Use shorter intervals for high-priority campaigns", "Use shorter intervals for detailed playback monitoring"]} />
      </div></article>
      <article className="rounded-lg border border-line bg-white p-4"><h3 className="font-semibold text-ink">Default Values and Operational Options</h3><div className="mt-3 grid gap-3 xl:grid-cols-2">
        <LessonCard title="Schedule Types / Brands / Start Date" body="Defines operational categories, brand grouping, and when the network becomes operational." items={["Schedule type example: Client", "Brands help multi-brand environments", "Select the correct start date"]} />
        <LessonCard title="Playlist / Duration" body="Assigns a default playlist and operational duration if required." items={["A missing playlist can cause fallback content", "Scheduled campaigns may not play if setup is incomplete"]} />
        <LessonCard title="Play Log" body="Recommended: Enabled." items={["Playback reporting", "Campaign validation", "Troubleshooting support"]} />
        <LessonCard title="Background Download and Active" body="Both should be enabled for production deployments." items={["Download content in advance", "Reduce sync delays", "Keep the network operational"]} />
      </div></article>
      <article className="rounded-lg border border-line bg-white p-4"><h3 className="font-semibold text-ink">Common Mistakes</h3><div className="mt-3 grid gap-3 xl:grid-cols-2">
        <LessonCard title="Network Not Activated" body="Devices do not receive content." items={["Cause: Active = Disabled", "Fix: Enable Active"]} />
        <LessonCard title="Wrong Playback Time" body="Client reports content not playing." items={["Verify Start Time / End Time", "Confirm operational playback hours"]} />
        <LessonCard title="Playlog Disabled" body="No playback reporting available." items={["Enable Play Log"]} />
        <LessonCard title="Background Download Disabled" body="Slow syncing or playback interruption." items={["Enable Background Download"]} />
      </div></article>
      <article className="rounded-lg border border-line bg-white p-4"><h3 className="font-semibold text-ink">Next Step</h3><ol className="mt-2 list-decimal space-y-1 pl-5"><li>Create Location</li><li>Create Playlist</li><li>Register Device</li><li>Schedule Content</li></ol></article>
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
        <p className="mt-2 font-medium text-slate-800">Each device should be assigned to the correct Location to ensure proper content management and easier operational tracking.</p>
      </article>
      <article className="rounded-lg border border-line bg-white p-4"><h3 className="font-semibold text-ink">Accessing the Location Module</h3><p className="mt-2">Navigate to:</p><CodeLine>Dashboard - Setup - Location</CodeLine><p className="mt-3">To create a new location, click:</p><CodeLine>Create</CodeLine><p className="mt-3">The Add Location window will appear.</p></article>
      <article className="rounded-lg border border-line bg-white p-4"><h3 className="font-semibold text-ink">Main Configuration Fields</h3><div className="mt-3 grid gap-3 xl:grid-cols-2">
        <LessonCard title="1. Location Name" body="Defines the location identifier." items={["Use meaningful and structured names", "Examples: KL Office Lobby, Airport Terminal 1, Retail Branch Shah Alam"]} />
        <LessonCard title="2. Country" body="Select the country where the deployment exists." items={["Malaysia", "Singapore", "South Africa", "Vietnam"]} note="Country selection affects timezone alignment, operational grouping, and reporting organization." />
        <LessonCard title="3. Region" body="Defines the region, state, or province." items={["Selangor", "Johannesburg", "Hanoi"]} note="Useful for regional reporting, troubleshooting, and operational filtering." />
        <LessonCard title="4. Time Zone" body="Defines the timezone used for scheduling and playback timing." items={["Asia/Kuala_Lumpur", "Africa/Johannesburg", "Asia/Singapore"]} note="Incorrect timezone settings may cause wrong playback timing, missing schedules, unexpected playback, or reporting mismatch." />
        <LessonCard title="5. Zone Name" body="Defines the primary operational zone." items={["Kuala Lumpur", "Johannesburg", "Retail Zone", "Airport Zone"]} />
        <LessonCard title="6. Sub Zone Name" body="Defines the sub-category or more detailed grouping." items={["Level 1", "Lobby", "Terminal A", "Branch 01"]} note="Useful for large deployments, multi-floor environments, and operational segmentation." />
        <LessonCard title="7. Tag" body="Used for filtering and organization." items={["Retail", "Indoor", "Airport", "LED", "DOOH"]} />
        <LessonCard title="8. Description" body="Optional field for internal operational notes." items={["Main lobby LED deployment for Client A", "Troubleshooting", "Deployment tracking", "Support operations"]} />
        <LessonCard title="9. Status" body="Must be enabled for active operational use." items={["Recommended: Enabled", "If disabled, devices may not function properly", "If disabled, schedules may not apply correctly"]} />
      </div></article>
      <article className="rounded-lg border border-line bg-white p-4"><h3 className="font-semibold text-ink">Saving the Location</h3><p className="mt-2">After completing the required information, click:</p><CodeLine>Add</CodeLine><p className="mt-3">The new location will now appear in the Location list.</p></article>
      <article className="rounded-lg border border-line bg-white p-4"><h3 className="font-semibold text-ink">Common Mistakes</h3><div className="mt-3 grid gap-3 xl:grid-cols-2">
        <LessonCard title="Wrong Timezone Selection" body="Schedules play at incorrect times." items={["Cause: incorrect Time Zone", "Fix: verify the actual deployment timezone"]} />
        <LessonCard title="Poor Naming Convention" body="Location names should be clear and structured." items={["Bad: Test, Location1, ABC", "Good: MY_KL_Lobby, Airport_T1_LED"]} />
        <LessonCard title="Missing Regional Information" body="Difficult operational filtering and troubleshooting." items={["Complete Country", "Complete Region", "Complete Zone", "Complete Sub Zone"]} />
        <LessonCard title="Status Disabled" body="Location becomes operationally inactive." items={["Fix: ensure Status = Enabled"]} />
        <LessonCard title="Devices Assigned to Wrong Location" body="Wrong schedules or reporting confusion." items={["Verify network mapping", "Verify location assignment", "Verify device placement"]} />
      </div></article>
      <article className="rounded-lg border border-line bg-white p-4"><h3 className="font-semibold text-ink">Important Notes</h3><ul className="mt-2 list-disc space-y-1 pl-5"><li>Locations should be created after Network creation.</li><li>Devices must be assigned to the correct location for proper scheduling and monitoring.</li><li>Timezone configuration directly affects playback schedules.</li><li>Structured location naming improves support and operational management.</li></ul><h3 className="mt-4 font-semibold text-ink">Best Practice</h3><CodeLine>Network - Location - Device - Playlist - Schedule</CodeLine><p className="mt-3">Recommended naming format:</p><CodeLine>COUNTRY_REGION_LOCATION</CodeLine><h3 className="mt-4 font-semibold text-ink">Next Step</h3><ol className="mt-2 list-decimal space-y-1 pl-5"><li>Create Playlist</li><li>Create Layout</li><li>Register Device</li><li>Schedule Content</li><li>Publish Campaign</li></ol></article>
    </section>
  );
}
