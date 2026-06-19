---
id: "wf-006"
slug: "programmatic-readiness-check"
label: "Programmatic Readiness Check"
icon: "📡"
shortcut_prefill: "Validate if this device is ready for VAST and Programmatic campaigns."
category: "Programmatic / VAST"
difficulty: "intermediate"
estimated_minutes: 15
phases: 4
related_topics: ["Programmatic VAST", "Basic Troubleshooting", "Device Requirements"]
tags: ["vast", "programmatic", "webview", "ssp", "dsp", "inventory", "android", "html5", "ad-tech"]
analytics_label: "Programmatic Readiness Check"
source_file: "knowledge/raw/workflows/Validate if this device is ready fo.txt"
---

# Programmatic Readiness Check

Validate that a device meets all hardware, software, and inventory requirements for VAST and Programmatic advertising campaigns.

## Overview

For a device to successfully serve programmatic ads, four areas must pass:

1. Hardware and OS requirements
2. Android System WebView version
3. VAST delivery test
4. Inventory mapping validation

---

## Phase 1 — Hardware and OS Requirements

| Requirement | Minimum | Notes |
| --- | --- | --- |
| Android OS | Android 11 | WebView 120+ is the primary dependency |
| RAM | 4 GB | 8 GB recommended for HTML5/VAST rendering |
| Storage | 32 GB free | Sufficient for ad creative cache |
| Network | Stable internet | Firewall must allow VAST tag URLs and SSP endpoints |

Confirm:

1. Go to **Settings → About Device** → check Android version.
2. Go to **Settings → About Device / RAM** → confirm at least 4 GB.
3. Go to **Settings → Storage** → confirm sufficient free space.

---

## Phase 2 — Android System WebView Check

WebView is the rendering engine for HTML5 creatives and VAST tags. Version 120 or higher is required.

**Check WebView version:**

1. Go to **Settings → Apps → Android System WebView**.
2. Check the version number displayed.

**If WebView is below 120:**

1. Open **Google Play Store**.
2. Search for **Android System WebView**.
3. Tap **Update**.
4. After update, reopen the LMX Content app to ensure it picks up the new WebView.

> ⚠️ Some managed Android devices restrict Play Store access. In that case, side-load the updated WebView APK or contact the device administrator.

---

## Phase 3 — VAST Delivery Test

1. Obtain a test VAST tag URL from your SSP or use a known working test tag.
2. Load the tag in the LMX Content CMS schedule as a test.
3. Publish to the device and observe:
   - **Ad loads and plays** → VAST delivery is functional
   - **Ad fails to load or crashes** → Likely WebView or network issue
   - **No fill / empty response** → SSP is not returning an ad (inventory or targeting issue, not device issue)

**If VAST fails to render:**

- Re-check WebView version (Phase 2).
- Confirm the device has unblocked outbound internet access to the VAST tag URL.
- Test the tag URL directly in the device browser — if it times out, the firewall is blocking it.

---

## Phase 4 — Inventory Mapping Validation

For programmatic campaigns, the device must be mapped correctly in your SSP/DSP:

1. In LMX Content CMS, confirm the device's **inventory name** is set (Device Manager → Edit → Inventory Name).
2. In your SSP or DSP portal, confirm the same inventory name is registered and active.
3. Run a test bid request and verify the impression event fires.

**Common inventory mapping issues:**

| Issue | Symptom | Fix |
| --- | --- | --- |
| Inventory name mismatch | Empty ad slots, no fill | Align CMS inventory name with SSP configuration |
| Device not activated in SSP | No bid requests received | Activate/register the inventory unit in your SSP |
| Incorrect geo/category targeting | Low fill rate | Update targeting parameters in SSP |

---

## Full Readiness Checklist

- [ ] Android 11 or higher
- [ ] 4 GB RAM minimum
- [ ] Android System WebView version 120 or higher
- [ ] Stable internet (no firewall blocking VAST tag URLs)
- [ ] VAST test tag renders successfully on device
- [ ] Inventory name in CMS matches SSP configuration
- [ ] Device is active and online in CMS
- [ ] Fallback/Default Playlist configured (for no-fill events)

---

## Troubleshooting

| Problem | Likely Cause | Fix |
| --- | --- | --- |
| VAST ad not rendering | WebView below 120 | Update WebView via Play Store |
| VAST URL times out | Firewall blocking SSP/CDN URLs | Whitelist required domains |
| No-fill on every request | Inventory not mapped in SSP | Register device inventory in SSP portal |
| Ad crashes the player | Unsupported creative format | Test with a standard MP4 VAST tag first |
| Inconsistent fill rate | Low bid competition | Adjust floor pricing and targeting in SSP |
| VAST plays but no playlog | Pull To Content (PTC) not configured | Enable PTC for programmatic playlog tracking |

---

## Related Topics

- [Programmatic VAST](../topics/programmatic-vast.md)
- [Device Requirements](../topics/device-requirements.md)
- [Check Device Compatibility](./check-device-compatibility.md)
- [Pull To Content](../topics/pull-to-content.md)
- [Basic Troubleshooting](../topics/basic-troubleshooting.md)

## Next Step

Once all phases pass, enable the device in your SSP/DSP and schedule your first live programmatic campaign. Monitor the first 24 hours for fill rate and playback confirmation.
