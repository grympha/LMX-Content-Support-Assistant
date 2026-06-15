---
category: "Programmatic / VAST"
keywords: [programmatic, vast, url, ima, hivestack, dv360, ssp, dsp, "no-fill", impression, webview, html, "online zip", "offline zip"]
confluence_urls:
  - label: "Schedule URL & Google IMA (VAST)"
    url: "https://movingwallshub.atlassian.net/wiki/x/AQCXDw"
next_step: "After configuring Programmatic/VAST playback, verify playback, monitor SSP delivery, validate playlogs, and troubleshoot playback issues."
---

# Programmatic / VAST

## Overview

Programmatic DOOH (Digital Out-of-Home) allows advertisements to be delivered automatically through a real-time advertising ecosystem.

LMX Content CMS supports:

- Programmatic Campaign Delivery
- VAST Playback
- URL Widgets
- HTML Creatives
- SSP/DSP Integration

Programmatic playback enables automated ad delivery, dynamic campaign management, real-time inventory usage, and centralized ad serving.

## Programmatic Workflow

Programmatic playback generally follows this flow:

```text
DSP
-> SSP
-> CMS
-> Player
-> Device
-> Screen
```

Each layer must function correctly for successful playback.

## What is VAST?

```text
VAST = Video Ad Serving Template
```

VAST is an advertising standard used to deliver video advertisements, interactive creatives, and dynamic media playback. VAST content is commonly served from SSP platforms, ad servers, or DSP integrations.

## Supported Programmatic Formats

LMX Content supports:

- VAST
- URL
- HTML
- Online ZIP
- Offline ZIP

Supported platforms:

| Platform | Compatibility |
| --- | --- |
| Windows 10 & 11 | Fully Supported |
| Android 11+ | Fully Supported with WebView v100+ |

## Programmatic-Compatible Operating Systems

### Windows

Recommended:

```text
Windows 10 / Windows 11
```

Supported formats:

- VAST
- URL
- HTML
- Offline ZIP
- Online ZIP

### Android

Recommended:

```text
Android 11+
WebView Version 100+
```

Supported formats:

- VAST
- URL
- HTML Online Content

Important: outdated WebView versions may cause black screen, failed rendering, or unsupported HTML playback.

## Requirements for Stable Programmatic Playback

Recommended:

- stable internet connection
- Android 11+ or Windows 11
- updated WebView/browser engine
- sufficient RAM and storage
- optimized creative size

Recommended Android specification:

```text
4GB RAM minimum
64GB Storage minimum
```

Recommended for advanced playback:

```text
8GB RAM / 128GB Storage
```

## Accessing Programmatic Scheduling

Navigate to:

```text
Dashboard -> Schedule Content
```

or

```text
Dashboard -> Main Storage
```

depending on deployment workflow.

## Scheduling VAST / URL / HTML Content

### Step 1 - Upload or Configure Content

Supported:

- VAST URL
- Website URL
- HTML ZIP package

Purpose: defines the programmatic creative source.

### Step 2 - Assign Playlist

Assign the content into the selected playlist.

Purpose: controls playback grouping and scheduling.

### Step 3 - Schedule Content

Configure:

- playback date
- playback time
- location
- device mapping

Purpose: defines when and where the programmatic content will play.

### Step 4 - Publish Content

After approval, click Publish.

Important: publishing is required before devices receive updates.

## Common Programmatic Issues

### 1. Default Playlist Showing Instead of VAST

Possible causes:

- SSP no-fill
- impression cap reached
- ad request failed
- internet instability
- hard stop enabled

Fix:

- check SSP response
- check internet connectivity
- check impression availability
- check fallback configuration

### 2. Black Screen During VAST Playback

Possible causes:

- unsupported creative
- outdated WebView
- weak hardware
- failed rendering

Fix:

- verify Android version
- verify WebView version
- verify creative compatibility
- verify hardware specification

### 3. URL Widget Not Loading

Possible causes:

- internet restriction
- firewall blocking
- unsupported browser engine
- website incompatibility

Fix:

- verify internet connectivity
- whitelist URLs if necessary
- update WebView/browser

### 4. HTML ZIP Not Rendering

Possible causes:

- unsupported scripts
- oversized HTML package
- low RAM device
- rendering engine limitation

Fix:

- optimize HTML package
- reduce animation complexity
- verify compatibility

### 5. Impression Not Recorded

Possible causes:

- playback interruption
- SSP delivery issue
- player synchronization issue
- internet instability

Fix:

- check playlogs
- check SSP logs
- check device synchronization
- check internet connectivity

## Programmatic Troubleshooting Flow

Recommended troubleshooting sequence:

```text
DSP
-> SSP
-> CMS
-> Player
-> Device
-> Screen
```

Validate:

- ad request delivery
- SSP response
- content synchronization
- playback rendering
- screen output

## Common Programmatic Checks

### CMS Checks

Verify:

- schedule active
- playlist mapped
- content published
- fallback playlist configured

### Device Checks

Verify:

- device online
- sufficient storage
- updated WebView
- player application running

### Network Checks

Verify:

- stable internet
- firewall restrictions
- DNS accessibility
- bandwidth availability

### Creative Checks

Verify:

- supported format
- valid VAST response
- compatible HTML package
- optimized media size

## Best Practices

### Use Modern Operating Systems

Recommended:

```text
Windows 11
Android 11+
```

Purpose: improves HTML rendering, VAST compatibility, and playback stability.

### Keep WebView Updated

Important for Android:

```text
WebView Version 100+
```

### Configure Default Playlist

Purpose: provides fallback playback during no-fill, failed ad requests, or connectivity interruption.

### Use Optimized Creatives

Recommended:

- compressed MP4
- optimized HTML
- lightweight animations

Purpose: improves playback stability and synchronization performance.

## Important Notes

- Programmatic playback depends heavily on internet stability.
- VAST and HTML creatives require updated browser engines.
- Unsupported devices may fail advanced rendering.
- Default Playlist is strongly recommended as fallback.
- Low-spec Android devices may struggle with heavy HTML or VAST playback.

## Troubleshooting Checklist

If users report "Programmatic content not playing", check:

- SSP response
- device online status
- WebView version
- internet stability
- content publish status
- fallback playlist behavior
- creative compatibility

## Best Practice Workflow

Recommended workflow:

```text
Configure Programmatic Content
-> Assign Playlist
-> Schedule Campaign
-> Publish Content
-> Verify Device Synchronization
-> Validate Playback
-> Monitor Playlogs
```

## Next Step

After configuring Programmatic/VAST playback:

1. Verify Playback
2. Monitor SSP Delivery
3. Validate Playlogs
4. Troubleshoot Playback Issues
