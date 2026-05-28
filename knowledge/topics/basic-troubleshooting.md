# Basic Troubleshooting

## Overview

Basic Troubleshooting in LMX Content CMS helps identify and isolate common playback, synchronization, and device-related issues.

Troubleshooting should always follow a structured approach to determine whether the issue originates from:

- CMS configuration
- device/player
- internet/network
- content file
- scheduling
- storage
- screen/display
- programmatic delivery

The objective is to isolate the issue quickly, minimize downtime, restore playback stability, and identify the correct next action.

## Basic Troubleshooting Flow

Recommended troubleshooting sequence:

```text
CMS
-> Device
-> Network
-> Content
-> Schedule
-> Playback
-> Screen
```

Always validate:

- what is happening
- when the issue started
- which device is affected
- whether issue is intermittent or persistent

## Common Troubleshooting Categories

| Issue Type | Common Symptoms |
| --- | --- |
| Black Screen | Empty display, no playback |
| Device Offline | Device disconnected from CMS |
| Content Not Playing | Playlist visible but playback missing |
| Wrong Content Showing | Incorrect playlist or fallback content |
| Old Content Still Showing | Devices not updated |
| Missing Playlogs | Playback records unavailable |
| Sync Failure | Content not downloading |
| Programmatic Failure | VAST/HTML/URL content not rendering |

## Black Screen Troubleshooting

Possible causes:

- player application stopped
- unsupported hardware
- storage full
- player crash
- playlist empty
- content not published
- invalid schedule
- wrong playlist mapping
- unsupported format
- corrupted file
- unsupported codec
- oversized media
- HDMI disconnected
- screen powered off
- wrong source input
- internet interruption
- firewall blocking
- unstable connectivity

Checks:

1. Go to Dashboard -> Device Manager.
2. Verify Device Status = Online.
3. Verify playlist assignment and active schedule.
4. Confirm campaign is not expired.
5. Confirm publish is completed.
6. Verify content compatibility: MP4, PNG, JPEG, HTML5 ZIP, MP3, PDF.
7. Check content is not corrupted and media size is optimized.
8. Check available device storage.
9. Check HDMI, screen power, and display source.

## Device Offline Troubleshooting

Possible causes:

- unstable internet
- firewall restriction
- player crash
- device powered off
- heartbeat interruption

Checks:

1. Verify WiFi or Ethernet connection.
2. Verify internet stability.
3. Verify DNS accessibility.
4. Restart the player application.
5. Check firewall restrictions.
6. Check power adapter, sleep mode, and reboot loop.

## Content Not Playing

Possible causes:

- playlist empty
- content not published
- unsupported media
- synchronization failure
- schedule expired

Checks:

- playlist contains content
- content approved
- content published
- device synchronized
- schedule active

## Wrong Content Showing

Possible causes:

- wrong playlist assignment
- fallback/default playlist triggered
- expired campaign
- hard stop enabled
- schedule overlap

Checks:

- active schedule
- playlist mapping
- publish status
- default playlist behavior

## Old Content Still Showing

Possible causes:

- synchronization failure
- device offline
- publish incomplete
- cached content active

Checks:

- synchronization status
- internet connectivity
- publish completed
- storage availability

## Missing Playlogs

Possible causes:

- player application stopped
- playback not triggered
- synchronization delay
- device offline

Checks:

- device online
- content actually played
- playlog synchronization
- playback timing

Important:

```text
General Playlog = 30 days limit
Device Playlog = Available up to previous day only
```

## Programmatic/VAST Troubleshooting

Possible causes:

- SSP no-fill
- outdated WebView
- unsupported HTML
- internet instability
- VAST response failure

Checks:

- SSP response
- internet stability
- WebView version
- creative compatibility
- fallback playlist behavior

## Recommended Troubleshooting Workflow

### Step 1 - Define the Issue

Clarify:

- what happened
- when issue started
- affected device/location
- intermittent or permanent

### Step 2 - Isolate the Layer

Determine whether issue relates to:

- CMS
- device
- network
- content
- schedule
- display
- programmatic chain

### Step 3 - Validate Evidence

Never assume root cause. Always verify logs, playback, synchronization, and device status.

### Step 4 - Apply Corrective Action

Examples:

- republish content
- restart player
- optimize content
- clear storage
- update WebView
- reboot device

## Common Quick Fixes

| Issue | Recommended Action |
| --- | --- |
| Black Screen | Verify playlist, publish, HDMI, content |
| Device Offline | Check internet and restart player |
| Wrong Content | Verify schedule and playlist |
| Old Content | Republish and sync device |
| Missing Playlog | Verify playback and synchronization |
| Programmatic Failure | Verify SSP response and WebView |

## Best Practices

- Keep devices updated with latest player version, latest WebView, and latest supported OS.
- Use supported content formats such as MP4, PNG, and JPEG.
- Avoid unsupported codecs and oversized files.
- Monitor device status regularly.
- Use optimized hardware: Android 11+, 4GB RAM minimum, 64GB storage minimum.

## Important Notes

- Most playback issues originate from synchronization or scheduling errors.
- Default Playlist may appear when active campaigns fail.
- Unsupported media may trigger black screen.
- Low-spec Android devices may struggle with HTML/VAST playback.
- Stable internet is critical for synchronization and programmatic campaigns.

## Troubleshooting Checklist

If users report "Content not playing", check:

- device online status
- schedule validity
- playlist assignment
- publish status
- synchronization
- content compatibility
- storage availability
- screen connection

## Best Practice Workflow

Recommended workflow:

```text
Identify Issue
-> Verify Device Status
-> Verify Schedule
-> Verify Playlist
-> Verify Publish Status
-> Verify Synchronization
-> Validate Playback
-> Review Playlogs
```

## Next Step

After troubleshooting:

1. Verify Playback Recovery
2. Monitor Device Stability
3. Validate Playlogs
4. Escalate Backend Issues if Required
