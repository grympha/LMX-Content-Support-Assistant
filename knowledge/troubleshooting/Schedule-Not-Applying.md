---
category: "Schedule Content"
keywords:
  - schedule not working
  - campaign not applying
  - content not scheduled
  - campaign not live
  - schedule not activating
  - campaign created but not playing
  - schedule approved not playing
  - content published not showing
  - campaign active no playback
  - schedule timezone issue
  - wrong playlist campaign
  - campaign targeting issue
  - published but not playing
  - schedule configuration issue
description: "Troubleshooting guide for schedules that are saved and published but content is not playing on the device — covers approval state, timing, timezone, playlist mapping, device sync, and location targeting."
search_priority: "high"
related_topics:
  - "Schedule Content"
  - "Publish Content"
  - "Basic Troubleshooting"
  - "Default Playlist"
---

# Schedule Not Applying

## Quick Answer

A schedule that is visible in CMS but not playing on the device is almost always caused by one of four issues: the campaign was not approved and published, the schedule timing or timezone is incorrect, the device has not yet synchronized the latest publish, or the campaign is targeting the wrong playlist or location. Work through each layer in order: approval → publish → device sync → schedule configuration.

## Campaign Not Applying After Publish

Use this guide when a campaign has been approved and published in CMS but is not applying to the device.

## Schedule Published But Content Not Showing

Use this guide when a schedule has been published successfully but the expected content is not showing on screen.

## Symptoms

- Schedule is visible in CMS but content is not playing on the device
- Device shows the Default Playlist instead of the scheduled campaign
- Campaign is marked Active but playback is not observed
- New campaign plays on some devices but not others in the same network
- Content plays at the wrong time or outside the expected daypart window
- Schedule ran correctly before and stopped applying after a configuration change

## Common Causes

| Layer | Cause |
|---|---|
| Approval | Campaign saved but not approved |
| Publish | Campaign approved but not yet published |
| Sync | Published but device has not completed synchronization |
| Timing | Schedule date range has not started, or has already expired |
| Timezone | Device or location timezone does not match the schedule configuration |
| Daypart | Current time is outside the configured daypart window |
| Playlist mapping | Campaign is targeting the wrong Network, Location, or Playlist |
| Location tags | Tag mismatch between campaign targeting and device inventory |
| Default Playlist | Default Playlist correctly activates when no schedule is active — this is expected |

## Troubleshooting Steps

### Step 1 — Confirm Approval Status

1. Open the campaign in CMS.
2. Confirm the campaign status shows **Approved** — not Draft or Pending.
3. If not approved, approve the campaign.
4. After approving, proceed to Step 2.

### Step 2 — Confirm Publish Status

1. Click **Publish** if it has not been published since the last change.
2. Verify the publish completes without an error message.
3. Note the publish timestamp — devices only receive updates made after a publish event.
4. If the publish step shows an error, see [[Unable to Publish]] for the default playlist and format requirements.

### Step 3 — Check Device Online and Sync Status

1. Go to **Device Manager** in CMS.
2. Confirm the affected device shows **Online**.
3. An offline device cannot receive updates — restore internet connectivity first, then republish.
4. After a successful publish to an online device, allow **2–5 minutes** for the sync to complete on a stable connection.
5. If the device was offline at the time of publish, republish after the device reconnects.

### Step 4 — Verify Schedule Timing

Open the schedule configuration and confirm:

- **Start Date** and **End Date** are correct and the current date falls within the active window.
- **Start Time** and **End Time** define a window that includes the current time.
- **Daypart** settings (if configured) include the current time and day of week.
- The campaign has not expired — an expired campaign falls back to the Default Playlist.

A campaign outside its active window falls back to the Default Playlist automatically. This is expected behaviour, not an error.

### Step 5 — Verify Timezone Configuration

Timezone mismatch is a common cause of campaigns appearing at the wrong time or not playing during expected windows.

1. In CMS, check the **Location** timezone setting for the device's assigned location.
2. Confirm this matches the physical timezone of the screen.
3. Example: a campaign scheduled for 09:00 in a Location set to UTC will play at 09:00 UTC — which may be a different local time depending on where the screen is installed.
4. To correct: update the Location timezone, then republish the campaign.

### Step 6 — Verify Playlist and Location Mapping

1. Confirm the campaign targets the correct **Network**.
2. Confirm the campaign targets the correct **Location** or location group.
3. Confirm the campaign is assigned to the correct **Playlist**.
4. Open Device Manager and verify the device is assigned to the correct Location.

### Step 7 — Check for Location Tag Mismatch

Location tag mismatch is a documented cause of campaigns silently missing all targeted devices. See [[New Campaign Missing]] for the full RCA of this failure mode.

1. Open the campaign targeting configuration.
2. Verify the location tags on the campaign exactly match the tags on the device inventory.
3. A single character difference in a tag (including trailing spaces or capitalisation) causes the campaign to miss all targeted devices silently.

### Step 8 — Force Refresh

If all of the above are confirmed correct and content is still not showing:

1. Republish the campaign from CMS.
2. Restart the LMX Content player application — see [[Restarting-The-Player-Application]].
3. Allow one sync cycle (2–5 minutes) after restart.
4. Verify playback on the physical screen.

## Escalation Criteria

Escalate when:

- All steps above have been verified and content still does not play
- Multiple devices across different locations are affected simultaneously
- Schedule was working correctly and stopped without any configuration change
- CMS shows publish as complete but the device consistently does not receive the update after multiple republish attempts

**Information to collect before escalating:**
- Campaign name and schedule configuration details
- Device name and assigned location
- Publish timestamp from the most recent publish
- Screenshot of the schedule configuration
- Screenshot of the device status at the time of the issue
- Playlog showing what content is currently playing on the device

## Related Notes

[[New Campaign Missing]]
[[Default Playlist Issue]]
[[Content-Not-Updating]]
[[Restarting-The-Player-Application]]
[[Unable to Publish]]
[[Schedule Content]]
