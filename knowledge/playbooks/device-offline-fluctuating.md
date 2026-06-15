---
playbook: true
id: "offline-device"
title: "Device Offline or Fluctuating Online/Offline"
triggers: [device offline, offline device, not online, disconnected, fluctuating, online offline, heartbeat]
summary: "Offline or fluctuating status is usually caused by unstable internet, heartbeat/socket interruption, player app crash, device power/sleep behavior, or firewall/network restrictions."
what_to_check:
  - "Check WiFi/Ethernet stability on the device network."
  - "Confirm the player app is running and not crashed or closed."
  - "Check power, sleep mode, reboot loop, and auto boot/shutdown settings."
  - "Check firewall/DNS restrictions that may block CMS or heartbeat communication."
  - "Compare CMS status with actual playback; the device may continue playing cached content while offline."
  - "Check if many devices are affected, which may indicate backend or network incident."
how_to_fix:
  - "Restart the player app and verify it reconnects to CMS."
  - "Reboot the device if the app does not reconnect."
  - "Stabilize internet or switch network connection if WiFi is weak."
  - "Disable sleep/power saving settings that interrupt player operation."
  - "Ask the IT/network team to allow required CMS connectivity if firewall is suspected."
  - "If backend issue is suspected, monitor CMS status and escalate with timestamp and affected devices."
next_steps:
  - "Collect device name, location, internet type, last online time, and whether content is still playing."
  - "Monitor the device for at least one heartbeat cycle after restart."
  - "Escalate if status keeps fluctuating across stable network conditions."
client_response: "The screen may continue playing cached content even when CMS shows offline. We are checking the player heartbeat, internet stability, and device power/app status. We will restart/reconnect the player and confirm whether the device status stabilizes in CMS."
---

# Device Offline or Fluctuating Online/Offline

## Summary

Offline or fluctuating status is usually caused by unstable internet, heartbeat/socket interruption,
player app crash, device power/sleep behavior, or firewall/network restrictions.

## What to Check

1. Check WiFi/Ethernet stability on the device network.
2. Confirm the player app is running and not crashed or closed.
3. Check power, sleep mode, reboot loop, and auto boot/shutdown settings.
4. Check firewall/DNS restrictions that may block CMS or heartbeat communication.
5. Compare CMS status with actual playback — the device may continue playing cached content while offline.
6. Check if many devices are affected, which may indicate a backend or network incident.

## How to Fix

- Restart the player app and verify it reconnects to CMS.
- Reboot the device if the app does not reconnect.
- Stabilize internet or switch network connection if WiFi is weak.
- Disable sleep/power saving settings that interrupt player operation.
- Ask the IT/network team to allow required CMS connectivity if firewall is suspected.
- If backend issue is suspected, monitor CMS status and escalate with timestamp and affected devices.

## Next Steps

- Collect device name, location, internet type, last online time, and whether content is still playing.
- Monitor the device for at least one heartbeat cycle after restart.
- Escalate if status keeps fluctuating across stable network conditions.

## Client Response Template

> The screen may continue playing cached content even when CMS shows offline. We are checking the
> player heartbeat, internet stability, and device power/app status. We will restart/reconnect the
> player and confirm whether the device status stabilizes in CMS.
