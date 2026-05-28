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

export function SupportedHardwareTrainingPage() {
  return (
    <section className="space-y-4 text-sm leading-6 text-slate-700">
      <article className="rounded-lg border border-line bg-white p-4">
        <h2 className="text-base font-semibold text-ink">Supported Operating Systems & Hardware</h2>
        <h3 className="mt-3 font-semibold text-signal">Overview</h3>
        <p className="mt-2">LMX Content CMS supports multiple operating systems and hardware platforms for digital signage deployments.</p>
        <div className="mt-3 grid gap-3 xl:grid-cols-2">
          <LessonCard title="Supported Platforms" body="Supported platforms include the common player operating environments." items={["Windows", "Linux", "Android", "LG webOS", "BrightSign"]} />
          <LessonCard title="Hardware Affects" body="Hardware capability directly affects playback and operation quality." items={["Playback stability", "Synchronization performance", "HTML rendering", "Programmatic campaign support", "Multi-zone playback capability"]} note="Low-spec hardware may cause lag, black screen, failed synchronization, player crash, or unstable HTML rendering." />
        </div>
      </article>

      <article className="rounded-lg border border-line bg-white p-4">
        <h3 className="font-semibold text-ink">Supported Operating Systems & Hardware</h3>
        <div className="mt-3 grid gap-3 xl:grid-cols-2">
          <LessonCard title="Windows" body="Windows 10 and 11." items={["Intel Core i5/i7 recommended", "Intel Pentium II/III or AMD Processor supported", "64-bit recommended, 32-bit supported", "8GB RAM recommended, 4GB minimum", "1GB Graphics Card and above"]} />
          <LessonCard title="Linux" body="Ubuntu 18.04 LTS and above." items={["Intel Core i5/i7 recommended", "Intel Pentium II/III supported", "64-bit recommended, 32-bit supported", "8GB RAM recommended, 4GB minimum", "1GB Graphics Card and above"]} />
          <LessonCard title="Android" body="Android 11 and above." items={["Rockchip RK3328 Cortex A53 Quad-Core", "Amlogic S905 Cortex A53 Quad-Core", "64-bit recommended", "8GB RAM / 128GB ROM recommended", "4GB RAM / 64GB ROM minimum"]} />
          <LessonCard title="LG webOS" body="LG webOS Signage 4.0.1." items={["Alpha 5 Gen5 AI", "ARM Cortex-A53 Quad-Core 1.0GHz", "64-bit recommended", "4GB RAM / 16GB ROM", "2GB RAM / 8GB ROM"]} />
          <LessonCard title="BrightSign" body="HS123, XT1143, HD224." items={["ARM Cortex-A15 Quad-Core 1.0 and 2.0GHz", "64-bit recommended", "4GB RAM / 16GB ROM", "2GB RAM / 8GB ROM"]} />
        </div>
      </article>

      <article className="rounded-lg border border-line bg-white p-4">
        <h3 className="font-semibold text-ink">Windows Support Notes</h3>
        <CodeLine>Windows 10 | Windows 11</CodeLine>
        <p className="mt-2 font-medium text-slate-800">Windows 7 is no longer supported.</p>
        <CodeLine>Last supported Windows 7 version: 1.0.29.29_SR</CodeLine>
      </article>

      <article className="rounded-lg border border-line bg-white p-4">
        <h3 className="font-semibold text-ink">Android Support Notes</h3>
        <div className="mt-3 grid gap-3 xl:grid-cols-2">
          <LessonCard title="Recommended Android Specification" body="Use this level for stable production playback." items={["Android 11+", "8GB RAM / 128GB ROM", "64-bit", "Quad-Core CPU"]} />
          <LessonCard title="Minimum Android Specification" body="Minimum hardware should still be validated before deployment." items={["4GB RAM / 64GB ROM", "Android 11+", "Updated WebView", "Stable storage availability"]} />
        </div>
        <p className="mt-3 font-medium text-slate-800">Devices with 2GB RAM / 16GB storage may experience unstable playback, sync issues, HTML rendering limitations, or black screen during heavy playback, especially for VAST, HTML ZIP, URL widgets, and split layouts.</p>
      </article>

      <article className="rounded-lg border border-line bg-white p-4">
        <h3 className="font-semibold text-ink">LG webOS and BrightSign Support Notes</h3>
        <div className="mt-3 grid gap-3 xl:grid-cols-2">
          <LessonCard title="LG webOS" body="LG webOS has limited feature support." items={["Advanced HTML rendering may be limited", "Programmatic features may be limited", "Certain widgets may be limited", "Complex layouts may be limited"]} note="Use lightweight media playback for stable operation." />
          <LessonCard title="BrightSign" body="Supported devices include BrightSign HS123, XT1143, and HD224." items={["Stable MP4 playback", "Lightweight deployments", "Commercial signage environments"]} />
        </div>
      </article>

      <article className="rounded-lg border border-line bg-white p-4">
        <h3 className="font-semibold text-ink">Supported Media Formats</h3>
        <div className="mt-3 grid gap-3 xl:grid-cols-2">
          <LessonCard title="Windows" body="Supported media formats." items={["Image: PNG, JPG, JPEG", "Video: MP4, MOV, WEBM, WMV"]} />
          <LessonCard title="Linux" body="Supported media formats." items={["Image: PNG, JPG, JPEG", "Video: MP4, MOV, WEBM"]} />
          <LessonCard title="Android" body="Supported media formats." items={["Image: PNG, JPG, JPEG", "Video: MP4, MKV"]} />
          <LessonCard title="LG webOS" body="Supported media formats." items={["Image: PNG, JPG, JPEG", "Video: MP4"]} />
          <LessonCard title="BrightSign" body="Supported media formats." items={["Image: PNG, JPG, JPEG", "Video: MP4"]} />
        </div>
      </article>

      <article className="rounded-lg border border-line bg-white p-4">
        <h3 className="font-semibold text-ink">Supported Web Browsers and File Types</h3>
        <div className="mt-3 grid gap-3 xl:grid-cols-2">
          <LessonCard title="Supported Web Browsers" body="Use supported browsers to avoid CMS display, upload, or configuration issues." items={["Google Chrome version 104", "Mozilla Firefox version 104", "Apple Safari version 5.1.7"]} />
          <LessonCard title="Supported File Types" body="Use supported file types for upload and playback." items={["Image: PNG, JPEG, GIF", "Video: MP4", "HTML & ZIP: HTML5", "Audio: MP3", "Document: PDF"]} />
        </div>
      </article>

      <article className="rounded-lg border border-line bg-white p-4">
        <h3 className="font-semibold text-ink">Programmatic Campaign Support</h3>
        <div className="mt-3 grid gap-3 xl:grid-cols-2">
          <LessonCard title="Windows 10 & 11" body="Fully supported for programmatic campaign playback." items={["VAST", "URL", "HTML", "Offline ZIP", "Online ZIP"]} />
          <LessonCard title="Android 11+" body="Fully supported when WebView is modern enough." items={["WebView version 100+", "VAST", "URL", "HTML online content"]} />
        </div>
        <CodeLine>WebView Version 100 or above</CodeLine>
        <p className="mt-2">Programmatic creatives such as VAST, URL, and HTML require a modern browser engine, updated WebView, and supported rendering environment.</p>
      </article>

      <article className="rounded-lg border border-line bg-white p-4">
        <h3 className="font-semibold text-ink">Common Compatibility Issues</h3>
        <div className="mt-3 grid gap-3 xl:grid-cols-2">
          <LessonCard title="Black Screen on Android" body="Commonly caused by hardware or rendering limits." items={["Low RAM", "Outdated WebView", "Unsupported codec", "Insufficient storage"]} note="Check Android version, WebView version, device specification, and content compatibility." />
          <LessonCard title="HTML Content Not Rendering" body="HTML playback depends on browser/WebView support." items={["Outdated browser engine", "Unsupported WebView", "Insufficient RAM", "Unsupported device"]} note="Update WebView, use Android 11+, and verify HTML compatibility." />
          <LessonCard title="VAST Content Failing" body="Programmatic playback needs current rendering support and stable internet." items={["Outdated OS", "Unsupported browser engine", "Internet instability", "Unsupported creative"]} note="Verify WebView version, internet connectivity, and creative compatibility." />
          <LessonCard title="Slow Synchronization" body="Sync performance depends on hardware, storage, and network quality." items={["Low storage", "Weak CPU", "Unstable internet", "Oversized content"]} note="Optimize content, verify hardware specification, and monitor storage usage." />
        </div>
      </article>

      <article className="rounded-lg border border-line bg-white p-4">
        <h3 className="font-semibold text-ink">Best Practices</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Use recommended hardware specifications for stable playback and synchronization.</li>
          <li>Keep operating systems, WebView, and browsers updated.</li>
          <li>Optimize media content with compressed MP4, optimized images, and lightweight HTML packages.</li>
          <li>Validate hardware before deployment to prevent black screen, sync failure, or unsupported playback.</li>
        </ul>
      </article>

      <article className="rounded-lg border border-line bg-white p-4">
        <h3 className="font-semibold text-ink">Important Notes</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Hardware capability directly affects playback performance.</li>
          <li>Low-end Android devices may struggle with advanced content.</li>
          <li>Programmatic playback requires updated browser and WebView environments.</li>
          <li>Unsupported OS versions may cause playback instability.</li>
          <li>Windows 7 is no longer supported.</li>
        </ul>
      </article>

      <article className="rounded-lg border border-line bg-white p-4">
        <h3 className="font-semibold text-ink">Troubleshooting Checklist</h3>
        <p className="mt-2 font-medium text-slate-800">If users report: Device supports CMS but playback unstable</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Check operating system version.</li>
          <li>Check RAM and storage.</li>
          <li>Check WebView version.</li>
          <li>Check internet stability.</li>
          <li>Review content complexity.</li>
          <li>Check graphics capability.</li>
        </ul>
      </article>

      <article className="rounded-lg border border-line bg-white p-4">
        <h3 className="font-semibold text-ink">Best Practice Workflow</h3>
        <CodeLine>Validate Device Specification - Install Latest Player - Update WebView/Browser - Upload Optimized Content - Schedule Content - Publish Campaign - Verify Playback</CodeLine>
        <h3 className="mt-4 font-semibold text-ink">Next Step</h3>
        <ol className="mt-2 list-decimal space-y-1 pl-5">
          <li>Install Player Application.</li>
          <li>Pair Device.</li>
          <li>Upload Content.</li>
          <li>Schedule Campaign.</li>
          <li>Verify Playback.</li>
        </ol>
      </article>
    </section>
  );
}
