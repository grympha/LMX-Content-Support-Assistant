---
id: "wf-001"
slug: "create-new-device"
label: "Create New Device"
icon: "🖥️"
shortcut_prefill: "Guide me through creating and pairing a new device from start to finish."
category: "Device Setup"
difficulty: "beginner"
estimated_minutes: 15
phases: 4
related_topics: ["Create Device", "Device Pairing", "Installation of LMX Content App"]
tags: ["device", "pairing", "verification-code", "device-manager", "cms", "android", "apk"]
analytics_label: "Create New Device"
source_file: "knowledge/raw/workflows/Guide me through creating and pairi.txt"
---

# Create New Device

End-to-end guide for creating a CMS device record and pairing it to a physical screen.

## Overview

This workflow covers the full lifecycle of bringing a new screen online:

1. Creating the device record in LMX Content CMS
2. Generating a one-time verification code
3. Installing and pairing the player app on the physical device
4. Verifying the connection is live and content-ready

## Prerequisites

- LMX Content CMS access with Device Manager permissions
- Physical device (Android, Windows, or other supported OS) powered on and connected to the internet
- LMX Content player app available to install on the device (APK or app store)
- Stable internet on both the CMS machine and the physical device

---

## Phase 1 — Create the Device Record in CMS

1. Log into LMX Content CMS.
2. Go to **Device Manager** in the left sidebar.
3. Click **Create Device** (top-right corner or below the device list).
4. Fill in all required fields:
   - **Name** — Use a clear, unique label (e.g., `Lobby Screen 1`).
   - **Location** — Assign to the correct physical location.
   - **Orientation** — Set **Portrait** or **Landscape**. This cannot be changed after pairing without recreating the device.
   - **Player Type** — Select the correct OS (Android, Windows, BrightSign, etc.).
5. Save the device. It will appear in the list with status **Unpaired**.

---

## Phase 2 — Generate a Verification Code

1. In **Device Manager**, locate the newly created device.
2. Click **Edit** (pencil icon).
3. Scroll to the **Verification Code** section.
4. Click **Generate New Code**.
5. Copy the 6–8 character alphanumeric code.

> ⚠️ Generating a new code immediately invalidates any previous code and unlinks any currently paired player. Do not share the code before you are ready to pair.

---

## Phase 3 — Install the App and Pair the Device

1. On the physical device, ensure the LMX Content app is installed.
   - **New setup:** Install the app fresh from the APK or app store.
   - **Replacement / re-pair:** Uninstall the existing app first, then reinstall for a clean state.
   - **App update only:** Install over the existing version — do not uninstall.
2. Open the LMX Content app.
3. When the code entry screen appears, enter the verification code from Phase 2.
4. Tap **Pair** or **Login**.

> 🔁 If the code entry screen does not appear, the device is already paired to another record. Return to CMS, edit the device, and generate a new code to force unpair.

---

## Phase 4 — Verify and Activate in CMS

1. Refresh the **Device Manager** list.
2. The device should show **Paired**, then transition to **Online** within 1–2 minutes.
3. If the device stays offline after 2 minutes, check network connectivity on the physical device.
4. Once online, assign the device to a **Playlist** or **Campaign** to begin pushing content.

---

## Troubleshooting

| Problem | Solution |
| --- | --- |
| Verification code not accepted | Generate a new code in CMS and retry immediately |
| Device does not appear in CMS after pairing | Verify the app was freshly installed and the full code was entered correctly |
| Device shows as Paired but stays Offline | Check internet connection on device; ensure LMX app has unrestricted network access |
| Code entry screen not shown on device | Device is already paired — generate a new code in CMS to unpair the current player |
| Orientation is wrong after pairing | Recreate the device record with the correct orientation before pairing |

---

## Related Topics

- [Create Device](../topics/create-device.md)
- [Device Pairing](../topics/device-pairing.md)
- [Installation of LMX Content App](../topics/installation-of-lmx-content-app.md)
- [Basic Troubleshooting](../topics/basic-troubleshooting.md)

## Next Step

After pairing, schedule and publish content to the device:
`Upload Content → Create Playlist → Schedule Content → Approve → Publish`
