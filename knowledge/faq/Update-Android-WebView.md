---
category: "Installation of LMX Content App"
keywords:
  - update webview
  - android system webview
  - webview version
  - webview 120
  - webview outdated
  - how to update webview
  - webview update android
  - webview apk
  - check webview version
  - webview not updating
  - update android webview steps
  - webview 100
  - google webview
description: "Step-by-step guide for checking and updating Android System WebView on LMX Content player devices — required for VAST, HTML ZIP, and URL widget playback."
search_priority: "high"
related_topics:
  - "Installation of LMX Content App"
  - "Programmatic / VAST"
  - "Supported Operating Systems & Hardware"
  - "Basic Troubleshooting"
---

# Update Android System WebView

## Quick Answer

Android System WebView must be version 120 or higher for VAST, URL widget, and HTML ZIP content to render correctly in LMX Content. Check the current version via Google Play Store or Settings → Apps. Update by searching "Android System WebView" in Play Store and tapping Update. If Play Store is unavailable (kiosk or enterprise Android), the WebView APK can be sideloaded — contact LMX Content support for the recommended APK.

## Why WebView Matters for LMX Content

Android System WebView is the browser engine used by Android apps to render web-based content. LMX Content uses WebView to display:

- **VAST / programmatic ads** — WebView parses the VAST XML response and renders the creative
- **URL widgets** — WebView loads and renders a live URL inside the player
- **HTML ZIP packages** — WebView renders the HTML, CSS, and JavaScript from the uploaded ZIP

An outdated WebView version causes these content types to fail silently, show a blank screen, or crash the player application. Outdated WebView does NOT affect standard MP4 video or image playback.

## Minimum WebView Requirements

| Content Type | Minimum WebView Version |
|---|---|
| VAST / Programmatic | WebView 100+ |
| URL Widget | WebView 100+ |
| HTML ZIP Package | WebView 100+ |
| **Recommended (all types)** | **WebView 120+** |

## Step 1 — Check the Current WebView Version

### Via Google Play Store

1. Open **Google Play Store** on the device.
2. Tap the profile icon (top right corner).
3. Tap **Manage apps & device**.
4. Tap the **Manage** tab.
5. Search for **Android System WebView** in the list of installed apps.
6. The version number is shown below the app name.

### Via Device Settings

1. Open **Settings** on the device.
2. Navigate to **Apps** (also called **Application Manager** on some devices).
3. Tap **All apps** and scroll to **Android System WebView**.
4. The version is listed under App info.

## Step 2 — Update via Google Play Store

This is the standard recommended update method.

1. Open **Google Play Store** on the device.
2. In the search bar, type **Android System WebView**.
3. Tap the result published by **Google LLC**.
4. If an update is available, tap **Update**.
5. Wait for the download and installation to complete.
6. Once updated, **restart the LMX Content player application**.
7. Confirm the updated version is 120 or higher.

If only an **Open** button is visible (no Update button), WebView is already at the latest version available for this device.

## Step 3 — If Play Store Is Not Available

Some Android deployments (enterprise Android, kiosk builds, certain Android TV boxes) do not include Google Play Store.

1. Check whether the device has an alternative app store (Amazon Appstore, device manufacturer's store) that carries Android System WebView.
2. If no app store is available, the WebView APK can be sideloaded:
   - Enable **Install from Unknown Sources** in Settings → Security (or Settings → Apps → Special app access on Android 8+).
   - Transfer the WebView APK to the device via USB or network file share.
   - Install the APK and verify the version is 120+.
3. Contact LMX Content support to request the recommended WebView APK for your specific device model — do not use unofficial third-party APK sites.

## Step 4 — Verify the Update Resolved the Issue

1. After updating WebView, restart the LMX Content player application.
2. Wait 1–2 minutes for the player to reconnect to CMS.
3. Attempt to play the content that was failing — VAST ad, HTML ZIP package, or URL widget.
4. If the content now renders correctly, the issue was WebView version.
5. If content still fails after a confirmed WebView 120+ update, the issue is a different cause — see [[Programmatic Issues]] for VAST, or [[HTML-ZIP-Content]] for HTML ZIP and URL widget troubleshooting.

## Devices Where WebView Cannot Be Updated

Some Android devices do not support WebView updates:

- **Android version below 7.0**: WebView is a locked system component and cannot be updated independently
- **Manufacturer-locked system partition**: custom ROM or firmware prevents Play Store updates to system apps
- **Android TV boxes without Google certification**: may ship with an outdated WebView and no update path

If WebView cannot be updated on the target device:
- For programmatic content: the device must be replaced with one running Android 11+ and WebView 120+
- For HTML ZIP and URL widgets: consider using MP4 content as an alternative, or replace the device
- See [[System Requirements]] for minimum device specifications

## Related Notes

[[LMX Content VAST Crash]]
[[Programmatic Issues]]
[[VAST Issues]]
[[System Requirements]]
[[HTML-ZIP-Content]]
[[imported-android-apk-troubleshooting-steps-for-lmx-content]]
