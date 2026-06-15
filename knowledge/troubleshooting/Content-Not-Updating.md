---
category: "Publish Content"
keywords:
  - old content
  - content not updated
  - content not refreshing
  - new content not showing
  - force refresh device
  - content cached
  - deploy not working
  - how long to deploy
  - content stuck
  - device not updating
  - stale content
  - sync not triggering
  - content rollout delay
  - republish device
  - device sync delay
  - content update troubleshooting
description: "Troubleshooting guide for devices showing old content after a new campaign is published — covers sync delays, expected update times, force refresh procedure, and causes of failed content updates."
search_priority: "high"
related_topics:
  - "Publish Content"
  - "Schedule Content"
  - "Basic Troubleshooting"
  - "Storage Management"
---

# Content Not Updating

## Quick Answer

Devices do not receive content updates in real time — they sync with CMS after a publish event. If old content is still showing, confirm the new campaign was saved, approved, and published, and that the device is online with enough storage to download new files. Then republish and restart the player application to trigger an immediate sync.

## Symptoms

- A new campaign was published but old content is still playing on the screen
- The correct schedule is visible in CMS but the device plays the previous campaign
- Content was updated in the playlist but the device still shows the older version
- Some devices in the same network updated correctly while others did not
- CMS shows the device as online and published, but the screen has not changed

## How Content Updates Work

Understanding the sync process explains why content does not update instantly:

1. **Save** — Content is uploaded and the schedule is saved in CMS.
2. **Approve** — The campaign is approved (required before publish in most configurations).
3. **Publish** — Publish queues an update for all targeted devices.
4. **Sync** — Each device checks in with CMS on its next heartbeat cycle and downloads any queued updates.
5. **Playback** — After the download completes, the player begins using the new content at the next playback cycle.

**The device must be online and check in after the publish event.** Publishing to an offline device queues the update, but the device will only download it after reconnecting.

### Expected Update Times

| Condition | Typical Time After Publish |
|---|---|
| Device online, stable broadband | 2–5 minutes |
| Device online, slow or unstable connection | 5–30 minutes (large files) |
| Device offline at publish time | After next reconnection + sync cycle |
| Large file set published to many devices | Updates may stagger over several minutes |

## Troubleshooting Steps

### Step 1 — Confirm Save, Approve, and Publish Are Complete

1. Open the campaign in CMS.
2. Confirm the campaign status is **Approved**.
3. Confirm the campaign has been **Published** — saved but unpublished changes do not reach devices.
4. Check the publish timestamp — any content change requires a new publish to propagate.

### Step 2 — Confirm the Device Is Online

1. Go to **Device Manager** in CMS.
2. Confirm the device shows **Online**.
3. An offline device cannot download updates. Restore internet connectivity first.
4. After the device reconnects, **republish** to trigger a fresh sync — a device that was offline at publish time may not automatically pick up queued updates on all configurations.

### Step 3 — Check Device Storage

1. In Device Manager, check the device storage indicator.
2. If storage is full or near capacity, the device may fail to download new media.
3. Remove expired or unused content from the device's assigned playlists to free space.
4. After freeing storage, republish the campaign.

### Step 4 — Verify Playlist and Schedule Mapping

1. Confirm the published campaign targets the correct **Network**, **Location**, and **Playlist**.
2. Confirm the device is assigned to the correct Location.
3. If the wrong playlist was targeted, the correct device will not receive the update.

### Step 5 — Force Refresh the Device

If all of the above are confirmed and the device is still showing old content:

1. **Republish** the campaign from CMS to re-queue the update.
2. **Restart the LMX Content player application** on the device — see [[Restarting-The-Player-Application]]. A restart forces the player to immediately check for pending updates.
3. After restart, allow **2–5 minutes** on a stable connection for the sync to complete.
4. Verify playback on the physical screen.

### Step 6 — Check for Cached Content

In rare cases, cached content can persist even after a successful sync:

- This may occur if the player crashed mid-download during a previous sync cycle, leaving the download in an incomplete state.
- Force stopping the player app (rather than just closing it) and relaunching clears the download state and triggers a fresh sync.
- A full device reboot clears all transient in-memory and download states.

## Escalation Criteria

Escalate when:

- Device is online, storage is sufficient, campaign is published, player was restarted, and old content continues to play after multiple sync attempts
- Multiple devices at a site are affected simultaneously
- CMS shows sync as complete but the device is not playing the updated content
- Repeated download failures are visible in CMS logs

**Information to collect before escalating:**
- Campaign name and most recent publish timestamp
- Device name and last reported sync time shown in CMS
- Whether the device was online at the time of publish
- Storage status at the time of the issue
- Screenshot of CMS publish status and device status

## Related Notes

[[Old Content Still Showing]]
[[Schedule-Not-Applying]]
[[Restarting-The-Player-Application]]
[[Default Playlist Issue]]
[[Unable to Publish]]
[[imported-troubleshooting-guide-content-not-syncing-in-cms]]
