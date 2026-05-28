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

export function PublishContentTrainingPage() {
  return (
    <section className="space-y-4 text-sm leading-6 text-slate-700">
      <article className="rounded-lg border border-line bg-white p-4">
        <h2 className="text-base font-semibold text-ink">Publish Content</h2>
        <h3 className="mt-3 font-semibold text-signal">Overview</h3>
        <p className="mt-2">The Publish Content process is used to distribute approved schedules, playlists, and media updates to devices within the LMX Content CMS platform.</p>
        <p className="mt-2">Publishing is the final step required before devices can receive and display the latest content.</p>
        <p className="mt-2 font-medium text-slate-800">Scheduling content alone does not trigger playback. Content must be approved and published before devices can synchronize and display the updated campaign.</p>
        <CodeLine>Approved - Published</CodeLine>
        <div className="mt-3 grid gap-3 xl:grid-cols-2">
          <LessonCard title="Without Publishing" body="Devices may not receive the latest update." items={["Old content may continue playing", "Default playlist may appear", "Devices may not update"]} />
          <LessonCard title="Purpose of Publishing" body="Publishing activates distribution to devices." items={["Schedules become active", "Playlists are synchronized", "Devices receive updated content", "Campaigns are distributed correctly", "Playback updates reach mapped screens"]} />
        </div>
      </article>

      <article className="rounded-lg border border-line bg-white p-4">
        <h3 className="font-semibold text-ink">Prerequisites</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Content uploaded.</li>
          <li>Playlist created.</li>
          <li>Schedule created.</li>
          <li>Content approved.</li>
          <li>Device online.</li>
          <li>Device paired correctly.</li>
        </ul>
      </article>

      <article className="rounded-lg border border-line bg-white p-4">
        <h3 className="font-semibold text-ink">Accessing Publish Content</h3>
        <p className="mt-2">Navigate to:</p>
        <CodeLine>Dashboard - Schedule Content</CodeLine>
        <p className="mt-3">Select Network, Location, and Playlist before publishing.</p>
        <div className="mt-3 grid gap-3 xl:grid-cols-3">
          <LessonCard title="Network" body="Determines the deployment group." items={["Client deployment", "Regional deployment", "Mapped device group"]} />
          <LessonCard title="Location" body="Determines where the content will play." items={["Deployment area", "Screen group", "Timezone context"]} />
          <LessonCard title="Playlist" body="Determines what content will be displayed." items={["Campaign content", "Playback sequence", "Scheduled playlist"]} />
        </div>
        <p className="mt-3 font-medium text-slate-800">Always verify the correct Network, Location, and Playlist before publishing.</p>
      </article>

      <article className="rounded-lg border border-line bg-white p-4">
        <h3 className="font-semibold text-ink">Step-by-Step Guide</h3>
        <div className="mt-3 grid gap-3 xl:grid-cols-2">
          <LessonCard title="1. Verify Schedule Configuration" body="Before publishing, confirm the schedule setup is correct." items={["Correct playlist selected", "Schedule active", "Correct playback timing", "Correct device or location assignment"]} note="This prevents incorrect content playback." />
          <LessonCard title="2. Approve Content" body="Ensure the scheduled content is approved." items={["Unapproved content may fail synchronization", "Unapproved content may not publish to devices", "Unapproved content may trigger default playlist playback"]} />
          <LessonCard title="3. Enable Publish to All Mapped Network" body="Ensure the checkbox is checked." items={["All mapped devices receive the update", "All mapped locations receive the update", "Prevents playback inconsistency"]} note="If unchecked, some devices may not receive updates and old content may remain active." />
          <LessonCard title="4. Publish Content" body="Click Publish to begin distribution." items={["Content synchronization", "Playlist distribution", "Device update process"]} />
          <LessonCard title="5. Verify Synchronization" body="After publishing, confirm deployment success." items={["Device online status", "Synchronization completion", "Playback update on screen"]} />
        </div>
      </article>

      <article className="rounded-lg border border-line bg-white p-4">
        <h3 className="font-semibold text-ink">Common Publishing Issues</h3>
        <div className="mt-3 grid gap-3 xl:grid-cols-2">
          <LessonCard title="1. Content Published but Not Playing" body="Publishing completed but content is not visible." items={["Device offline", "Failed synchronization", "Unsupported media", "Expired schedule", "Playlist empty", "Check device, sync, playlist, and schedule validity"]} />
          <LessonCard title="2. Old Content Still Showing" body="Device continues playing previous content." items={["Publish incomplete", "Failed synchronization", "Cached content active", "Internet instability", "Republish, verify sync, restart player if needed"]} />
          <LessonCard title="3. Default Playlist Showing After Publish" body="Fallback content appears after publishing." items={["Schedule inactive", "Publish failed", "Playlist assignment issue", "Content download failure", "Verify schedule, publish, sync logs, and playlist mapping"]} />
          <LessonCard title="4. Black Screen After Publishing" body="Screen turns black after content update." items={["Corrupted content", "Unsupported format", "Failed content extraction", "Player application issue", "Validate content, republish, restart player"]} />
          <LessonCard title="5. Some Devices Updated, Others Not" body="Only part of the deployment received the update." items={["Publish to mapped network unchecked", "Unstable internet", "Device offline", "Storage limitation", "Check mapped network, internet, storage, and synchronization"]} />
        </div>
      </article>

      <article className="rounded-lg border border-line bg-white p-4">
        <h3 className="font-semibold text-ink">Best Practices</h3>
        <div className="mt-3 grid gap-3 xl:grid-cols-2">
          <LessonCard title="Verify Device Online Status" body="Check device status before publishing." items={["Ensures devices can receive updates immediately"]} />
          <LessonCard title="Publish During Stable Internet" body="Publish when connectivity is reliable." items={["Reduces failed synchronization", "Reduces incomplete downloads", "Reduces playback inconsistency"]} />
          <LessonCard title="Use Optimized Media Files" body="Optimized media improves synchronization and playback." items={["Compressed MP4", "Optimized images", "Lightweight HTML ZIP files"]} />
          <LessonCard title="Validate Playback After Publishing" body="Confirm deployment success after publishing." items={["Verify correct content playback", "Confirm synchronization success", "Monitor affected devices"]} />
        </div>
      </article>

      <article className="rounded-lg border border-line bg-white p-4">
        <h3 className="font-semibold text-ink">Important Notes</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Publishing is mandatory after scheduling.</li>
          <li>Devices must remain online to receive updates.</li>
          <li>Failed publishing may result in default playlist playback.</li>
          <li>Unsupported media may cause playback failure or black screen.</li>
          <li>Large media files may delay synchronization.</li>
        </ul>
      </article>

      <article className="rounded-lg border border-line bg-white p-4">
        <h3 className="font-semibold text-ink">Troubleshooting Checklist</h3>
        <p className="mt-2 font-medium text-slate-800">If users report: Content published but device not updated</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Check publish status.</li>
          <li>Check device online status.</li>
          <li>Check synchronization logs.</li>
          <li>Check storage availability.</li>
          <li>Check internet connectivity.</li>
          <li>Check playlist assignment.</li>
          <li>Check schedule validity.</li>
        </ul>
        <h3 className="mt-4 font-semibold text-ink">Best Practice Workflow</h3>
        <CodeLine>Upload Content - Create Playlist - Schedule Content - Approve Campaign - Publish Content - Verify Synchronization - Verify Playback - Monitor Playlogs</CodeLine>
        <h3 className="mt-4 font-semibold text-ink">Next Step</h3>
        <ol className="mt-2 list-decimal space-y-1 pl-5">
          <li>Verify Device Playback</li>
          <li>Monitor Synchronization</li>
          <li>Check Playlogs</li>
          <li>Validate Campaign Delivery</li>
        </ol>
      </article>
    </section>
  );
}
