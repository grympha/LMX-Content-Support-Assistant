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

export function ScheduleContentTrainingPage() {
  return (
    <section className="space-y-4 text-sm leading-6 text-slate-700">
      <article className="rounded-lg border border-line bg-white p-4">
        <h2 className="text-base font-semibold text-ink">Schedule Content</h2>
        <h3 className="mt-3 font-semibold text-signal">Overview</h3>
        <p className="mt-2">The Schedule Content module is used to control when, where, and how content will play on devices within the LMX Content CMS platform.</p>
        <p className="mt-2">Scheduling allows users to assign playlists to devices or locations, define campaign duration, control playback timing, automate content delivery, and manage playback priority.</p>
        <div className="mt-3 grid gap-3 xl:grid-cols-2">
          <LessonCard title="Without Scheduling" body="Uploaded content will not automatically play." items={["Uploaded content will not play", "Devices may continue showing default playlist", "Screens may display old or fallback content"]} />
          <LessonCard title="Scheduling Controls" body="Scheduling defines the operational playback rules." items={["Where content plays", "When campaign starts and ends", "Daily playback window", "Active playback days", "Priority during overlaps"]} />
        </div>
      </article>

      <article className="rounded-lg border border-line bg-white p-4">
        <h3 className="font-semibold text-ink">Accessing Schedule Content</h3>
        <p className="mt-2">Navigate to:</p>
        <CodeLine>Dashboard - Schedule Content</CodeLine>
        <p className="mt-3">The Schedule Content page will appear. Select Network, Location, and Playlist before proceeding.</p>
        <div className="mt-3 grid gap-3 xl:grid-cols-3">
          <LessonCard title="Network" body="Determines the deployment group." items={["Client deployment", "Regional grouping", "Operational environment"]} />
          <LessonCard title="Location" body="Determines where the content will play." items={["Specific area", "Screen group", "Timezone context"]} />
          <LessonCard title="Playlist" body="Determines what content will be displayed." items={["Playback sequence", "Assigned media", "Campaign content"]} />
        </div>
        <p className="mt-3 font-medium text-slate-800">Always verify the correct Network, Location, and Playlist to avoid incorrect content playback.</p>
      </article>

      <article className="rounded-lg border border-line bg-white p-4">
        <h3 className="font-semibold text-ink">Prerequisites</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Network created.</li>
          <li>Location created.</li>
          <li>Playlist created.</li>
          <li>Device paired and online.</li>
          <li>Content uploaded into storage.</li>
        </ul>
      </article>

      <article className="rounded-lg border border-line bg-white p-4">
        <h3 className="font-semibold text-ink">Step-by-Step Guide</h3>
        <div className="mt-3 grid gap-3 xl:grid-cols-2">
          <LessonCard title="1. Select Network" body="Choose the appropriate Network for the schedule." items={["Defines deployment environment", "Examples: Malaysia Retail, Airport Screens, ClientA_Main"]} note="Wrong network selection may cause incorrect content playback, wrong device targeting, or reporting mismatch." />
          <LessonCard title="2. Select Location" body="Choose where the content should play." items={["Targets the correct deployment area", "Targets the correct screen group", "Examples: KL Lobby, Terminal 1, Retail Branch Shah Alam"]} />
          <LessonCard title="3. Select Playlist" body="Choose the playlist that contains the content to be played." items={["Playlist must contain content", "Playlist must be active", "Playlist must be properly configured"]} />
          <LessonCard title="4. Configure Schedule Date" body="Select Start Date and End Date to define campaign duration." items={["Example: 01 Jan 2025 to 31 Jan 2025", "Expired schedules automatically stop playback"]} />
          <LessonCard title="5. Configure Playback Time" body="Set Start Time and End Time for daily playback." items={["Example: 08:00 AM to 10:00 PM", "Incorrect timing may cause no playback", "Incorrect timing may trigger default playlist or playback gaps"]} />
          <LessonCard title="6. Configure Playback Days" body="Select the active playback days." items={["Monday to Friday", "Weekend only", "Daily playback"]} />
          <LessonCard title="7. Configure Priority" body="Priority determines which campaign takes precedence during overlapping schedules." items={["Higher priority may override lower priority campaigns", "Higher priority may override filler content", "Higher priority may override default playlist"]} />
          <LessonCard title="8. Save Schedule" body="Click Save after completing the schedule settings." items={["The schedule appears in the schedule list"]} />
        </div>
      </article>

      <article className="rounded-lg border border-line bg-white p-4">
        <h3 className="font-semibold text-ink">Publish Content</h3>
        <p className="mt-2 font-medium text-slate-800">Scheduling alone does not trigger playback.</p>
        <p className="mt-2">After scheduling, content must still be:</p>
        <CodeLine>Approved - Published</CodeLine>
        <ul className="mt-3 list-disc space-y-1 pl-5">
          <li>Without publishing, devices will not receive updates.</li>
          <li>Old content may continue playing.</li>
          <li>Default playlist may appear.</li>
        </ul>
      </article>

      <article className="rounded-lg border border-line bg-white p-4">
        <h3 className="font-semibold text-ink">Common Scheduling Issues</h3>
        <div className="mt-3 grid gap-3 xl:grid-cols-2">
          <LessonCard title="1. Content Not Playing" body="Scheduled content does not appear on screen." items={["Playlist empty", "Schedule expired", "Content not published", "Wrong playback timing", "Device offline", "Check schedule validity, publish status, device status, and playlist assignment"]} />
          <LessonCard title="2. Default Playlist Showing" body="Fallback playlist appears instead of campaign." items={["No active schedule", "Schedule timing mismatch", "Campaign expired", "Hard stop enabled", "Impression cap reached", "Verify active schedule, playback window, and publish status"]} />
          <LessonCard title="3. Old Content Still Showing" body="Device continues showing previous content." items={["Publish incomplete", "Content sync failed", "Device offline", "Cached content active", "Republish campaign, verify sync, restart player if needed"]} />
          <LessonCard title="4. Black Screen After Scheduling" body="Playback shows black screen after schedule setup." items={["Unsupported content", "Corrupted file", "Playlist empty", "Playback window invalid", "Check compatibility, playlist content, scheduling time, and device logs"]} />
          <LessonCard title="5. Device Not Updating" body="Schedule exists but device does not receive updates." items={["Device offline", "Failed synchronization", "Internet issue", "Storage full", "Check online status, sync status, storage, and internet connectivity"]} />
        </div>
      </article>

      <article className="rounded-lg border border-line bg-white p-4">
        <h3 className="font-semibold text-ink">Best Practices</h3>
        <div className="mt-3 grid gap-3 xl:grid-cols-2">
          <LessonCard title="Use Clear Naming Convention" body="Use names that identify campaign and placement." items={["2025_Q1_KL_Campaign", "Retail_Main_Ads"]} />
          <LessonCard title="Verify Device Online Status" body="Check device status before publishing." items={["Ensures devices can receive updates immediately"]} />
          <LessonCard title="Use Correct Playback Window" body="Avoid timing mistakes that stop playback." items={["Avoid overlapping schedules", "Avoid incorrect timezone configuration", "Avoid expired campaign dates"]} />
          <LessonCard title="Validate Content Before Scheduling" body="Confirm the media is suitable before assigning it." items={["Test media locally", "Verify supported formats", "Optimize media size"]} />
          <LessonCard title="Publish Immediately After Approval" body="Publishing keeps deployment aligned with the schedule." items={["Prevents outdated playback", "Prevents unsynchronized devices", "Prevents campaign delay"]} />
        </div>
      </article>

      <article className="rounded-lg border border-line bg-white p-4">
        <h3 className="font-semibold text-ink">Important Notes</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Scheduling controls playback behavior.</li>
          <li>Content must be published after scheduling.</li>
          <li>Device must remain online to receive updates.</li>
          <li>Incorrect scheduling configuration may trigger default playlist playback.</li>
          <li>Timezone mismatch may affect playback timing.</li>
        </ul>
      </article>

      <article className="rounded-lg border border-line bg-white p-4">
        <h3 className="font-semibold text-ink">Troubleshooting Checklist</h3>
        <p className="mt-2 font-medium text-slate-800">If users report: Content scheduled but not showing</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Check schedule validity.</li>
          <li>Check playlist assignment.</li>
          <li>Check publish status.</li>
          <li>Check device online status.</li>
          <li>Check content synchronization.</li>
          <li>Check storage availability.</li>
          <li>Check content compatibility.</li>
        </ul>
        <h3 className="mt-4 font-semibold text-ink">Best Practice Workflow</h3>
        <CodeLine>Upload Content - Create Playlist - Schedule Content - Approve Campaign - Publish Content - Verify Playback - Monitor Playlogs</CodeLine>
        <h3 className="mt-4 font-semibold text-ink">Next Step</h3>
        <ol className="mt-2 list-decimal space-y-1 pl-5">
          <li>Approve Campaign</li>
          <li>Publish Content</li>
          <li>Verify Device Playback</li>
          <li>Monitor Playlogs</li>
        </ol>
      </article>
    </section>
  );
}
