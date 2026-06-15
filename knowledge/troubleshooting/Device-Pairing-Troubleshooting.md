---
category: "Device Pairing"
keywords:
  - pairing failed
  - verification code not working
  - verification code expired
  - code already used
  - device not appearing cms
  - device registration failed
  - cannot pair device
  - pairing error
  - invalid verification code
  - device not showing after pairing
  - re-pair device
  - login with verification code failed
  - pairing troubleshooting
description: "Troubleshooting guide for device pairing failures — covers expired codes, already-used codes, device not appearing in CMS after pairing, and pairing succeeds but device stays offline."
search_priority: "high"
related_topics:
  - "Device Pairing"
  - "Create Device"
  - "Installation of LMX Content App"
  - "Basic Troubleshooting"
---

# Device Pairing Troubleshooting

## Quick Answer

If a verification code is not working, it has most likely already been used or the device was previously paired. Generate a new code from CMS Device Manager, uninstall and reinstall the LMX Content application, then enter the new code before pairing again.

## Symptoms

- Verification code is rejected or shows an error in the player app
- The "Login with Verification Code" screen is not visible — device is already paired
- Device does not appear in CMS after entering the code
- Device appears in CMS but stays offline immediately after pairing
- Pairing completes but content does not synchronize
- Code accepted but device shows wrong name or wrong location in CMS

## Common Causes

### Code Issues

| Cause | Explanation |
|---|---|
| Code already used | Each code is one-time use only. Once a device is paired, that code is consumed. |
| Code expired | Codes are time-limited. Generate a fresh code immediately before pairing. |
| Code mistyped | Characters such as 0/O and 1/I are easy to confuse. Enter manually if copy-paste fails. |
| Code from wrong tenant | Code was generated in a different CMS tenant or organization account. |

### Network Issues

- Device has no internet access during the pairing attempt
- Firewall or proxy is blocking outbound communication to CMS
- DNS is not resolving the CMS domain

### Player App Issues

- App was previously paired — the pairing screen no longer appears
- Outdated player version does not support the current pairing flow
- Required app permissions were not granted during installation

### CMS Configuration Issues

- Device was assigned to the wrong Location during creation
- Device Status is set to Disabled in CMS

## Troubleshooting Steps

### Step 1 — Generate a New Verification Code

1. In CMS, go to **Device Manager**.
2. Locate the device record for this device.
3. Check whether the device already shows as Paired or Online — if so, the previous code was consumed.
4. Edit the device and generate a new verification code.
5. Note: generating a new code invalidates any previous code and unlinks any currently paired player.

### Step 2 — Confirm Internet Access on the Device

1. Open a browser on the device and navigate to a known website.
2. If the site does not load, the device has no internet — resolve connectivity before retrying pairing.
3. Both Wi-Fi and Ethernet are supported. Confirm the correct network interface is active.
4. If firewall or proxy restrictions are suspected, see [[Firewall-And-Network-Requirements]].

### Step 3 — Confirm the Pairing Screen Is Visible

1. Launch the LMX Content player application.
2. If the pairing screen (Login with Verification Code) is not visible, the device is already registered to a previous pairing.
3. Uninstall the LMX Content application completely.
4. Reinstall the application.
5. Launch the app — the pairing screen should now appear on first launch.

### Step 4 — Enter the Code

1. Use only the newly generated code from Step 1.
2. Enter the code carefully — it is case-sensitive.
3. If copy-paste is available, use it to avoid transcription errors; otherwise type manually.
4. Submit and wait 30–60 seconds for the pairing confirmation.

### Step 5 — Confirm CMS Device Configuration

1. Verify the device **Status** is set to **Enabled**.
2. Verify the device is assigned to the correct **Network** and **Location**.
3. After successful pairing, allow 1–2 minutes for the device to appear Online in CMS.

### Step 6 — Paired But Device Stays Offline

If pairing reports success but the device does not come online:

1. Confirm internet connectivity is stable on the device.
2. Check whether a firewall or proxy is blocking the CMS heartbeat connection — see [[Firewall-And-Network-Requirements]].
3. Restart the LMX Content player application — see [[Restarting-The-Player-Application]].
4. Wait one full heartbeat cycle (approximately 1–2 minutes) and recheck CMS Device Manager.

## Escalation Criteria

Escalate to the next support tier when:

- A fresh code was generated, the app was reinstalled, and pairing still fails
- Multiple devices at the same site are failing to pair — indicates a shared network or firewall issue
- Device appears in CMS after pairing but never comes online despite confirmed internet access
- The player app displays an unexpected error message during pairing — capture the exact message and screenshot

**Information to collect before escalating:**
- Device name as entered in CMS
- Whether the code was freshly generated (do not share the actual code value)
- Device type: Android or Windows
- Android version / Windows version
- LMX Content player app version
- Error message and screenshot if available
- Network type: Wi-Fi / Ethernet / Mobile data

## Related Notes

[[Device Pairing]]
[[Change-Device-Orientation]]
[[Device Replacement]]
[[Firewall-And-Network-Requirements]]
[[Restarting-The-Player-Application]]
[[Installation of LMX Content App]]
[[imported-heartbeat-mechanism-in-lmx-content-cms]]
[[imported-android-apk-troubleshooting-steps-for-lmx-content]]
[[imported-device-mapping-issue-how-to-remap-device-to-correct-network-and-location]]
