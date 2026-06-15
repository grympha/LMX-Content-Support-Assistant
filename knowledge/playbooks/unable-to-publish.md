---
playbook: true
id: "publish-error"
title: "Unable to Publish"
triggers: [unable to publish, publish error, cannot publish, can't publish, before creating a schedule, default playlist error]
summary: "Publish errors commonly happen when required Default Playlist content is missing, content is not scheduled/approved, the target playlist is wrong, or unsupported media is used."
what_to_check:
  - "Check the exact publish error message."
  - "Confirm Default Playlist has at least one scheduled image and one scheduled video if required by the platform rule."
  - "Confirm uploaded content is scheduled, approved, and assigned to the correct playlist."
  - "Check valid media formats such as MP4, JPG, and PNG."
  - "Verify Network, Location, Playlist, and campaign target mapping."
  - "Check schedule start/end date and time are valid."
how_to_fix:
  - "Add or schedule the missing Default Playlist image/video content."
  - "Approve the content after saving the schedule."
  - "Replace unsupported media with supported formats."
  - "Correct the target playlist or location mapping, then publish again."
  - "If publish still fails, capture the error message and affected campaign details for escalation."
next_steps:
  - "Ask for the exact error message and screenshot."
  - "Validate Default Playlist first, then campaign schedule, then publish again."
  - "Confirm device sync after successful publish."
client_response: "The publish error is usually caused by a missing Default Playlist requirement or content that is not fully scheduled/approved. We will verify the Default Playlist, content format, approval status, and playlist mapping, then republish once the missing requirement is corrected."
---

# Unable to Publish

## Summary

Publish errors commonly happen when required Default Playlist content is missing, content is not
scheduled/approved, the target playlist is wrong, or unsupported media is used.

## What to Check

1. Check the exact publish error message.
2. Confirm Default Playlist has at least one scheduled image and one scheduled video if required.
3. Confirm uploaded content is scheduled, approved, and assigned to the correct playlist.
4. Check valid media formats: MP4, JPG, PNG.
5. Verify Network, Location, Playlist, and campaign target mapping.
6. Check schedule start/end date and time are valid.

## How to Fix

- Add or schedule the missing Default Playlist image/video content.
- Approve the content after saving the schedule.
- Replace unsupported media with supported formats.
- Correct the target playlist or location mapping, then publish again.
- If publish still fails, capture the error message and affected campaign details for escalation.

## Next Steps

- Ask for the exact error message and screenshot.
- Validate Default Playlist first, then campaign schedule, then publish again.
- Confirm device sync after successful publish.

## Client Response Template

> The publish error is usually caused by a missing Default Playlist requirement or content that is not
> fully scheduled/approved. We will verify the Default Playlist, content format, approval status, and
> playlist mapping, then republish once the missing requirement is corrected.
