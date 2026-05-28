"use client";

function LessonCard({ title, body, items, note }: { title: string; body: string; items: string[]; note?: string }) {
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

function CodeLine({ children }: { children: string }) {
  return <div className="mt-2 rounded-md bg-slatePanel px-3 py-2 font-mono text-xs text-white">{children}</div>;
}

export function DeviceTrainingPage() {
  return (
    <section className="space-y-4 text-sm leading-6 text-slate-700">
      <article className="rounded-lg border border-line bg-white p-4">
        <h2 className="text-base font-semibold text-ink">Create Device</h2>
        <h3 className="mt-3 font-semibold text-signal">Overview</h3>
        <p className="mt-2">The Device module is used to register, configure, and manage playback devices within the LMX Content CMS platform.</p>
        <p className="mt-2">Devices are the media players connected to display screens that receive playlists, schedules, content updates, and playback instructions.</p>
        <div className="mt-3 grid gap-3 xl:grid-cols-2">
          <LessonCard title="Supported Platforms" body="Supported device platforms may include:" items={["Android", "Windows", "Linux", "LG webOS", "BrightSign"]} />
          <LessonCard title="Before Playback Can Begin" body="A device must be fully prepared in CMS and on the physical player." items={["Created in CMS", "Assigned to the correct Network and Location", "Paired using a verification code"]} />
        </div>
      </article>

      <article className="rounded-lg border border-line bg-white p-4">
        <h3 className="font-semibold text-ink">Accessing the Device Module</h3>
        <p className="mt-2">Navigate to:</p>
        <CodeLine>Dashboard - Device Manager</CodeLine>
        <p className="mt-3">To create a new device, click:</p>
        <CodeLine>Create</CodeLine>
        <p className="mt-3">The Add Device window will appear.</p>
      </article>

      <article className="rounded-lg border border-line bg-white p-4">
        <h3 className="font-semibold text-ink">Step-by-Step Guide</h3>
        <div className="mt-3 grid gap-3 xl:grid-cols-2">
          <LessonCard title="1. Enter Device Name" body="Enter a meaningful device name in Device Name." items={["Use structured naming", "Examples: MY_KL_Lobby_01, Airport_T1_LED_02, Retail_Branch_A", "Avoid: Test, Android1, ABC"]} />
          <LessonCard title="2. Select Network" body="Choose the correct Network." items={["Defines operational grouping", "Defines scheduling structure", "Supports deployment organization"]} note="Wrong network assignment may cause incorrect content playback, scheduling mismatch, or reporting issues." />
          <LessonCard title="3. Select Location" body="Assign the correct Location." items={["Links device to regional deployment", "Applies timezone context", "Supports reporting structure"]} />
          <LessonCard title="4. Configure Resolution" body="Set the screen resolution to match the actual display." items={["1920x1080", "3840x2160", "1080x1920"]} note="Incorrect resolution may cause stretched content, black screen, or content cutoff." />
        </div>
      </article>

      <article className="rounded-lg border border-line bg-white p-4">
        <h3 className="font-semibold text-ink">Device Pairing Process</h3>
        <div className="mt-3 grid gap-3 xl:grid-cols-2">
          <LessonCard title="5. Save Device" body="Click Save or Add after completing the required CMS fields." items={["Device entry appears in Device Manager", "Device can now be prepared for pairing"]} />
          <LessonCard title="6. Install Player Application" body="Install the appropriate LMX Content Player application on the physical device." items={["Android APK", "Windows Player", "Linux Player"]} />
          <LessonCard title="7. Open Player Application" body="Launch the player application on the device." items={["The player will display a Verification Code", "Keep the code visible during pairing"]} />
          <LessonCard title="8. Pair Device" body="In CMS, select the device, enter the verification code, and complete pairing." items={["Select the correct CMS device", "Enter the verification code", "Complete pairing"]} note="Verification codes are one-time use only." />
        </div>
      </article>

      <article className="rounded-lg border border-line bg-white p-4">
        <h3 className="font-semibold text-ink">Device Status Indicators</h3>
        <div className="mt-3 grid gap-3 xl:grid-cols-3">
          <LessonCard title="Online" body="Green indicator." items={["Device connected and reporting normally"]} />
          <LessonCard title="Offline" body="Red indicator." items={["Device not communicating with CMS", "Possible internet issue", "Device powered off", "Player stopped", "Firewall restriction"]} />
          <LessonCard title="Unpaired" body="Warning indicator." items={["Device not yet paired with CMS"]} />
        </div>
      </article>

      <article className="rounded-lg border border-line bg-white p-4">
        <h3 className="font-semibold text-ink">Common Mistakes</h3>
        <div className="mt-3 grid gap-3 xl:grid-cols-2">
          <LessonCard title="Wrong Network or Location" body="Incorrect content playback." items={["Verify Network assignment", "Verify Location assignment"]} />
          <LessonCard title="Device Not Paired" body="Content is not received by the player." items={["Complete verification code pairing"]} />
          <LessonCard title="Wrong Screen Resolution" body="Content display issue or black screen." items={["Match device resolution with actual screen resolution"]} />
          <LessonCard title="Unsupported Hardware" body="Player crash or unstable playback." items={["Low RAM", "Weak CPU", "Unsupported Android version", "Outdated WebView"]} note="Recommended Android minimum: Android 11+, 4GB RAM, 32GB/64GB storage, quad-core CPU." />
          <LessonCard title="Device Offline but Screen Still Playing" body="Cached content continues locally." items={["Heartbeat interruption", "Unstable internet", "CMS communication failure", "Check internet stability, firewall, player application, and device heartbeat"]} />
        </div>
      </article>

      <article className="rounded-lg border border-line bg-white p-4">
        <h3 className="font-semibold text-ink">Important Notes</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Devices must belong to the correct Network and Location.</li>
          <li>Pairing is mandatory before playback can begin.</li>
          <li>Verification codes are one-time use only.</li>
          <li>Device hardware capability affects playback performance.</li>
          <li>Complex layouts and HTML content require stronger hardware.</li>
        </ul>
        <h3 className="mt-4 font-semibold text-ink">Best Practice</h3>
        <CodeLine>Create Network - Create Location - Create Playlist - Create Device - Pair Device - Schedule Content - Publish Campaign - Verify Playback</CodeLine>
        <h3 className="mt-4 font-semibold text-ink">Recommended for Android Deployments</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Android 11+</li>
          <li>4GB RAM minimum</li>
          <li>Stable internet</li>
          <li>Ethernet preferred for production</li>
        </ul>
      </article>

      <article className="rounded-lg border border-line bg-white p-4">
        <h3 className="font-semibold text-ink">Troubleshooting Tip</h3>
        <p className="mt-2 font-medium text-slate-800">If users report: Device online but content not playing</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Check device pairing</li>
          <li>Check playlist assignment</li>
          <li>Check publish status</li>
          <li>Check schedule timing</li>
          <li>Check content compatibility</li>
          <li>Check player application status</li>
        </ul>
        <h3 className="mt-4 font-semibold text-ink">Next Step</h3>
        <ol className="mt-2 list-decimal space-y-1 pl-5">
          <li>Upload Content</li>
          <li>Schedule Content</li>
          <li>Approve Campaign</li>
          <li>Publish Content</li>
          <li>Verify Playback on Screen</li>
        </ol>
      </article>
    </section>
  );
}
