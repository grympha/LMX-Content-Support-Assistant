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

export function StorageManagementTrainingPage() {
  return (
    <section className="space-y-4 text-sm leading-6 text-slate-700">
      <article className="rounded-lg border border-line bg-white p-4">
        <h2 className="text-base font-semibold text-ink">Storage Management</h2>
        <h3 className="mt-3 font-semibold text-signal">Overview</h3>
        <p className="mt-2">The Storage module in LMX Content CMS is the centralized area for uploading, organizing, and managing media files such as videos, images, PDFs, HTML, audio, and widgets.</p>
        <p className="mt-2">These files can later be assigned to playlists, scheduled for playback, and published across the digital signage network.</p>
        <p className="mt-2">Storage is organized into Tenant-Level Storage, Network-Level Storage, and Common Folder Storage so reusable content can be managed across multiple deployments and locations.</p>
      </article>

      <article className="rounded-lg border border-line bg-white p-4">
        <h3 className="font-semibold text-ink">Types of Storage</h3>
        <div className="mt-3 grid gap-3 xl:grid-cols-3">
          <LessonCard title="Tenant Storage" body="Private storage for your organization." items={["Content is accessible only to users under the same tenant", "Useful for tenant-owned content"]} />
          <LessonCard title="Network Storage" body="Content dedicated to specific networks." items={["Separate media by client", "Separate media by branch", "Separate media by region"]} />
          <LessonCard title="Common Storage" body="Shared storage accessible across networks within the same tenant." items={["Logos", "Templates", "Corporate videos", "Reusable assets"]} />
        </div>
      </article>

      <article className="rounded-lg border border-line bg-white p-4">
        <h3 className="font-semibold text-ink">Supported File Types</h3>
        <div className="mt-3 grid gap-3 xl:grid-cols-2">
          <LessonCard title="Media and Documents" body="Only supported formats can be scheduled and played on devices." items={["Images: .jpg, .jpeg, .png, .gif", "Videos: .mp4, .mov, .avi", "Audio: .mp3, .wav", "Documents: .pdf, .zip, .html"]} />
          <LessonCard title="Web Widgets" body="Dynamic web-based content can also be scheduled." items={["URL", "Google IMA (VAST)", "RSS Feed"]} note="Unsupported file types may fail upload, fail playback, display black screen, or cause content synchronization issues." />
        </div>
      </article>

      <article className="rounded-lg border border-line bg-white p-4">
        <h3 className="font-semibold text-ink">Accessing the Storage Module</h3>
        <p className="mt-2">Navigate to:</p>
        <CodeLine>Dashboard - Main Storage</CodeLine>
        <p className="mt-3">The Storage page will display folder structure, uploaded content, filtering options, and upload controls.</p>
      </article>

      <article className="rounded-lg border border-line bg-white p-4">
        <h3 className="font-semibold text-ink">How to Upload Files</h3>
        <div className="mt-3 grid gap-3 xl:grid-cols-2">
          <LessonCard title="1. Open Storage" body="Navigate to the Main Storage tab." items={["Open the correct tenant, network, or common folder area"]} />
          <LessonCard title="2. Click Upload" body="Click the Upload icon located at the top-right corner." items={["Upload icon", "Top-right control area"]} />
          <LessonCard title="3. Select Files" body="Select files manually or drag and drop files into the upload window." items={["Images", "Videos", "PDFs", "HTML ZIP files", "Audio", "Widgets"]} />
          <LessonCard title="4. Choose Upload Option" body="Choose how the content should be handled after selection." items={["Upload: uploads content into storage only", "Upload & Schedule: uploads and redirects to scheduling workflow", "Cancel: stops the upload process"]} />
          <LessonCard title="5. Verify Uploaded Files" body="Uploaded files appear inside the selected folder view." items={["Correct file uploaded", "Correct folder placement", "Upload completed successfully"]} />
        </div>
      </article>

      <article className="rounded-lg border border-line bg-white p-4">
        <h3 className="font-semibold text-ink">Folder Management</h3>
        <p className="mt-2">Folders can be created under Tenant Storage and Network Storage to improve operational organization and content management.</p>
        <h4 className="mt-3 font-semibold text-signal">Recommended folder structure</h4>
        <CodeLine>Client - Campaign - Content Type</CodeLine>
        <h4 className="mt-3 font-semibold text-signal">Example</h4>
        <CodeLine>ClientA - 2025_Campaign - Videos</CodeLine>
      </article>

      <article className="rounded-lg border border-line bg-white p-4">
        <h3 className="font-semibold text-ink">File Operations</h3>
        <div className="mt-3 grid gap-3 xl:grid-cols-2">
          <LessonCard title="Available Actions" body="Storage files can be managed after upload." items={["Preview: quick view of uploaded media", "Rename: update file name", "Move: transfer files into different folders", "Delete: remove unused files", "Filter: filter by media type"]} />
          <LessonCard title="Supported Filters" body="Use filters to quickly find content." items={["Image", "Video", "Audio", "ZIP", "HTML", "PDF"]} />
        </div>
      </article>

      <article className="rounded-lg border border-line bg-white p-4">
        <h3 className="font-semibold text-ink">Widget Scheduling Advanced</h3>
        <p className="mt-2">LMX Content supports dynamic widget scheduling. Widgets can be assigned to playlists, scheduled, and published like normal content.</p>
        <div className="mt-3 grid gap-3 xl:grid-cols-2">
          <LessonCard title="Supported Widget Types" body="Dynamic content options include:" items={["URL: display external websites", "Google IMA (VAST): serve programmatic advertisements", "RSS Feed: display scrolling news or live information", "Weather Trigger: trigger playback based on live weather conditions"]} />
          <LessonCard title="Related Guides" body="Related operational workflows include:" items={["How to Schedule Content in CMS", "How to Bundle Schedule in CMS", "How to Schedule URL & Google IMA (VAST)", "How to Schedule Weather Trigger", "How to Delete Content in CMS Storage"]} />
        </div>
      </article>

      <article className="rounded-lg border border-line bg-white p-4">
        <h3 className="font-semibold text-ink">Best Practices</h3>
        <div className="mt-3 grid gap-3 xl:grid-cols-2">
          <LessonCard title="Use Clear Naming Convention" body="Use readable names that identify campaign and purpose." items={["Recommended: 2025_Q1_Promo_Video.mp4", "Recommended: MY_KL_Lobby_Ads.mp4", "Avoid: test.mp4, video1.mp4, abc.zip"]} />
          <LessonCard title="Organize by Folder Structure" body="Separate content by client, region, campaign, and content type." items={["Easier troubleshooting", "Faster operations", "Cleaner storage management"]} />
          <LessonCard title="Delete Unused Files" body="Regularly remove expired or duplicate content." items={["Expired campaigns", "Old test content", "Duplicate uploads", "Prevents storage full conditions"]} />
          <LessonCard title="Store Reusable Assets in Common Folder" body="Use Common Folder for reusable content." items={["Logos", "Templates", "Intro videos", "Corporate branding"]} />
          <LessonCard title="Upload Optimized Files" body="Optimized media improves playback stability." items={["Compressed MP4", "Optimized image resolution", "Lightweight HTML packages"]} note="Helps prevent screen lag, failed sync, player crash, and excessive storage usage." />
        </div>
      </article>

      <article className="rounded-lg border border-line bg-white p-4">
        <h3 className="font-semibold text-ink">Restrictions</h3>
        <div className="mt-3 grid gap-3 xl:grid-cols-2">
          <LessonCard title="Scheduled Content Cannot Be Deleted" body="Files currently used in active schedules cannot be deleted." items={["Purpose: prevents playback interruption"]} />
          <LessonCard title="Unsupported Formats Are Rejected" body="Unsupported file types fail during upload, cannot be scheduled, or may not render properly." items={["Validate file extension", "Validate codec compatibility", "Optimize content before upload"]} />
        </div>
      </article>

      <article className="rounded-lg border border-line bg-white p-4">
        <h3 className="font-semibold text-ink">Common Storage Issues</h3>
        <div className="mt-3 grid gap-3 xl:grid-cols-2">
          <LessonCard title="1. Upload Failed" body="Possible causes include unsupported format, unstable internet, oversized file, or browser interruption." items={["Verify file type", "Retry upload", "Optimize file size"]} />
          <LessonCard title="2. Content Uploaded but Not Playing" body="Content exists in storage but is not playing." items={["Check playlist", "Check schedule", "Check publish status", "Check file compatibility"]} />
          <LessonCard title="3. Black Screen After Upload" body="Playback may fail because of file or sync issues." items={["Corrupted file", "Unsupported resolution", "Incomplete sync", "Failed HTML rendering", "Test locally and re-upload"]} />
          <LessonCard title="4. Device Storage Full" body="Device may run out of local playback storage." items={["Excessive content downloads", "Old unused campaigns", "Large HTML ZIP files", "Delete unused files and optimize media size"]} />
        </div>
      </article>

      <article className="rounded-lg border border-line bg-white p-4">
        <h3 className="font-semibold text-ink">Important Notes</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Storage management directly affects playback stability.</li>
          <li>Large media files may impact low-spec Android devices.</li>
          <li>HTML ZIP and VAST content require stronger device capability.</li>
          <li>Background Download is recommended for smoother synchronization.</li>
          <li>Organized folder structure improves operational efficiency.</li>
        </ul>
        <h3 className="mt-4 font-semibold text-ink">Best Practice Workflow</h3>
        <CodeLine>Upload Content - Organize Into Folder - Assign Playlist - Schedule Content - Publish Campaign - Verify Playback</CodeLine>
        <h3 className="mt-4 font-semibold text-ink">Next Step</h3>
        <ol className="mt-2 list-decimal space-y-1 pl-5">
          <li>Create Playlist</li>
          <li>Schedule Content</li>
          <li>Approve Campaign</li>
          <li>Publish Content</li>
          <li>Verify Device Playback</li>
        </ol>
      </article>
    </section>
  );
}
