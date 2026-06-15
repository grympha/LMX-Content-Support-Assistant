---
playbook: true
id: "missing-playlog"
title: "Missing Playlog"
triggers: [missing playlog, missing playlogs, no playlog, playlog missing, report missing, proof of play missing]
summary: "Missing playlogs can happen when playback did not trigger, the device was offline, playlog sync is delayed, the date range is wrong, or the report is requested before device-level logs are available."
what_to_check:
  - "Confirm the content actually played on the device during the requested period."
  - "Check device online status and synchronization after playback."
  - "Check the playlog date range; General Playlog has a 30-day limit."
  - "For device-level playlog, confirm the report is requested up to the previous day only."
  - "Check whether Play Log is enabled for the network/campaign where required."
  - "Confirm the correct device/content filter is selected."
how_to_fix:
  - "Use the correct date range and report level: General or Device Level."
  - "Wait for synchronization if playback just happened recently."
  - "Bring the device online and allow playlogs to sync."
  - "Regenerate the report after confirming filters and dates."
  - "If logs remain missing, collect campaign, device, date/time, and playback evidence for escalation."
next_steps:
  - "Ask for campaign name, content name, device, date range, and report type."
  - "Compare schedule timing against actual playback time."
  - "Escalate if confirmed playback exists but logs do not sync after the expected window."
client_response: "We are validating whether the content played during the selected date range and whether the device synchronized its playlogs. Playlog availability depends on playback, device connectivity, report type, and date range. We will regenerate the report with the correct filters and escalate if confirmed playback is still missing from the logs."
---

# Missing Playlog

## Summary

Missing playlogs can happen when playback did not trigger, the device was offline, playlog sync is delayed,
the date range is wrong, or the report is requested before device-level logs are available.

## Important Limits

| Report Type | Date Limit |
|---|---|
| General Playlog | 30 days including current date |
| Device Playlog | Available up to the previous day only |

## What to Check

1. Confirm the content actually played on the device during the requested period.
2. Check device online status and synchronization after playback.
3. Check the playlog date range — General Playlog has a 30-day limit.
4. For device-level playlog, confirm the report is requested up to the previous day only.
5. Check whether Play Log is enabled for the network/campaign where required.
6. Confirm the correct device/content filter is selected.

## How to Fix

- Use the correct date range and report level: General or Device Level.
- Wait for synchronization if playback just happened recently.
- Bring the device online and allow playlogs to sync.
- Regenerate the report after confirming filters and dates.
- If logs remain missing, collect campaign, device, date/time, and playback evidence for escalation.

## Next Steps

- Ask for campaign name, content name, device, date range, and report type.
- Compare schedule timing against actual playback time.
- Escalate if confirmed playback exists but logs do not sync after the expected window.

## Client Response Template

> We are validating whether the content played during the selected date range and whether the device
> synchronized its playlogs. Playlog availability depends on playback, device connectivity, report type,
> and date range. We will regenerate the report with the correct filters and escalate if confirmed
> playback is still missing from the logs.
