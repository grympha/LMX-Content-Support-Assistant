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

export function BundleSchedulingTrainingPage() {
  return (
    <section className="space-y-4 text-sm leading-6 text-slate-700">
      <article className="rounded-lg border border-line bg-white p-4">
        <h2 className="text-base font-semibold text-ink">Scheduling Bundles</h2>
        <h3 className="mt-3 font-semibold text-signal">Overview</h3>
        <p className="mt-2">A Bundle is a group of content items such as images, videos, HTML files, and media assets that are intended to be scheduled together within the same playlist.</p>
        <p className="mt-2">Instead of scheduling each content item individually, Bundles allow users to schedule multiple contents at once, simplify campaign management, maintain consistent playback, and speed up deployment workflow.</p>
        <div className="mt-3 grid gap-3 xl:grid-cols-2">
          <LessonCard title="Useful For" body="Bundles are especially useful for repeated or multi-item campaigns." items={["Multi-content campaigns", "Retail advertising", "Promotional loops", "DOOH deployments", "Recurring campaign structures"]} />
          <LessonCard title="Benefits" body="Using Bundles improves operational efficiency." items={["Reduce scheduling time", "Maintain playlist consistency", "Simplify large campaign deployments", "Reduce manual scheduling errors"]} />
        </div>
      </article>

      <article className="rounded-lg border border-line bg-white p-4">
        <h3 className="font-semibold text-ink">Prerequisites</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Content uploaded into Storage.</li>
          <li>Playlist created.</li>
          <li>Network created.</li>
          <li>Devices paired and online.</li>
          <li>Content approved for scheduling.</li>
        </ul>
      </article>

      <article className="rounded-lg border border-line bg-white p-4">
        <h3 className="font-semibold text-ink">Step-by-Step Guide</h3>
        <div className="mt-3 grid gap-3 xl:grid-cols-2">
          <LessonCard title="1. Open Main Storage" body="Navigate to Main Storage and select the preferred content files." items={["Dashboard - Main Storage", "Select images, videos, or HTML ZIP files", "Click Create Schedule"]} note="Create Schedule creates a schedule using the selected group of content items." />
          <LessonCard title="2. Select Network" body="Choose the preferred Network for the bundle schedule." items={["Defines which deployment environment receives the bundle", "Examples: Malaysia Retail, Airport Screens, ClientA_Main"]} note="Wrong network selection may cause incorrect content playback, wrong device targeting, or deployment mismatch." />
          <LessonCard title="3. Select Playlist" body="Choose the preferred Playlist for the bundle content." items={["Defines where the bundle content is grouped", "Playlist must be active", "Playlist must be mapped correctly", "Playlist must support the campaign structure"]} />
          <LessonCard title="4. Save Schedule Content" body="After completing the configuration, click Save." items={["The content schedule will be created"]} />
          <LessonCard title="5. Content Approval" body="After saving, click Yes for content approval." items={["Unapproved content may not publish", "Unapproved content may not sync to devices", "Unapproved content may fail playback"]} />
        </div>
      </article>

      <article className="rounded-lg border border-line bg-white p-4">
        <h3 className="font-semibold text-ink">Important Configuration</h3>
        <p className="mt-2">Ensure this checkbox is checked:</p>
        <CodeLine>Publish to all mapped network</CodeLine>
        <p className="mt-3">Purpose: ensures content is distributed correctly across all mapped devices and locations.</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>If unchecked, some devices may not receive updates.</li>
          <li>Playback inconsistency may occur.</li>
          <li>Content synchronization may fail.</li>
        </ul>
      </article>

      <article className="rounded-lg border border-line bg-white p-4">
        <h3 className="font-semibold text-ink">Common Issues</h3>
        <div className="mt-3 grid gap-3 xl:grid-cols-2">
          <LessonCard title="1. Bundle Content Not Playing" body="Bundle schedule exists but content does not play." items={["Content not approved", "Publish incomplete", "Playlist mapping incorrect", "Device offline", "Check approval, publish, playlist, and device online status"]} />
          <LessonCard title="2. Some Devices Showing Old Content" body="Not all devices received the latest bundle." items={["Publish to mapped network unchecked", "Failed synchronization", "Storage limitation", "Device offline", "Verify Publish to all mapped network is enabled"]} />
          <LessonCard title="3. Black Screen After Bundle Scheduling" body="Playback fails after bundle scheduling." items={["Unsupported content", "Corrupted media", "Incomplete publish", "Failed synchronization", "Validate media, republish, and verify sync"]} />
          <LessonCard title="4. Bundle Scheduled but Not Published" body="Schedule was created but devices did not receive it." items={["Approval skipped", "Publish incomplete", "Device disconnected", "Approve content, republish schedule, and verify connectivity"]} />
        </div>
      </article>

      <article className="rounded-lg border border-line bg-white p-4">
        <h3 className="font-semibold text-ink">Best Practices</h3>
        <div className="mt-3 grid gap-3 xl:grid-cols-2">
          <LessonCard title="Group Similar Campaign Content" body="Organize bundle content by operational grouping." items={["Campaign", "Region", "Client"]} note="This improves campaign management and support visibility." />
          <LessonCard title="Use Clear Naming Convention" body="Use names that identify campaign and deployment." items={["2025_Q1_Retail_Campaign", "MY_KL_Promo_Bundle"]} />
          <LessonCard title="Validate Content Before Scheduling" body="Confirm files are suitable before creating the schedule." items={["Verify file format", "Optimize media size", "Test playback compatibility"]} />
          <LessonCard title="Always Verify Publish Status" body="Confirm devices receive the latest campaign updates." items={["Check approval status", "Check publish status", "Check synchronization status"]} />
        </div>
      </article>

      <article className="rounded-lg border border-line bg-white p-4">
        <h3 className="font-semibold text-ink">Important Notes</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Bundles simplify multi-content scheduling.</li>
          <li>Content still requires approval and publishing.</li>
          <li>Devices must remain online to receive updates.</li>
          <li>Unsupported media may cause playback issues.</li>
          <li>Publish to all mapped network should always be enabled for production deployments.</li>
        </ul>
      </article>

      <article className="rounded-lg border border-line bg-white p-4">
        <h3 className="font-semibold text-ink">Troubleshooting Tip</h3>
        <p className="mt-2 font-medium text-slate-800">If users report: Bundle scheduled but devices still showing old content</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Check publish status.</li>
          <li>Check approval status.</li>
          <li>Check synchronization status.</li>
          <li>Check device connectivity.</li>
          <li>Check mapped network selection.</li>
        </ul>
        <h3 className="mt-4 font-semibold text-ink">Best Practice Workflow</h3>
        <CodeLine>Upload Content - Select Multiple Content Files - Create Schedule - Select Network - Select Playlist - Approve Content - Publish Content - Verify Playback</CodeLine>
        <h3 className="mt-4 font-semibold text-ink">Next Step</h3>
        <ol className="mt-2 list-decimal space-y-1 pl-5">
          <li>Publish Campaign</li>
          <li>Verify Device Playback</li>
          <li>Monitor Synchronization</li>
          <li>Validate Playlogs</li>
        </ol>
      </article>
    </section>
  );
}
