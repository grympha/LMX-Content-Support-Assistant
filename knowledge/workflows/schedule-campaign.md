---
id: "wf-005"
slug: "schedule-campaign"
label: "Schedule Campaign"
icon: "📅"
shortcut_prefill: "Guide me through scheduling content for a campaign."
category: "Content Scheduling"
difficulty: "beginner"
estimated_minutes: 10
phases: 3
related_topics: ["Schedule Content", "Publish Content", "Default Playlist", "Create Playlist"]
tags: ["schedule", "campaign", "content", "playlist", "publish", "approve", "daypart", "network", "location"]
analytics_label: "Schedule Campaign"
source_file: "knowledge/raw/workflows/Guide me through scheduling content.txt"
---

# Schedule Campaign

Step-by-step guide for scheduling content for a campaign in LMX Content CMS.

## Overview

Scheduling a campaign involves three phases:

1. Preparing content and playlist
2. Creating and configuring the schedule
3. Approving and publishing

## Prerequisites

- Content uploaded to CMS storage (images, videos, HTML ZIPs, or VAST tags)
- Playlist created and populated with content
- Device assigned to the correct Network and Location
- Device is online

---

## Phase 1 — Prepare Content and Playlist

1. Confirm your content is already uploaded to **Storage**.
2. Go to **Playlist** and verify the playlist contains the correct content in the right order.
3. Check that the playlist is assigned to the correct **Network** and **Location**.

> If the Default Playlist is empty or misconfigured, the screen may go blank during scheduling gaps. Always keep at least one item in the Default Playlist.

---

## Phase 2 — Create the Schedule

1. Log into LMX Content CMS.
2. Go to **Schedule Content**.
3. Select:
   - **Network** — the broadcast network for this campaign
   - **Location** — the physical screen location
   - **Playlist** — the playlist to schedule
4. Click **Create** to add new content to the schedule.
5. Select the specific **video or image** to schedule.
6. Click **Create Schedule**.
7. Fill in all schedule details:
   - **Duration** — how long each play of the content lasts
   - **Start Date and End Date** — the campaign active window
   - **Start Time and End Time** — the daily playback window
   - **Daypart** — optional time-of-day targeting (e.g., Morning, Afternoon, Evening)
8. Click **Save**.

---

## Phase 3 — Approve and Publish

1. After saving, click **Approve** to confirm the schedule is ready for broadcast.
2. A confirmation popup appears: *"You just need to do one more step. Just click publish and see your changes on screen."*
3. Click **Publish**.
4. The device will receive the update on its next heartbeat sync cycle.

> ⚠️ A schedule that is saved but not approved will not go live. A schedule that is approved but not published will not be pushed to the device. Both steps are required.

---

## Post-Publish Verification

After publishing, verify the campaign is live:

1. Open **Device Manager** and confirm the device is **Online**.
2. Check the device's last sync timestamp — it should update shortly after publish.
3. Confirm the physical screen is showing the scheduled content.
4. If the content is not showing:
   - Verify the schedule window is currently active (start date/time has passed, end date/time has not).
   - Confirm the campaign is not targeting the wrong Location or Network.
   - Check that the Default Playlist is not overriding your campaign (this happens when the schedule is outside its active window).

---

## Common Mistakes

| Mistake | Result | Fix |
| --- | --- | --- |
| Approved but not published | Content does not reach device | Click Publish after approving |
| Wrong Location selected | Campaign runs on a different screen | Edit schedule and correct the Location |
| Schedule dates expired | Campaign window is inactive | Update start/end dates and republish |
| Daypart not matching current time | Content not playing right now | Verify daypart covers the current time of day |
| Default Playlist empty | Screen goes blank outside campaign window | Add at least one item to the Default Playlist |

---

## Related Topics

- [Schedule Content](../topics/schedule-content.md)
- [Publish Content](../topics/publish-content.md)
- [Default Playlist](../topics/default-playlist.md)
- [Create Playlist](../topics/create-playlist.md)
- [Content Deployment Checklist](./content-deployment-checklist.md)

## Next Step

After publishing, monitor the device in Device Manager for the first 15 minutes to confirm the sync and content playback are working as expected.
