---
playbook: true
id: "black-screen"
title: "Black Screen or LMX Logo Showing"
triggers: [black screen, blank screen, empty display, no display, screen blank, logo issue, lmx logo]
summary: "A black screen or LMX logo usually points to missing playable content, publish/sync failure, unsupported media, storage issues, or device/display connectivity problems."
what_to_check:
  - "Confirm the device is online in Dashboard or Device Manager."
  - "Check that the playlist has active scheduled content for the current date and time."
  - "Confirm content is approved and published successfully."
  - "Check media format, codec, file size, and resolution compatibility."
  - "Check if Default Playlist has valid scheduled fallback content."
  - "Check device storage, internet stability, HDMI/display source, and screen power."
  - "For HTML/VAST content, confirm WebView/browser support and internet access."
how_to_fix:
  - "Publish a simple test image or MP4 to confirm the player can display content."
  - "Republish the intended campaign after validating schedule and playlist mapping."
  - "Replace unsupported or oversized files with optimized supported media."
  - "Restart the player app or reboot the device after network/storage correction."
  - "Add valid fallback content to Default Playlist if scheduled content fails."
  - "For VAST/HTML issues, update WebView/browser and verify URL/SSP response."
next_steps:
  - "Collect device name, OS, content type, schedule time, and a screen photo."
  - "Confirm whether the issue affects one device, one location, or all devices."
  - "Escalate with player logs if a simple test campaign also fails."
client_response: "We are checking the device status, active schedule, publish status, and media compatibility. A black screen can happen when content is not published/synced, unsupported media is scheduled, or the player/display has a connectivity issue. We will validate with simple test content and confirm the next action based on the result."
---

# Black Screen or LMX Logo Showing

## Summary

A black screen or LMX logo usually points to missing playable content, publish/sync failure,
unsupported media, storage issues, or device/display connectivity problems.

## What to Check

1. Confirm the device is online in Dashboard or Device Manager.
2. Check that the playlist has active scheduled content for the current date and time.
3. Confirm content is approved and published successfully.
4. Check media format, codec, file size, and resolution compatibility.
5. Check if Default Playlist has valid scheduled fallback content.
6. Check device storage, internet stability, HDMI/display source, and screen power.
7. For HTML/VAST content, confirm WebView/browser support and internet access.

## How to Fix

- Publish a simple test image or MP4 to confirm the player can display content.
- Republish the intended campaign after validating schedule and playlist mapping.
- Replace unsupported or oversized files with optimized supported media.
- Restart the player app or reboot the device after network/storage correction.
- Add valid fallback content to Default Playlist if scheduled content fails.
- For VAST/HTML issues, update WebView/browser and verify URL/SSP response.

## Next Steps

- Collect device name, OS, content type, schedule time, and a screen photo.
- Confirm whether the issue affects one device, one location, or all devices.
- Escalate with player logs if a simple test campaign also fails.

## Client Response Template

> We are checking the device status, active schedule, publish status, and media compatibility.
> A black screen can happen when content is not published/synced, unsupported media is scheduled,
> or the player/display has a connectivity issue. We will validate with simple test content and
> confirm the next action based on the result.
