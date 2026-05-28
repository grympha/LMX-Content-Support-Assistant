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

export function AppInstallationTrainingPage() {
  return (
    <section className="space-y-4 text-sm leading-6 text-slate-700">
      <article className="rounded-lg border border-line bg-white p-4">
        <h2 className="text-base font-semibold text-ink">Installation of LMX Content App</h2>
        <h3 className="mt-3 font-semibold text-signal">Overview</h3>
        <p className="mt-2">This guide explains how to install and register the LMX Content Player application for Android and Windows devices.</p>
        <div className="mt-3 grid gap-3 xl:grid-cols-2">
          <LessonCard title="Supported Devices" body="Use this guide for standard player installation." items={["Android devices", "Windows devices"]} />
          <LessonCard title="Player Responsibilities" body="The LMX Content Player handles screen playback operations." items={["Downloading content", "Playing scheduled media", "Synchronizing with CMS", "Generating playlogs", "Receiving playlist updates"]} />
        </div>
      </article>

      <article className="rounded-lg border border-line bg-white p-4">
        <h3 className="font-semibold text-ink">Important Notes</h3>
        <div className="mt-3 grid gap-3 xl:grid-cols-2">
          <LessonCard title="Application Update" body="To update an existing application, download and install the latest version directly without uninstalling the previous version." items={["Preserves device pairing", "Preserves local cache", "Preserves player configuration"]} note="Do not uninstall first unless instructed for troubleshooting." />
          <LessonCard title="New Device Installation" body="Before installing on a new device, create the device in the CMS platform first." items={["Creates the CMS device record", "Generates the verification code", "Allows registration after installation"]} note="Verification codes are one-time use only." />
        </div>
        <CodeLine>Create the device in the CMS platform first</CodeLine>
      </article>

      <article className="rounded-lg border border-line bg-white p-4">
        <h3 className="font-semibold text-ink">Software Render (SR) Version</h3>
        <CodeLine>SR = Software Render</CodeLine>
        <p className="mt-2">The SR build is designed for devices without GPU acceleration.</p>
        <div className="mt-3 grid gap-3 xl:grid-cols-2">
          <LessonCard title="How SR Works" body="The SR version relies on CPU-based rendering." items={["Improves compatibility for low-end devices", "Supports unsupported GPU environments", "May reduce graphical performance"]} />
          <LessonCard title="Recommended For" body="Use SR when normal rendering is unstable." items={["Low-spec hardware", "Unsupported GPU environments", "Older Android or Windows devices"]} />
        </div>
      </article>

      <article className="rounded-lg border border-line bg-white p-4">
        <h3 className="font-semibold text-ink">Android Installation Guide</h3>
        <ol className="mt-3 list-decimal space-y-2 pl-5">
          <li>Download the Android installation APK.</li>
          <li>After download, click Install.</li>
          <li>When prompted, select Just Once.</li>
          <li>Click Install again to begin installation.</li>
          <li>Allow all requested permissions, including Permission 1/2 and Permission 2/2.</li>
        </ol>
        <p className="mt-3 font-medium text-slate-800">Permissions are required for storage access, playback functionality, and content synchronization.</p>
      </article>

      <article className="rounded-lg border border-line bg-white p-4">
        <h3 className="font-semibold text-ink">Android Registration Process</h3>
        <ol className="mt-3 list-decimal space-y-2 pl-5">
          <li>Launch the installed player application.</li>
          <li>Select Login with Verification Code.</li>
          <li>Enter the verification code generated from CMS.</li>
          <li>Confirm successful registration.</li>
        </ol>
        <CodeLine>Verification codes are one-time use only</CodeLine>
        <ul className="mt-3 list-disc space-y-1 pl-5">
          <li>Device becomes paired.</li>
          <li>Synchronization begins.</li>
          <li>Content can be published.</li>
        </ul>
      </article>

      <article className="rounded-lg border border-line bg-white p-4">
        <h3 className="font-semibold text-ink">Windows Installation Guide</h3>
        <ol className="mt-3 list-decimal space-y-2 pl-5">
          <li>Download the Windows installer package.</li>
          <li>Right-click the installer.</li>
          <li>Select Run as Administrator.</li>
          <li>If Windows Defender displays a security popup, select Run anyway.</li>
          <li>Follow the installation wizard until completion.</li>
        </ol>
        <p className="mt-3 font-medium text-slate-800">Running as Administrator ensures proper installation permissions.</p>
      </article>

      <article className="rounded-lg border border-line bg-white p-4">
        <h3 className="font-semibold text-ink">Windows Registration Process</h3>
        <ol className="mt-3 list-decimal space-y-2 pl-5">
          <li>Launch the installed LMX Content Player.</li>
          <li>Enter the verification code generated from CMS.</li>
          <li>Confirm successful registration.</li>
        </ol>
        <CodeLine>Verification codes are one-time use only</CodeLine>
        <ul className="mt-3 list-disc space-y-1 pl-5">
          <li>Device becomes paired.</li>
          <li>Synchronization begins.</li>
          <li>Content can be published.</li>
        </ul>
      </article>

      <article className="rounded-lg border border-line bg-white p-4">
        <h3 className="font-semibold text-ink">Common Installation Issues</h3>
        <div className="mt-3 grid gap-3 xl:grid-cols-2">
          <LessonCard title="APK Installation Blocked" body="Android installation cannot continue." items={["Unknown sources disabled", "Security restriction", "Unsupported Android version"]} note="Enable Install from Unknown Sources and retry installation." />
          <LessonCard title="Windows Installation Failed" body="Installer cannot complete setup." items={["Insufficient permissions", "Antivirus restriction", "Corrupted installer"]} note="Run as administrator, allow the installer, or re-download it." />
          <LessonCard title="Verification Code Invalid" body="Registration fails after entering the code." items={["Code already used", "Typing error", "Expired code"]} note="Generate a new verification code from CMS." />
          <LessonCard title="Player Not Synchronizing" body="Player is installed but not receiving updates." items={["Internet issue", "Firewall restriction", "Device not paired", "Unstable network"]} note="Check internet, CMS pairing status, and player application status." />
          <LessonCard title="Black Screen After Installation" body="Player opens but playback is blank." items={["Unsupported hardware", "Unsupported codec", "Failed synchronization", "Storage limitation"]} note="Verify device specification, restart player, and validate content compatibility." />
        </div>
      </article>

      <article className="rounded-lg border border-line bg-white p-4">
        <h3 className="font-semibold text-ink">Recommended Device Requirements</h3>
        <CodeLine>Android 11+ | 4GB RAM minimum | 32GB/64GB Storage | Quad-core CPU</CodeLine>
        <p className="mt-3">These specifications are recommended for stable playback, HTML content, VAST content, and multi-zone layouts.</p>
      </article>

      <article className="rounded-lg border border-line bg-white p-4">
        <h3 className="font-semibold text-ink">Best Practices</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Always create the device in CMS before registration.</li>
          <li>Use stable internet during installation and registration.</li>
          <li>Install the latest version only.</li>
          <li>Avoid uninstalling during updates to prevent pairing loss, cache removal, or configuration reset.</li>
        </ul>
      </article>

      <article className="rounded-lg border border-line bg-white p-4">
        <h3 className="font-semibold text-ink">Troubleshooting Checklist</h3>
        <p className="mt-2 font-medium text-slate-800">If users report: Player installed but not working</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Check installation completed successfully.</li>
          <li>Verify device is paired correctly.</li>
          <li>Check internet connectivity.</li>
          <li>Confirm player permissions are allowed.</li>
          <li>Validate device compatibility.</li>
          <li>Check storage availability.</li>
        </ul>
      </article>

      <article className="rounded-lg border border-line bg-white p-4">
        <h3 className="font-semibold text-ink">Best Practice Workflow</h3>
        <CodeLine>Create Device in CMS - Download Player - Install Application - Launch Player - Enter Verification Code - Verify Pairing - Publish Content - Verify Playback</CodeLine>
        <h3 className="mt-4 font-semibold text-ink">Next Step</h3>
        <ol className="mt-2 list-decimal space-y-1 pl-5">
          <li>Pair Device.</li>
          <li>Upload Content.</li>
          <li>Schedule Content.</li>
          <li>Publish Campaign.</li>
          <li>Verify Playback.</li>
        </ol>
      </article>
    </section>
  );
}
