---
id: "wf-007"
slug: "content-deployment-checklist"
label: "Content Deployment Checklist"
icon: "📋"
shortcut_prefill: "Provide the deployment checklist before publishing content."
category: "Content Deployment"
difficulty: "beginner"
estimated_minutes: 5
phases: 1
related_topics: ["Publish Content", "Schedule Content", "Default Playlist", "Storage Management"]
tags: ["checklist", "deployment", "publish", "content", "schedule", "device", "storage", "format", "approve"]
analytics_label: "Content Deployment Checklist"
source_file: "knowledge/raw/workflows/Provide the deployment checklist be.txt"
---

# Content Deployment Checklist

Run through this checklist before every content publish to prevent common deployment failures.

## Overview

Deployment failures are almost always preventable. This checklist covers the six critical areas to verify before clicking **Publish**.

---

## 1. Default Playlist Check

- [ ] Default Playlist has at least one scheduled image (video optional but recommended).
- [ ] Default Playlist is assigned to the correct Network and Location.
- [ ] Default Playlist is not empty — an empty Default Playlist causes a black screen when no campaign is active.

> The Default Playlist is the fallback. If the active campaign expires or has a gap, the screen switches to the Default Playlist. If it is empty, the screen goes black.

---

## 2. Content Status

- [ ] All content is **uploaded** to CMS storage.
- [ ] All content is **approved** (not just saved — approval is required before scheduling).
- [ ] Media format is supported:
  - ✅ MP4 (H.264 codec recommended)
  - ✅ JPG / PNG
  - ✅ HTML5 ZIP
  - ✅ MP3
  - ✅ PDF
  - ❌ Avoid unsupported codecs (HEVC/H.265 may not play on all devices)
  - ❌ Avoid oversized files (compress videos before upload)

---

## 3. Schedule Validation

- [ ] Schedule has a valid **Start Date and End Date** (dates are not in the past).
- [ ] Schedule has valid **Start Time and End Time** (time window covers the expected broadcast period).
- [ ] Daypart is set correctly if time-of-day targeting is required.
- [ ] No conflicting or duplicate schedules exist for the same device/location.
- [ ] Campaign is not expired.

---

## 4. Target Mapping

- [ ] **Network** is correctly assigned.
- [ ] **Location** is correctly assigned.
- [ ] **Playlist** is correctly assigned to the schedule.
- [ ] **Device** is in the correct Location (check Device Manager → device record).
- [ ] No duplicate schedules targeting the same device at the same time.

---

## 5. Device Readiness

- [ ] Device is **Online** (check Device Manager status).
- [ ] Player app is running (content is actively playing or screen is in standby).
- [ ] Device is not in a reboot loop or error state.
- [ ] Device has sufficient storage to download new content (see Section 6).

---

## 6. Storage and Connectivity

- [ ] Device storage is not full (a full storage blocks content downloads).
  - Check: Device Manager → select device → check Storage Utilisation if available.
  - Rule of thumb: keep at least 20% storage free.
- [ ] Network connection is stable (test internet on the device directly if unsure).
- [ ] No firewall or DNS rules blocking CMS communication.

---

## Pre-Publish Summary

If all six sections are checked, you are ready to publish.

```
Proceed to:  CMS → Schedule Content → Approve → Publish
```

---

## Common Publish Errors and Fixes

| Error Message | Cause | Fix |
| --- | --- | --- |
| Missing Default Playlist | Default Playlist is empty or unassigned | Add content to Default Playlist and assign to location |
| Unsupported Format | Media file uses an unsupported codec | Convert to MP4 H.264 and re-upload |
| Schedule Conflict | Duplicate schedule for same device/time | Remove or adjust the conflicting schedule |
| Content Not Approved | Content is saved but not approved | Open the content and click Approve |
| Device Offline | Device cannot receive the publish push | Resolve connectivity first, then republish |
| Storage Full | Device cannot download new content | Delete old/unused content from device storage |

---

## Related Topics

- [Publish Content](../topics/publish-content.md)
- [Schedule Content](../topics/schedule-content.md)
- [Default Playlist](../topics/default-playlist.md)
- [Storage Management](../topics/storage-management.md)
- [Schedule Campaign](./schedule-campaign.md)

## Next Step

After publishing, monitor Device Manager for 10–15 minutes to confirm the device syncs and begins playing the new content.
