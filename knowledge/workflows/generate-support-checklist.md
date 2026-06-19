---
id: "wf-008"
slug: "generate-support-checklist"
label: "Generate Support Checklist"
icon: "🎫"
shortcut_prefill: "What information should I collect before escalating a support ticket?"
category: "Support Escalation"
difficulty: "beginner"
estimated_minutes: 5
phases: 1
related_topics: ["Basic Troubleshooting", "Device Pairing", "Publish Content"]
tags: ["support", "escalation", "ticket", "checklist", "debugging", "logs", "device-info", "pairing", "html", "crash"]
analytics_label: "Generate Support Checklist"
source_file: "knowledge/raw/workflows/What information should I collect before escalating a support ticket.txt"
---

# Generate Support Checklist

Collect all required information before escalating a support ticket to Moving Walls or your platform administrator.

## Overview

Escalating without complete information leads to back-and-forth delays. This checklist ensures you have everything the support team needs to investigate immediately.

---

## Category 1 — Device Pairing Issues

Collect before escalating pairing failures:

- [ ] **Device name** as entered in CMS (exact spelling)
- [ ] Confirmation that a **fresh pairing code was generated** (do not share the code itself)
- [ ] **Device type**: Android / Windows / LG webOS / BrightSign / Linux
- [ ] **OS version**: Android version number / Windows version / webOS version
- [ ] **LMX Content player app version** (Settings → Apps → LMX Content → Version)
- [ ] **Error message** displayed during pairing (screenshot preferred)
- [ ] **Network type**: Wi-Fi / Ethernet / Mobile data

---

## Category 2 — HTML / ZIP Content Rendering Issues

Collect before escalating content that fails to render:

- [ ] **Device type and OS version**
- [ ] **Android System WebView version** (Settings → Apps → Android System WebView → Version)
- [ ] **ZIP file structure** — screenshot of the extracted root folder contents
- [ ] Whether the content renders in the **device's native browser** (open the HTML in Chrome)
- [ ] Whether the issue affects **all HTML/ZIP content** or only specific packages
- [ ] Whether the issue is **isolated to one device** or affects multiple devices at the same site

---

## Category 3 — App Launch / Crash Issues

Collect before escalating app crashes or launch failures:

- [ ] **Device type and OS version**
- [ ] **LMX Content player app version**
- [ ] Whether the issue **persists after a full device reboot**
- [ ] Whether **multiple devices are affected** at the same time
- [ ] Whether **content continues playing on screen** despite CMS showing the device as Offline

---

## Category 4 — Content Not Playing / Black Screen

Collect before escalating playback issues:

- [ ] **Device name and ID** from CMS
- [ ] **Device online/offline status** at time of issue
- [ ] **Schedule details**: start/end date, start/end time, Network, Location, Playlist
- [ ] **Publish status**: confirmed published (not just approved)
- [ ] **Content format and file size**
- [ ] **Playlog availability**: any entries in the device playlog for the affected time period
- [ ] Whether the issue is **persistent or intermittent**

---

## Category 5 — Programmatic / VAST Issues

Collect before escalating VAST or programmatic ad failures:

- [ ] **Android System WebView version**
- [ ] **Test VAST tag URL** (sanitise any API keys before sharing)
- [ ] **SSP/DSP name** and whether the device is registered in the inventory
- [ ] **Fill rate**: zero fill, low fill, or occasional fill
- [ ] **Error message or log** from the CMS or device (if available)
- [ ] Whether the VAST tag loads in the **device browser** directly

---

## General Information — Always Include

Regardless of issue type, always include:

- [ ] **Tenant / account name** (your LMX Content organisation name)
- [ ] **CMS environment**: Production / Staging / UAT
- [ ] **Date and time** the issue first occurred (with timezone)
- [ ] **Steps to reproduce** (what you did, what you expected, what happened)
- [ ] **Screenshot or screen recording** if the issue is visible
- [ ] **Any recent changes** made before the issue (new content uploaded, firmware update, network change)

---

## Quick Category Selector

| Issue Type | Collect Category |
| --- | --- |
| Device won't pair | Category 1 |
| HTML/ZIP not showing | Category 2 |
| App crashes or won't open | Category 3 |
| Black screen / content not playing | Category 4 |
| VAST / programmatic not filling | Category 5 |
| Unsure | Use General Information + describe symptoms |

---

## Related Topics

- [Basic Troubleshooting](../topics/basic-troubleshooting.md)
- [Troubleshoot Offline Device](./troubleshoot-offline-device.md)
- [Programmatic Readiness Check](./programmatic-readiness-check.md)

## Next Step

Once you have collected all applicable items, escalate via the Moving Walls support portal or designated Slack/Teams channel with the checklist attached.
