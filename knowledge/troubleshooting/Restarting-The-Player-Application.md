---
category: "Basic Troubleshooting"
keywords:
  - restart player
  - restart app
  - restart lmx content
  - force stop app
  - how to restart player
  - player restart steps
  - reboot device cms
  - clear cache restart
  - player not responding restart
  - force close and restart
  - lmx content not responding
  - player frozen
  - how to reboot player
  - force stop lmx content
  - restart mw content
description: "Step-by-step guide for restarting the LMX Content player application on Android and Windows devices — covers soft restart, force stop, and full device reboot."
search_priority: "high"
related_topics:
  - "Basic Troubleshooting"
  - "Installation of LMX Content App"
  - "Supported Operating Systems & Hardware"
---

# Restarting The Player Application

## Quick Answer

Restarting the LMX Content player application resolves most issues related to device offline status, content not updating, black screen, and app crashes. On Android, use Force Stop from Settings > Apps. On Windows, end the process via Task Manager. Always relaunch the app after stopping it — a restart does not affect pairing status, stored content, or schedule configuration.

## When to Restart the Player

Restart the player application as a first-line action when:

- Device shows as offline in CMS despite confirmed internet access
- Screen is black or blank but the device is online
- Content is not updating after a new campaign was published
- Player application is frozen or not responding to interaction
- Application force closed and did not relaunch automatically
- After any configuration change or network troubleshooting step

A player restart is always safe. It does not remove device pairing, delete downloaded content, or change the schedule configuration.

## Android — Soft Restart

The recommended first step. Closes the application and relaunches it without rebooting the device.

**Method A: Via App Info**

1. Press and hold the LMX Content app icon on the home screen.
2. Tap **App info** or the information icon (ⓘ).
3. Tap **Force Stop**.
4. Confirm when prompted.
5. Return to the home screen and tap the LMX Content icon to relaunch.
6. Wait 30–60 seconds for the app to reconnect to CMS.

**Method B: Via Device Settings**

1. Open **Settings** on the device.
2. Navigate to **Apps** (also shown as **Application Manager** on some devices).
3. Find and tap **LMX Content** (also listed as **MW Content** on some builds).
4. Tap **Force Stop** and confirm.
5. Return to the home screen and relaunch the app.

## Windows — Soft Restart

1. Right-click anywhere on the taskbar at the bottom of the screen.
2. Select **Task Manager**.
3. Locate **LMX Content** or **MW Content** in the list of running applications or processes.
4. Right-click it and select **End Task**.
5. Confirm the action.
6. Relaunch LMX Content from the **Start Menu**, desktop shortcut, or installed applications list.
7. Wait 30–60 seconds for reconnection to CMS.

**Alternative (Windows system tray):**

1. Look for the LMX Content icon in the system tray (bottom-right of the taskbar).
2. Right-click the icon.
3. Select **Exit** or **Close**.
4. Relaunch from the Start Menu.

## Full Device Reboot

Use a full reboot when a soft restart does not resolve the issue, when the device itself appears unresponsive, or when directed by a troubleshooting guide.

### Android Reboot

1. Press and hold the device power button for 3–5 seconds.
2. Select **Restart** from the power options menu.
3. Wait for the device to complete the full reboot cycle (typically 1–3 minutes).
4. If auto-start is configured, LMX Content will launch automatically.
5. If the app does not launch automatically, open it manually from the home screen.

### Windows Reboot

1. Open the **Start Menu**.
2. Click the **Power** icon.
3. Select **Restart**.
4. Wait for the restart to complete (typically 1–3 minutes).
5. LMX Content should launch automatically on startup if configured to do so.

## After Restarting

1. Wait **1–2 minutes** for the player to reconnect and complete an initial sync.
2. Check **Device Manager** in CMS — the device should return to Online status.
3. Verify playback on the physical screen.

If the device remains offline after a restart, the issue is likely network-related:
→ See [[Device Offline]] and [[Firewall-And-Network-Requirements]].

If content is still showing the old version after a restart:
→ See [[Content-Not-Updating]] for forced republish and sync steps.

If the app relaunches but crashes immediately:
→ See [[Application Force Close]] for storage, permission, and reinstall guidance.

## Escalation Criteria

Escalate when:

- The player app will not launch after force stop and relaunch attempts
- The device reboots successfully but the app does not appear or immediately crashes
- Restarting resolves the issue temporarily but the problem recurs within minutes — indicates an underlying instability
- Multiple devices are affected simultaneously at the same site — may indicate a network or backend issue

**Information to collect before escalating:**
- Device type: Android or Windows
- Android version / Windows version
- LMX Content player version
- Whether the issue persists after a full device reboot
- Whether multiple devices are affected simultaneously
- Whether content continues to play on screen even when CMS shows offline

## Related Notes

[[Device Offline]]
[[Black Screen]]
[[Application Force Close]]
[[Content-Not-Updating]]
[[Device-Pairing-Troubleshooting]]
[[Firewall-And-Network-Requirements]]
[[imported-auto-boot-shutdown-configuration-guide]]
