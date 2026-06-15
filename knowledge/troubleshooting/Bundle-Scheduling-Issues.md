---
category: "Bundle Scheduling"
keywords:
  - bundle scheduling
  - bundle not working
  - bundle schedule error
  - bundle not visible
  - sub content error
  - maximum sub contents
  - bundle not applying
  - bundle content not updating
  - bundle schedule troubleshooting
  - bundle slot conflict
  - bundle content not showing
  - maximum -1 sub contents
  - bundle playlist error
description: "Troubleshooting guide for bundle scheduling issues in LMX Content — covers the sub-content error, bundle not applying to devices, and content not updating after republish."
search_priority: "high"
related_topics:
  - "Bundle Scheduling"
  - "Schedule Content"
  - "Publish Content"
  - "Basic Troubleshooting"
---

# Bundle Scheduling Issues

## Quick Answer

A bundle groups multiple content items into a single scheduled unit. If a bundle is not applying to devices, confirm the schedule has been saved, approved, and published, and that the target network and playlist match the device's assignment. The most common bundle error — "Maximum -1 sub contents allowed" — is caused by a network start/end time conflict where both values are set identically. Correcting the network times resolves this immediately.

## Symptoms

- Bundle option is not visible when creating a new schedule
- Content items are not appearing inside the bundle during scheduling
- Error message: **"Maximum -1 sub contents allowed"** when adding sub-content
- Bundle schedule is created successfully but content is not showing on device
- Bundle content is not updating after republishing
- Bundle schedule is visible in CMS but the correct playlist is not receiving it
- Only some devices in the same network are playing the bundle content
- Bundle plays some items but skips others

## Common Causes

### Bundle Creation Errors

| Cause | Explanation |
|---|---|
| Network start/end time conflict | Start time and end time set to identical values — sub-content cannot be added |
| Content not in Main Storage | Items must be uploaded to storage before they can be included in a bundle |
| Insufficient playlist loop duration | Bundle items' combined duration exceeds the available playlist slot time |
| Missing approval | Bundle schedule saved but not approved — cannot be published |

### Bundle Not Applying to Devices

- Schedule saved but not published after the last change
- Device assigned to a different Network or Location than the one targeted by the bundle
- Device was offline at publish time and has not re-synced since
- Default playlist requirement not met — device falls back to default content

### Bundle Content Not Updating

- Campaign not republished after a content change (saved ≠ published)
- Device storage full — bundle items cannot be downloaded even if published
- Player application not synced since publish — restart required to force an immediate sync

## Troubleshooting Steps

### Step 1 — Resolve "Maximum -1 sub contents allowed"

This error occurs when the network schedule has identical start and end times.

1. In CMS, navigate to **Networks** and open the target network.
2. Locate the **Network Start Time** and **Network End Time** fields.
3. Confirm they are not set to the same value. A common misconfiguration is both set to `00:00` or both set to `23:59`.
4. Set a valid range: for a full-day schedule, use Start: `00:00` and End: `23:59`.
5. Save the network settings.
6. Return to the bundle schedule and retry adding sub-content.

For the original incident where this error was documented, see [[imported-troubleshooting-unable-to-add-sub-content]].

### Step 2 — Confirm Content Is in Main Storage

1. Navigate to **Main Storage** in CMS.
2. Confirm every item to be included in the bundle is already uploaded and visible.
3. Bundles can only reference content that exists in storage — items scheduled directly from an upload queue may not be available to bundle scheduling.
4. Upload any missing content before creating or editing the bundle schedule.

### Step 3 — Verify Playlist Duration

1. Open the target playlist.
2. Check the total loop duration.
3. Confirm the combined duration of all bundle items does not exceed the available time in the playlist.
4. If duration is exceeded, either reduce individual item durations, increase the playlist loop duration, or remove items from the bundle.

### Step 4 — Create and Approve the Bundle Schedule

1. From **Main Storage**, select the content items for the bundle.
2. Click **Create Schedule** (or use the bundle scheduling flow).
3. Select the target **Network** and **Playlist**.
4. Set the schedule start and end dates and times.
5. Save the schedule.
6. When prompted for approval, confirm approval — unapproved schedules cannot be published.

For a basic bundle creation walkthrough, see [[imported-scheduling-bundles]] and [[Bundle Scheduling]].

### Step 5 — Publish and Verify Device Assignment

1. After saving and approving, click **Publish** on the bundle schedule.
2. In **Device Manager**, confirm the affected devices are **Online**.
3. Confirm the targeted Network and Location match the device's assigned Network and Location.
4. Wait **2–5 minutes** after publish for the device to sync and download the bundle items.

If the device was offline at publish time, republish after it reconnects to trigger a fresh sync.

### Step 6 — Bundle Not Updating After Changes

If bundle content was changed and republished but the device still shows old content:

1. Confirm the updated schedule was **saved AND published** — saved-only changes do not reach devices.
2. Restart the LMX Content player application on the device to force an immediate sync — see [[Restarting-The-Player-Application]].
3. Check device storage in Device Manager — a full storage prevents bundle file downloads.
4. For detailed content update troubleshooting, see [[Content-Not-Updating]].

## Escalation Criteria

Escalate when:

- Network start/end time is confirmed correct but the "Maximum -1 sub contents allowed" error persists
- Bundle is published, device assignments are correct, device is online, but content is not playing after 15+ minutes
- Bundle schedule exists in CMS but does not appear on any device in the target network
- A specific content item within the bundle fails to play while others play correctly
- Repeated bundle creation fails with no clear error message

**Information to collect before escalating:**
- Network name and targeted Location/Playlist
- Network start time and end time values
- Bundle schedule name and publish timestamp
- Error message shown (exact text or screenshot)
- Device name and last reported sync time
- Storage status on affected devices

## Related Notes

[[Bundle Scheduling]]
[[Schedule-Not-Applying]]
[[Content-Not-Updating]]
[[Restarting-The-Player-Application]]
[[imported-scheduling-bundles]]
[[imported-troubleshooting-unable-to-add-sub-content]]
[[Default Playlist Issue]]
