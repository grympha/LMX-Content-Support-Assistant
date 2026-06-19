---
id: "wf-003"
slug: "troubleshoot-offline-device"
label: "Troubleshoot Offline Device"
icon: "🔧"
shortcut_prefill: "My device is offline. Guide me through troubleshooting."
category: "Troubleshooting"
difficulty: "intermediate"
estimated_minutes: 20
phases: 5
related_topics: ["Basic Troubleshooting", "Device Pairing", "Create Device"]
tags: ["offline", "troubleshoot", "device", "network", "heartbeat", "cms", "connectivity", "firewall"]
analytics_label: "Troubleshoot Offline Device"
source_file: null
authored: true
---

# Troubleshoot Offline Device

Structured diagnostic guide for resolving a device that is showing as Offline in LMX Content CMS.

## Overview

A device shows as **Offline** when the CMS stops receiving heartbeat signals from the player app. This can be caused by network issues, player crashes, device power states, or firewall restrictions.

> Note: A device showing **Offline** in CMS does not always mean content has stopped playing. Content may continue playing from local cache even when the device loses its CMS connection.

## Diagnostic Flow

```
CMS Status → Network → Device Power → Player App → Firewall/DNS → Escalate
```

---

## Phase 1 — Confirm the Issue

Before troubleshooting, clarify the exact state:

1. Check **Device Manager** in CMS — confirm the device shows as **Offline**.
2. Check the **Last Seen** timestamp — how long has it been offline?
3. Check whether **content is still playing on the physical screen**.
   - Content playing + CMS offline = heartbeat/network issue only
   - Content not playing + CMS offline = player app may have crashed

---

## Phase 2 — Network Diagnostics

1. On the physical device, verify internet connectivity:
   - Open a browser and load any external URL to confirm internet access.
   - Test both Wi-Fi and Ethernet if available.
2. Check network stability — a weak or intermittent signal will cause repeated offline/online cycling.
3. Verify the device can reach the CMS endpoint:
   - Try accessing the CMS URL from the device browser.
   - If blocked, a firewall or DNS rule may be preventing outbound connections.
4. Check for any network changes (new firewall policies, VLAN changes, proxy configuration) made recently.

---

## Phase 3 — Device Power and State Checks

1. Confirm the device is powered on and not in sleep/standby mode.
   - Android: check for power-saving modes that may terminate background apps.
   - Windows: check sleep and hibernation settings.
2. Check the device is not in a **reboot loop** — repeated power cycling prevents a stable CMS connection.
3. Verify the power adapter is functional and the device is receiving stable power.

---

## Phase 4 — Player App Diagnostics

1. Check whether the LMX Content player app is running on the device.
2. If the app has crashed or stopped:
   - Relaunch the app manually.
   - If it crashes again on launch, proceed with a full reinstall.
3. Restart the player application (not the device):
   - Force-stop the app via Settings → Apps → LMX Content → Force Stop.
   - Reopen the app.
4. If restart does not resolve the issue, **reboot the entire device**.
5. After reboot, confirm the device returns to **Online** status in Device Manager within 2–3 minutes.

---

## Phase 5 — CMS and Pairing Checks

1. In **Device Manager**, check the device record itself:
   - Confirm the device is not disabled (Status = Active).
   - Confirm no admin-side changes were made (location or network reassignment can temporarily disconnect the device).
2. If the device was previously online but recently moved to a new network or location, re-verify its CMS assignment matches the new configuration.
3. If none of the above resolves the issue, generate a **new verification code** and re-pair the device:
   - Edit the device → Generate New Code
   - Reinstall the LMX Content app on the device
   - Enter the new code to re-establish the connection

---

## Quick Reference Checklist

| Check | Expected Result |
| --- | --- |
| Device powered on | Yes |
| Internet accessible on device | Yes |
| CMS URL reachable from device | Yes |
| No firewall blocking outbound traffic | Confirmed |
| Player app running | Yes |
| Device not in sleep/standby mode | Confirmed |
| Device record enabled in CMS | Yes — Status = Active |
| Last seen timestamp (CMS) | Within last 5 minutes when online |

---

## Common Causes and Fixes

| Cause | Fix |
| --- | --- |
| Unstable internet | Switch to Ethernet; check router/switch stability |
| Firewall blocking CMS communication | Whitelist CMS domain and ports with network administrator |
| Player app crashed | Force-stop and relaunch app; reboot device if needed |
| Device in sleep mode | Disable sleep/standby mode; configure auto-start |
| Heartbeat timeout (temporary) | Wait 3–5 minutes; device may self-recover |
| DNS resolution failure | Check DNS settings on device; try using 8.8.8.8 |
| Device shows offline but content is playing | Heartbeat issue only — restart app to restore CMS sync |
| Recent firmware or OS update | Check app compatibility with new OS version; update or reinstall |

---

## When to Escalate

Escalate to level-2 support if:

- Device goes offline repeatedly after reboot (within minutes)
- Multiple devices at the same site go offline simultaneously
- Firewall and network checks pass but device stays offline
- Device is unreachable remotely (no ADB, no remote access)
- Content stops playing AND device is offline

Before escalating, collect:
- Device name and ID from CMS
- Device type and OS version
- LMX Content player app version
- Last seen timestamp from CMS
- Whether the issue affects one device or multiple
- Any recent network or infrastructure changes

---

## Related Topics

- [Basic Troubleshooting](../topics/basic-troubleshooting.md)
- [Device Pairing](../topics/device-pairing.md)
- [Generate Support Checklist](./generate-support-checklist.md)
- [Devices Showing Offline But Playing Content](../topics/imported-devices-showing-as-offline-but-playing-content-troubleshooting-guide.md)
- [Fluctuating Online/Offline Device Status](../topics/imported-troubleshooting-guide-fluctuating-online-offline-device-status-in-dashboard.md)

## Next Step

After resolving the offline status, verify content is playing correctly and monitor the device for 30 minutes to confirm stable heartbeat behaviour.
