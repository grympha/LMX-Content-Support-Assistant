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

export function DefaultPlaylistTrainingPage() {
  return (
    <section className="space-y-4 text-sm leading-6 text-slate-700">
      <article className="rounded-lg border border-line bg-white p-4">
        <h2 className="text-base font-semibold text-ink">Default Playlist</h2>
        <h3 className="mt-3 font-semibold text-signal">Overview</h3>
        <p className="mt-2">The Default Playlist is the fallback playlist used by LMX Content CMS when scheduled or targeted content is unavailable for playback.</p>
        <p className="mt-2">It keeps screens showing content instead of black screen, empty playback, or no-content scenarios.</p>
        <div className="mt-3 grid gap-3 xl:grid-cols-2">
          <LessonCard title="Common Uses" body="Default Playlist is commonly used for fallback playback." items={["Fallback content", "Standby advertisements", "Corporate branding", "Informational screens", "House ads"]} />
          <LessonCard title="Purpose" body="Default Playlist helps maintain operational continuity." items={["Maintain continuous playback", "Reduce screen downtime", "Provide backup content", "Improve operational stability", "Prevent blank screens"]} />
        </div>
      </article>

      <article className="rounded-lg border border-line bg-white p-4">
        <h3 className="font-semibold text-ink">Accessing Default Playlist</h3>
        <p className="mt-2">Navigate to:</p>
        <CodeLine>Dashboard - Setup - Default PlayList</CodeLine>
        <p className="mt-3">The Default Playlist configuration page will appear.</p>
      </article>

      <article className="rounded-lg border border-line bg-white p-4">
        <h3 className="font-semibold text-ink">Step-by-Step Guide</h3>
        <div className="mt-3 grid gap-3 xl:grid-cols-2">
          <LessonCard title="1. Create Default Playlist" body="Create the Default Playlist used for fallback playback." items={["Minimum requirement: 1 image file must be scheduled", "Recommended: company logo", "Recommended: standby advertisement", "Recommended: informational image or welcome screen"]} note="Use lightweight optimized images for stable fallback playback across device types." />
          <LessonCard title="2. Upload Fallback Content" body="Upload the content intended for fallback playback." items={["Static images", "Lightweight MP4 videos", "Corporate branding visuals"]} note="Avoid oversized videos, heavy HTML ZIP files, and unsupported widgets." />
          <LessonCard title="3. Schedule Content" body="Assign the uploaded image or content into the Default Playlist schedule." items={["At least 1 image file must remain active", "If no content is scheduled, black screen may appear", "If no content is scheduled, fallback playback may fail"]} />
          <LessonCard title="4. Save Default Playlist" body="Save the Default Playlist configuration." items={["Click Save", "Default Playlist is now configured"]} />
        </div>
      </article>

      <article className="rounded-lg border border-line bg-white p-4">
        <h3 className="font-semibold text-ink">How Default Playlist Works</h3>
        <p className="mt-2">Playback priority generally follows:</p>
        <CodeLine>Scheduled Content - Programmatic Content - Default Playlist</CodeLine>
        <p className="mt-3">If scheduled or targeted content becomes unavailable, CMS automatically switches to the Default Playlist.</p>
      </article>

      <article className="rounded-lg border border-line bg-white p-4">
        <h3 className="font-semibold text-ink">Common Scenarios Where Default Playlist Appears</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>No active campaign exists.</li>
          <li>Campaign schedule expired.</li>
          <li>Hard stop enabled.</li>
          <li>Impression cap reached.</li>
          <li>Content failed synchronization.</li>
          <li>Publish incomplete.</li>
          <li>Unsupported content failed playback.</li>
          <li>Internet interruption occurred.</li>
          <li>SSP or DSP no-fill happened.</li>
        </ul>
      </article>

      <article className="rounded-lg border border-line bg-white p-4">
        <h3 className="font-semibold text-ink">Common Issues</h3>
        <div className="mt-3 grid gap-3 xl:grid-cols-2">
          <LessonCard title="1. Default Playlist Showing Unexpectedly" body="Client reports wrong content showing." items={["Campaign inactive", "Schedule expired", "Publish incomplete", "Content sync failed", "Impression cap reached", "Hard stop enabled", "Check active schedules, timing, publish, sync, and device online status"]} />
          <LessonCard title="2. Black Screen Instead of Default Playlist" body="Fallback playback is not appearing." items={["No image scheduled", "No default playlist configured", "Unsupported media", "Corrupted content", "Verify image, playlist assignment, content format, and republish"]} />
          <LessonCard title="3. Old Default Content Still Showing" body="Device continues showing previous fallback content." items={["New content failed sync", "Device offline", "Cached content active", "Publish incomplete", "Verify synchronization, restart player if required, and republish"]} />
          <LessonCard title="4. Programmatic Falls Back to Default" body="Programmatic content is unavailable and fallback content appears." items={["VAST request failed", "SSP no-fill", "Impression cap exhausted", "Unsupported creative", "Internet instability", "Check SSP logs, VAST response, internet stability, and creative compatibility"]} />
        </div>
      </article>

      <article className="rounded-lg border border-line bg-white p-4">
        <h3 className="font-semibold text-ink">Troubleshooting Checklist</h3>
        <p className="mt-2 font-medium text-slate-800">If users report: Default playlist is showing</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Check schedule validity.</li>
          <li>Check campaign active status.</li>
          <li>Check publish status.</li>
          <li>Check playlist assignment.</li>
          <li>Check device online status.</li>
          <li>Check content synchronization.</li>
          <li>Check hard stop configuration.</li>
          <li>Check impression cap.</li>
          <li>Check SSP or DSP delivery.</li>
        </ul>
      </article>

      <article className="rounded-lg border border-line bg-white p-4">
        <h3 className="font-semibold text-ink">Important Notes</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Default Playlist is a fallback mechanism only.</li>
          <li>It does not replace scheduled campaigns.</li>
          <li>At least one image file should always remain active inside the playlist.</li>
          <li>Lightweight media is strongly recommended.</li>
          <li>Missing default content may result in black screen.</li>
        </ul>
        <h3 className="mt-4 font-semibold text-ink">Best Practice</h3>
        <CodeLine>Create Default Playlist - Upload 1 Optimized Image - Schedule Content - Save Playlist - Publish Content - Verify Playback</CodeLine>
        <h3 className="mt-4 font-semibold text-ink">Recommended Fallback Content</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Company branding.</li>
          <li>Standby visuals.</li>
          <li>Static advertisements.</li>
          <li>Informational slides.</li>
        </ul>
      </article>

      <article className="rounded-lg border border-line bg-white p-4">
        <h3 className="font-semibold text-ink">Troubleshooting Tip</h3>
        <p className="mt-2 font-medium text-slate-800">If clients report: Wrong content is showing instead of campaign</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Check active schedule.</li>
          <li>Check publish status.</li>
          <li>Check content synchronization.</li>
          <li>Check programmatic delivery.</li>
          <li>Check default playlist configuration.</li>
        </ul>
        <h3 className="mt-4 font-semibold text-ink">Next Step</h3>
        <ol className="mt-2 list-decimal space-y-1 pl-5">
          <li>Upload Content</li>
          <li>Schedule Campaign</li>
          <li>Publish Content</li>
          <li>Verify Device Playback</li>
          <li>Monitor Playlogs</li>
        </ol>
      </article>
    </section>
  );
}
