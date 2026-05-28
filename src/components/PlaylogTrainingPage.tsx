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

export function PlaylogTrainingPage() {
  return (
    <section className="space-y-4 text-sm leading-6 text-slate-700">
      <article className="rounded-lg border border-line bg-white p-4">
        <h2 className="text-base font-semibold text-ink">Playlog</h2>
        <h3 className="mt-3 font-semibold text-signal">Overview</h3>
        <p className="mt-2">The Playlog feature in LMX Content CMS records all media playback activity from registered devices.</p>
        <p className="mt-2">Playlogs are critical for playback verification, campaign reporting, proof-of-play validation, troubleshooting, and internal auditing.</p>
        <div className="mt-3 grid gap-3 xl:grid-cols-2">
          <LessonCard title="Playlogs Help Confirm" body="Use playlogs to validate playback activity." items={["What content played", "When content played", "Which device played the content", "Playback duration", "Playback status"]} />
          <LessonCard title="Playlog Types" body="LMX Content provides two playlog views." items={["General Playlog for all-device monitoring and reporting", "Device-Level Playlog for a specific device investigation"]} />
        </div>
      </article>

      <article className="rounded-lg border border-line bg-white p-4">
        <h3 className="font-semibold text-ink">General Playlog</h3>
        <p className="mt-2">General Playlog is commonly used for campaign reporting, playback verification, operational monitoring, client reporting, and bulk playback analysis.</p>
        <CodeLine>30 days including current date</CodeLine>
        <p className="mt-2 font-medium text-slate-800">General Playlog download is limited to 30 days including the current date.</p>
      </article>

      <article className="rounded-lg border border-line bg-white p-4">
        <h3 className="font-semibold text-ink">Device-Level Playlog</h3>
        <p className="mt-2">Device-Level Playlog is used for troubleshooting specific devices, playback diagnostics, investigating playback history, and validating screen activity.</p>
        <div className="mt-3 grid gap-3 xl:grid-cols-2">
          <LessonCard title="Day Selection" body="Device-Level Playlog has no day selection limitation." items={["Useful for historical device investigation", "Focused on one selected device", "Available from Device Manager action tools"]} />
          <LessonCard title="Data Availability" body="Device-Level Playlog data is only available up to the previous day." items={["Current-day logs may not appear immediately", "Synchronization timing can delay visibility", "Use previous-day data for stable reporting"]} />
        </div>
      </article>

      <article className="rounded-lg border border-line bg-white p-4">
        <h3 className="font-semibold text-ink">Accessing General Playlog</h3>
        <CodeLine>Dashboard - Playlog</CodeLine>
        <ol className="mt-3 list-decimal space-y-2 pl-5">
          <li>Navigate to Dashboard - Playlog.</li>
          <li>Click Get New Log.</li>
          <li>The Filter Playlog screen will appear.</li>
          <li>Select the required date range.</li>
          <li>Choose All Devices or specific devices.</li>
          <li>Choose All Content or specific content.</li>
          <li>Customize headers if required.</li>
          <li>Select CSV or PDF as the file type.</li>
          <li>Click Get Log to generate and download the report.</li>
        </ol>
      </article>

      <article className="rounded-lg border border-line bg-white p-4">
        <h3 className="font-semibold text-ink">General Playlog Filters</h3>
        <div className="mt-3 grid gap-3 xl:grid-cols-2">
          <LessonCard title="Date Range" body="Select From Date and To Date." items={["Date selection is required", "General Playlog is limited to 30 days", "Use the correct reporting period"]} />
          <LessonCard title="Device Filter" body="Filter playback records by device." items={["All Devices", "Specific Device or devices", "Useful for client or network-specific reporting"]} />
          <LessonCard title="Content Filter" body="Filter playback records based on selected media." items={["All Content", "Specific Content", "Useful for campaign validation"]} />
          <LessonCard title="Customize Headers and File Type" body="Choose what appears in the export." items={["Device Name", "Playlist Name", "Playback Duration", "Content Name", "CSV or PDF export"]} />
        </div>
      </article>

      <article className="rounded-lg border border-line bg-white p-4">
        <h3 className="font-semibold text-ink">Accessing Device-Level Playlog</h3>
        <CodeLine>Dashboard - Device Manager</CodeLine>
        <ol className="mt-3 list-decimal space-y-2 pl-5">
          <li>Navigate to Dashboard - Device Manager.</li>
          <li>Select the preferred device from the device list.</li>
          <li>Under the Action section, click Playlog.</li>
          <li>Select the date range and playback filters.</li>
          <li>Click Get Log to generate the device-specific report.</li>
        </ol>
      </article>

      <article className="rounded-lg border border-line bg-white p-4">
        <h3 className="font-semibold text-ink">Playlog Report Fields</h3>
        <div className="mt-3 grid gap-3 xl:grid-cols-2">
          <LessonCard title="Device Name" body="Shows where playback happened." items={["The player or device where content was played"]} />
          <LessonCard title="Playlist Name" body="Shows playlist context." items={["Playlist associated with the content"]} />
          <LessonCard title="Content Name" body="Shows media file identity." items={["Media file name used for playback"]} />
          <LessonCard title="Play Start / End" body="Shows playback timing." items={["Playback timestamps", "Duration played", "Brand or schedule type when available"]} />
        </div>
      </article>

      <article className="rounded-lg border border-line bg-white p-4">
        <h3 className="font-semibold text-ink">Use Case Comparison</h3>
        <div className="mt-3 grid gap-3 xl:grid-cols-2">
          <LessonCard title="General Playlog" body="Use for all-device reports and summaries." items={["Scope: all registered devices", "Filters: date, devices, content", "Export: CSV or PDF", "Best for client reporting and campaign summary"]} />
          <LessonCard title="Device-Level Playlog" body="Use for focused troubleshooting." items={["Scope: one specific device", "Filters: date", "Export: CSV or PDF", "Best for playback history and diagnostics"]} />
        </div>
      </article>

      <article className="rounded-lg border border-line bg-white p-4">
        <h3 className="font-semibold text-ink">Data Synchronization Logic</h3>
        <p className="mt-2">Devices send playlog data based on the Playlog Interval configured under Network settings.</p>
        <CodeLine>Playlog Interval</CodeLine>
        <ul className="mt-3 list-disc space-y-1 pl-5">
          <li>If a device becomes offline, logs are stored locally.</li>
          <li>Synchronization resumes once the device reconnects.</li>
          <li>This helps prevent playback data loss during temporary connectivity interruption.</li>
        </ul>
      </article>

      <article className="rounded-lg border border-line bg-white p-4">
        <h3 className="font-semibold text-ink">Common Playlog Issues</h3>
        <div className="mt-3 grid gap-3 xl:grid-cols-2">
          <LessonCard title="Missing Playlogs" body="Playback records are not visible." items={["Player application not running", "Content not actually played", "Device offline", "Schedule invalid", "Synchronization failure"]} note="Check device online status, playback confirmation, schedule validity, and player application status." />
          <LessonCard title="Playlog Not Updating" body="Logs are delayed or stale." items={["Unstable internet", "Failed synchronization", "Heartbeat interruption", "Player issue"]} note="Verify internet stability, restart player if needed, and check synchronization status." />
          <LessonCard title="Content Played but No Playlog" body="Playback happened but no record is generated." items={["Playlog disabled", "Reporting delay", "Playback interruption", "Synchronization issue"]} note="Check playlog configuration, network stability, and synchronization timing." />
          <LessonCard title="Device Missing from Report" body="Expected device does not appear in export." items={["Wrong device filter", "Wrong network selection", "Device offline", "Synchronization incomplete"]} note="Verify network selection, device filter, and synchronization status." />
        </div>
      </article>

      <article className="rounded-lg border border-line bg-white p-4">
        <h3 className="font-semibold text-ink">Best Practices</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Use General Playlog for weekly reports, monthly campaign reporting, playback validation, and client summaries.</li>
          <li>Use Device-Level Playlog for playback investigation, black screen analysis, missing content troubleshooting, and device diagnostics.</li>
          <li>Archive exported logs for audits, campaign verification, and operational reference.</li>
          <li>Verify device connectivity so playback logs can synchronize correctly.</li>
        </ul>
      </article>

      <article className="rounded-lg border border-line bg-white p-4">
        <h3 className="font-semibold text-ink">Important Notes</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>General Playlog download is limited to 30 days including current date.</li>
          <li>Device-Level Playlog is available up to the previous day only.</li>
          <li>Offline devices store logs locally until reconnection.</li>
          <li>Playlog generation depends on successful synchronization.</li>
          <li>Incorrect filters may result in missing playback data.</li>
        </ul>
      </article>

      <article className="rounded-lg border border-line bg-white p-4">
        <h3 className="font-semibold text-ink">Troubleshooting Checklist</h3>
        <p className="mt-2 font-medium text-slate-800">If users report: Playlog missing</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Check device online status.</li>
          <li>Verify playback actually happened.</li>
          <li>Check synchronization status.</li>
          <li>Validate schedule timing and campaign status.</li>
          <li>Verify internet connectivity.</li>
          <li>Check playlog interval configuration.</li>
        </ul>
      </article>

      <article className="rounded-lg border border-line bg-white p-4">
        <h3 className="font-semibold text-ink">Best Practice Workflow</h3>
        <CodeLine>Publish Content - Verify Playback - Monitor Device Status - Generate Playlog - Export Report - Archive Logs</CodeLine>
        <h3 className="mt-4 font-semibold text-ink">Next Step</h3>
        <ol className="mt-2 list-decimal space-y-1 pl-5">
          <li>Verify Campaign Delivery.</li>
          <li>Validate Playback.</li>
          <li>Troubleshoot Playback Issues.</li>
          <li>Export Client Reports.</li>
        </ol>
      </article>
    </section>
  );
}
