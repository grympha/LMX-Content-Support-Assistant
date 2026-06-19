---
id: "wf-002"
slug: "deploy-new-screen"
label: "Deploy New Screen"
icon: "📺"
shortcut_prefill: "What are the complete steps to deploy a new screen in LMX Content?"
category: "Screen Deployment"
difficulty: "intermediate"
estimated_minutes: 30
phases: 5
related_topics: ["Create Device", "Schedule Content", "Publish Content", "Device Pairing"]
tags: ["deploy", "screen", "setup", "playlist", "publish", "android", "brightSign", "webview"]
analytics_label: "Deploy New Screen"
source_file: "knowledge/raw/workflows/What are the complete steps to deploy a new screen in LMX Content.txt"
---

# Deploy New Screen

Full deployment guide for bringing a new screen into production — hardware setup through first content play.

## Overview

Deploying a new screen involves five sequential phases:

1. Hardware setup and requirements check
2. Device registration in CMS
3. App installation and pairing
4. Content upload and scheduling
5. Deployment verification

## Prerequisites

- Physical device meeting LMX Content hardware requirements
- LMX Content CMS access with Device Manager, Playlist, and Schedule permissions
- Content files ready to upload (images, videos, or HTML ZIPs)
- Stable internet on the device

---

## Phase 1 — Hardware Setup

1. Confirm the device meets minimum requirements:
   - **Android:** Android 11+, 4 GB RAM (8 GB recommended), Android System WebView 120+
   - **Windows:** Windows 10+, supported CPU/GPU configuration
   - **BrightSign:** Supported firmware version
   - **Linux:** Ubuntu LTS, matching LMX Content Linux requirements
2. Power on the device and connect to the network (Wi-Fi or Ethernet — Ethernet preferred for stability).
3. Install the LMX Content player app:
   - Android: install via APK or Play Store
   - Windows: install the Windows player from the download link
4. For Android: verify **Android System WebView** is updated to version 120 or higher via Settings → Apps → Android System WebView.

> ⚠️ Outdated WebView is the most common cause of blank VAST/HTML screens. Update it before pairing.

---

## Phase 2 — Add the Device in CMS

1. Log into LMX Content CMS.
2. Go to **Device Manager**.
3. Click **Add Device** and fill in all details:
   - Device name (unique and descriptive)
   - Operating system / player type
   - Network and Location assignment
   - Screen orientation
4. Save the device. A **verification code** is generated — keep it ready for pairing.

---

## Phase 3 — Pair the App to CMS

1. Open the LMX Content app on the physical device.
2. Enter the verification code when prompted.
3. Confirm the device appears as **Online** in Device Manager within 1–2 minutes.

---

## Phase 4 — Upload Content and Schedule

1. Upload media to CMS (images, videos, HTML ZIPs, or VAST tags).
2. Create a **Playlist** and add your content.
3. Go to **Schedule Content**:
   - Select Network, Location, and Playlist
   - Set start/end dates, start/end times, and daypart if needed
4. Click **Approve** to confirm the schedule.
5. Click **Publish** — the device will sync on its next heartbeat cycle.

---

## Phase 5 — Verify the Deployment

1. Open **Device Manager** and confirm the device is **Online**.
2. Check that the device has synced the latest content (last sync timestamp).
3. Physically verify the screen is displaying the expected content.
4. If the screen is blank or showing old content, run through the checklist below.

---

## Deployment Verification Checklist

- [ ] Device shows **Online** in Device Manager
- [ ] Device has synced within the last 10 minutes
- [ ] Playlist is assigned and schedule is active (not expired)
- [ ] Content is approved and published
- [ ] Default Playlist is not empty (fallback safety net)
- [ ] Screen physically shows correct content

---

## Pro Tips

- Always check the **schedule** — if the active window has not started or has expired, the screen will fall back to the Default Playlist.
- For VAST/HTML content, **WebView 120+** is non-negotiable. If the screen is blank and you just deployed, check WebView first.
- If the device is offline, the CMS will not push any updates until it reconnects.

---

## Troubleshooting

| Problem | Solution |
| --- | --- |
| Screen blank after deployment | Check playlist is not empty, schedule is active, content is published |
| Content not updating | Verify device is online and sync timestamp is recent |
| VAST content not playing | Update Android System WebView to version 120+ |
| Device still showing old content | Republish and wait for the next heartbeat sync cycle |
| Device offline after pairing | Check network connectivity, firewall, and internet access on device |

---

## Related Topics

- [Create New Device](./create-new-device.md)
- [Schedule Content](../topics/schedule-content.md)
- [Publish Content](../topics/publish-content.md)
- [Programmatic VAST](../topics/programmatic-vast.md)
- [Basic Troubleshooting](../topics/basic-troubleshooting.md)

## Next Step

After verification, monitor the device in Device Manager for 24 hours to confirm stable playback and sync behaviour.
