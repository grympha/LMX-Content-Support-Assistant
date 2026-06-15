---
category: "Basic Troubleshooting"
keywords:
  - html content not playing
  - zip content not playing
  - html black screen
  - html zip blank screen
  - html not rendering
  - zip package not working
  - html zip upload
  - html content broken
  - url widget not loading
  - html layout wrong
  - webview html
  - html package index.html
  - html animation not playing
  - zip file cms
  - html zip troubleshooting
  - url widget blank
description: "Troubleshooting guide for HTML ZIP package and URL widget content not playing in LMX Content — covers black screen, blank render, layout issues, WebView requirements, and ZIP structure problems."
search_priority: "medium"
related_topics:
  - "Basic Troubleshooting"
  - "Supported Operating Systems & Hardware"
  - "Programmatic / VAST"
  - "Publish Content"
---

# HTML / ZIP Content Troubleshooting

## Quick Answer

HTML ZIP packages require `index.html` at the root level of the ZIP and a device running Android System WebView 120+. URL widgets require the same WebView version and live internet access at runtime. If HTML content shows a blank or black screen, verify WebView version first, then validate the ZIP structure. Content that renders in a browser on your computer but fails on the player is almost always a WebView version or device hardware issue.

## Symptoms

- HTML ZIP content shows a black or blank screen on the device
- URL widget displays a white screen, "page not found", or a browser error
- HTML content renders incorrectly — wrong dimensions, layout broken, text or images misaligned
- HTML animations are not playing or are choppy/slow
- ZIP file is accepted by CMS but produces a blank playback on device
- HTML content plays correctly in a browser on a PC but not on the LMX Content Android player
- Content partially renders but animated or interactive elements do not work
- HTML ZIP plays on a Windows device but not on the same-spec Android device

## Common Causes

### WebView Issues

| Cause | Explanation |
|---|---|
| WebView below 100 | Cannot render modern HTML/CSS/JS reliably |
| WebView 100–119 | May fail on complex animations, Canvas, or WebGL elements |
| No Google WebView (LG webOS) | LG webOS uses an internal web engine — complex HTML may not render |

### ZIP Package Structure Issues

| Cause | Explanation |
|---|---|
| `index.html` not at root | Player cannot locate the entry point if it is inside a subfolder |
| Missing referenced assets | Images, fonts, or JS libraries referenced in HTML but not included in the ZIP |
| Absolute file paths in HTML | Paths like `C:\Users\...` break on the player — use relative paths only |
| Password-protected ZIP | CMS cannot extract a password-protected archive |
| Oversized ZIP | Packages with embedded video or large libraries may exceed upload limits |

### URL Widget Issues

- URL widget requires the player to fetch the URL at runtime — no internet access produces a blank screen
- Target URL is blocked by the device's network firewall
- Target URL requires authentication or session cookies the player WebView cannot provide
- Target URL is down, unreachable, or returns an error response

### Device Hardware Limitations

- Devices with 2GB RAM may fail to render heavy HTML animations or Canvas/WebGL content
- Devices without GPU hardware acceleration cannot render WebGL elements
- Android below version 7.0 cannot update WebView and cannot reliably render modern HTML

## Troubleshooting Steps

### Step 1 — Check WebView Version

HTML ZIP and URL widget content require Android System WebView 120+.

1. Check the current WebView version on the device (Settings → Apps → Android System WebView).
2. If the version is below 120, update it before any other troubleshooting.
3. For detailed update steps, see [[Update-Android-WebView]].

### Step 2 — Validate the ZIP Package Structure

For HTML ZIP packages that show blank or fail to play:

1. Open the ZIP file on your computer (extract or preview with an archive manager).
2. Confirm `index.html` is at the **root level** of the ZIP — not inside any subfolder.
   - Correct: `package.zip` → `index.html`, `assets/`, `style.css`
   - Incorrect: `package.zip` → `creative/` → `index.html`
3. Open `index.html` in a browser on your computer and confirm the content renders correctly before uploading to CMS.
4. Check all asset references in `index.html` — they must use **relative paths**, not absolute paths from your local machine.
   - Correct: `<img src="./images/banner.jpg">`
   - Incorrect: `<img src="C:\Users\Design\images\banner.jpg">`
5. Confirm the ZIP is not password-protected.
6. Remove files not required for playback (unused fonts, libraries, test files) to reduce ZIP size.

### Step 3 — Test URL Widget Connectivity

For URL widget content showing a blank or error screen:

1. On the player device, open a browser and navigate to the URL manually.
2. If the URL does not load in the browser, it is either blocked by the device network or the URL is down.
3. If the URL loads in the device browser but not in the LMX Content player, the URL may require browser cookies, authentication headers, or user-agent-specific access that the player WebView does not send.
4. Test whether the URL is accessible from the device on a mobile hotspot connection — if it works on mobile data but not on-site Wi-Fi, a firewall rule is blocking it. See [[Firewall-And-Network-Requirements]].

### Step 4 — Check Device Hardware Specification

1. Confirm the device meets the minimum specification for HTML rendering:
   - Android 11+, WebView 120+, 4GB RAM minimum
   - 8GB RAM recommended for heavy animations, Canvas, or WebGL content
2. Devices with 2GB RAM may fail on complex HTML — check [[System Requirements]] for the minimum supported specification.
3. If the same HTML content works on a high-spec device but not on the test device, hardware capability is the limiting factor.

### Step 5 — Test on a Known-Good Device

1. If the ZIP or URL content plays correctly on a Windows device or a higher-spec Android device but fails on the problem device, the issue is device capability or WebView version — not the content itself.
2. If the content fails on all devices regardless of spec, the issue is the content (ZIP structure, missing assets, or incompatible JavaScript).

### Step 6 — Platform-Specific Notes

**LG webOS:**
LG webOS uses an internal web rendering engine, not Google Android System WebView. Heavy JavaScript frameworks, CSS animations, and WebGL may not render or may render differently. Test HTML content directly on webOS hardware before deploying at scale.

**BrightSign:**
BrightSign uses its own HTML rendering engine. HTML packages built for Android/Windows may require adaptation for BrightSign compatibility. Contact LMX Content support for BrightSign HTML guidance.

**Android vs. Windows:**
HTML ZIP packages that render correctly on Windows but not on Android may depend on a newer rendering engine or GPU feature available in the Windows browser. Ensure Android WebView is updated to 120+ and the device meets hardware minimums.

## Escalation Criteria

Escalate when:

- WebView is confirmed at version 120+, ZIP structure is correct, device meets minimum spec, and HTML content still shows blank
- URL widget loads in the device browser but fails to render inside the LMX Content player on the same device
- HTML content rendered correctly previously but stopped working after a player app update
- Content renders on one Android device but not on another device with the same hardware spec and WebView version

**Information to collect before escalating:**
- Device type and Android version
- Android System WebView version (confirmed after any update)
- ZIP file structure description (screenshot of extracted root contents)
- Whether content renders in the device's native browser
- Whether the issue affects all HTML/ZIP content or only specific packages
- Whether the issue is isolated to one device or all devices at the site

## Related Notes

[[Update-Android-WebView]]
[[Supported Formats]]
[[System Requirements]]
[[Black Screen]]
[[LMX Content VAST Crash]]
[[Programmatic Issues]]
[[Upload-Errors]]
[[imported-android-apk-troubleshooting-steps-for-lmx-content]]
[[imported-device-and-platform-technical-requirements]]
