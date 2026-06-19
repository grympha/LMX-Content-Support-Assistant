---
id: "wf-004"
slug: "check-device-compatibility"
label: "Check Device Compatibility"
icon: "✅"
shortcut_prefill: "Check if my device meets LMX Content requirements."
category: "Device Requirements"
difficulty: "beginner"
estimated_minutes: 10
phases: 1
related_topics: ["Device Requirements", "Supported Operating Systems Hardware", "Installation of LMX Content App"]
tags: ["compatibility", "requirements", "android", "windows", "linux", "brightsign", "webos", "hardware", "specs"]
analytics_label: "Check Device Compatibility"
source_file: "knowledge/raw/workflows/Check if my device meets LMX Conten.txt"
---

# Check Device Compatibility

Verify whether your device meets LMX Content player requirements before installation.

## Overview

LMX Content supports five device platforms. Requirements vary by platform. Use the section for your device type to validate compatibility.

---

## Android

| Requirement | Minimum | Recommended |
| --- | --- | --- |
| Android OS | Android 11 | Android 13+ |
| RAM | 4 GB | 8 GB |
| Storage | 32 GB | 64 GB+ |
| Android System WebView | Version 120+ | Latest version |
| CPU | ARM Cortex-A55 quad-core | Octa-core |
| Network | Wi-Fi or Ethernet | Ethernet (stable) |

**How to verify Android specs:**

1. Go to **Settings → About Device** to check Android version.
2. Go to **Settings → Apps → Android System WebView** to check WebView version.
3. Go to **Settings → About Device → RAM** to check available memory.

> ⚠️ WebView version is the most common compatibility failure. Always update WebView before deploying VAST or HTML content.

---

## Windows

| Requirement | Minimum | Recommended |
| --- | --- | --- |
| Windows OS | Windows 10 (64-bit) | Windows 11 |
| RAM | 4 GB | 8 GB |
| Storage | 20 GB free | 50 GB free |
| CPU | x86_64 dual-core | Quad-core+ |
| GPU | Basic DirectX 11 | Dedicated GPU |
| Network | Wi-Fi or Ethernet | Ethernet |

**How to verify Windows specs:**

1. Press `Win + Pause/Break` → System → check OS version and RAM.
2. Run `dxdiag` from Run dialog → check DirectX version and GPU.
3. Open **This PC** to check available storage.

---

## Linux (Ubuntu)

| Requirement | Minimum |
| --- | --- |
| Ubuntu version | Ubuntu 20.04 LTS or 22.04 LTS |
| RAM | 2 GB |
| Storage | 20 GB free |
| CPU | x86_64 dual-core |
| Network | Ethernet recommended |

**How to verify Linux specs:**

```bash
uname -r              # kernel version
lsb_release -a        # Ubuntu version
free -h               # RAM available
df -h /               # Storage available
```

---

## BrightSign

| Requirement | Detail |
| --- | --- |
| Supported models | BrightSign XT, XD, HD series |
| Firmware | Latest stable BrightSign OS |
| Storage | Supported MicroSD or internal storage |
| Network | Ethernet (required for CMS communication) |

**How to verify:**

1. Check the BrightSign model number on the physical device label.
2. Log into BrightSign Device Web Interface to verify firmware version.
3. Compare against the Moving Walls recommended BrightSign device list.

---

## LG webOS

| Requirement | Detail |
| --- | --- |
| webOS version | webOS 4.0 or higher |
| Model type | LG Commercial Displays (not consumer TVs) |
| Storage | Sufficient for content files |
| Network | Ethernet preferred |

**How to verify:**

1. Press **Settings** on the LG remote → **General → About This TV** → check webOS version.
2. Confirm the model is a commercial display (not a residential/consumer LG TV).

---

## Compatibility Decision Matrix

| Platform | Min OS | Min RAM | WebView Required | Programmatic/VAST |
| --- | --- | --- | --- | --- |
| Android | 11 | 4 GB | Yes (v120+) | ✅ Supported |
| Windows | 10 | 4 GB | No | ✅ Supported |
| Linux | Ubuntu 20.04 | 2 GB | No | ✅ Supported |
| BrightSign | Latest firmware | N/A | No | ⚠️ Limited |
| LG webOS | 4.0+ | N/A | No | ⚠️ Limited |

---

## If Your Device Does Not Meet Requirements

- **RAM too low:** Content playback may stutter; HTML/VAST content may fail silently.
- **WebView outdated (Android):** Update via Play Store → search Android System WebView → Update.
- **OS too old:** Some LMX Content app features may be unavailable; consider hardware upgrade.
- **BrightSign/LG model not supported:** Contact Moving Walls support to verify model compatibility.

---

## Related Topics

- [Device Requirements](../topics/device-requirements.md)
- [Supported Operating Systems Hardware](../topics/supported-operating-systems-hardware.md)
- [Installation of LMX Content App](../topics/installation-of-lmx-content-app.md)
- [Programmatic Readiness Check](./programmatic-readiness-check.md)

## Next Step

Once the device meets requirements, proceed with app installation and device registration:
`Install App → Create Device in CMS → Generate Code → Pair`
