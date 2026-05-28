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

export function DevicePairingTrainingPage() {
  return (
    <section className="space-y-4 text-sm leading-6 text-slate-700">
      <article className="rounded-lg border border-line bg-white p-4">
        <h2 className="text-base font-semibold text-ink">Device Pairing</h2>
        <h3 className="mt-3 font-semibold text-signal">Overview</h3>
        <p className="mt-2">Device Pairing is the process of linking a physical playback device to the LMX Content CMS platform using a verification code.</p>
        <p className="mt-2">Pairing is required before the device can receive playlists, download content, receive schedules, report playlogs, and communicate with CMS.</p>
        <div className="mt-3 grid gap-3 xl:grid-cols-2">
          <LessonCard title="Without Successful Pairing" body="The device cannot operate normally from CMS." items={["Device remains unpaired", "Content will not publish", "Playback monitoring will not function properly"]} />
          <LessonCard title="Supported Platforms" body="Device pairing is supported on common playback platforms." items={["Android", "Windows", "Linux", "LG webOS", "BrightSign depending on deployment"]} />
        </div>
      </article>

      <article className="rounded-lg border border-line bg-white p-4">
        <h3 className="font-semibold text-ink">Prerequisites</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Network is created.</li>
          <li>Location is created.</li>
          <li>Device is created in CMS.</li>
          <li>Player application is installed.</li>
          <li>Internet connection is stable.</li>
        </ul>
      </article>

      <article className="rounded-lg border border-line bg-white p-4">
        <h3 className="font-semibold text-ink">Step-by-Step Guide</h3>
        <div className="mt-3 grid gap-3 xl:grid-cols-2">
          <LessonCard title="1. Create Device in CMS" body="Navigate to Device Manager and create the device record before pairing." items={["Dashboard - Device Manager", "Click Create", "Complete Device Name, Network, Location, and Resolution", "Save the device"]} note="The device must exist in CMS before pairing can begin." />
          <LessonCard title="2. Install Player Application" body="Install the LMX Content Player application on the physical device." items={["Android APK", "Windows Player", "Linux Player"]} />
          <LessonCard title="3. Launch the Player Application" body="Open the player application on the device." items={["The player will display a Verification Code", "Example: ABCD1234"]} />
          <LessonCard title="4. Enter Verification Code in CMS" body="In Device Manager, locate the created device and complete the pairing action." items={["Select Pair Device", "Enter the verification code shown on screen", "Click Pair or Verify"]} />
          <LessonCard title="5. Pairing Successful" body="Once pairing is successful, the device becomes operational." items={["Device status becomes Online", "Device begins CMS synchronization", "Playlists and schedules can be downloaded"]} />
        </div>
      </article>

      <article className="rounded-lg border border-line bg-white p-4">
        <h3 className="font-semibold text-ink">Device Status After Pairing</h3>
        <div className="mt-3 grid gap-3 xl:grid-cols-3">
          <LessonCard title="Online" body="Green indicator." items={["Device connected and reporting normally"]} />
          <LessonCard title="Offline" body="Red indicator." items={["Device not communicating with CMS", "Possible internet issue", "Firewall restriction", "Player stopped", "Unstable network"]} />
          <LessonCard title="Unpaired" body="Warning indicator." items={["Device not linked to CMS"]} />
        </div>
      </article>

      <article className="rounded-lg border border-line bg-white p-4">
        <h3 className="font-semibold text-ink">Common Pairing Issues</h3>
        <div className="mt-3 grid gap-3 xl:grid-cols-2">
          <LessonCard title="1. Invalid Verification Code" body="Pairing fails." items={["Typing error", "Expired code", "Already-used code", "Fix: restart player application and generate a new verification code"]} note="Verification codes are one-time use only." />
          <LessonCard title="2. Device Stuck as Unpaired" body="CMS still shows Unpaired." items={["Pairing incomplete", "Unstable internet", "Player application issue", "Fix: verify internet, restart player, retry pairing"]} />
          <LessonCard title="3. Device Online but No Content" body="Pairing is successful but playback is missing." items={["Check playlist assignment", "Check schedule configuration", "Check publish status", "Check content compatibility"]} />
          <LessonCard title="4. Wrong Device Paired" body="Incorrect content appears on screen." items={["Verification code entered into wrong device entry", "Unpair device", "Recreate pairing process", "Verify correct device name"]} />
          <LessonCard title="5. No Verification Code" body="Player application is not showing a code." items={["Internet issue", "Application crash", "Unsupported hardware", "Outdated player version", "Fix: restart app, reinstall player, verify compatibility, check internet"]} />
        </div>
      </article>

      <article className="rounded-lg border border-line bg-white p-4">
        <h3 className="font-semibold text-ink">Windows Device Logout Shortcut</h3>
        <p className="mt-2">For Windows player, use:</p>
        <CodeLine>Ctrl + L</CodeLine>
        <p className="mt-3">Purpose: logs out the player and resets pairing.</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Useful when reassigning device.</li>
          <li>Useful when troubleshooting wrong pairing.</li>
          <li>Useful when moving device to another location.</li>
        </ul>
      </article>

      <article className="rounded-lg border border-line bg-white p-4">
        <h3 className="font-semibold text-ink">Android Reset Recommendation</h3>
        <p className="mt-2">If Android pairing behaves unexpectedly:</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Clear application data.</li>
          <li>Relaunch player.</li>
          <li>Regenerate verification code.</li>
        </ul>
      </article>

      <article className="rounded-lg border border-line bg-white p-4">
        <h3 className="font-semibold text-ink">Important Notes</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Device must be created in CMS before pairing.</li>
          <li>Verification codes are temporary and one-time use only.</li>
          <li>Stable internet is required during pairing.</li>
          <li>Wrong pairing may cause incorrect content playback.</li>
          <li>Pairing links the physical device to the CMS device record.</li>
        </ul>
        <h3 className="mt-4 font-semibold text-ink">Best Practice</h3>
        <CodeLine>Create Device - Install Player - Launch Player - Generate Verification Code - Pair Device - Verify Online Status - Publish Content - Verify Playback</CodeLine>
        <h3 className="mt-4 font-semibold text-ink">Recommended Before Deployment</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Verify internet stability.</li>
          <li>Verify screen resolution.</li>
          <li>Confirm correct network and location assignment.</li>
        </ul>
      </article>

      <article className="rounded-lg border border-line bg-white p-4">
        <h3 className="font-semibold text-ink">Troubleshooting Tip</h3>
        <p className="mt-2 font-medium text-slate-800">If users report: Device paired successfully but still not playing content</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Check device online status.</li>
          <li>Check playlist assignment.</li>
          <li>Check publish status.</li>
          <li>Check schedule timing.</li>
          <li>Check content compatibility.</li>
          <li>Check player application status.</li>
          <li>Check storage availability.</li>
        </ul>
        <h3 className="mt-4 font-semibold text-ink">Next Step</h3>
        <ol className="mt-2 list-decimal space-y-1 pl-5">
          <li>Upload Content</li>
          <li>Schedule Content</li>
          <li>Publish Campaign</li>
          <li>Verify Playback</li>
          <li>Monitor Playlogs</li>
        </ol>
      </article>
    </section>
  );
}
