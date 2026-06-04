# Playlogs (General & Device Level)

Source document: `Playlogs+(General+&+Device+Level).doc`

# Playlogs (General & Device Level)
## Overview
The Playlog feature in MW Content records all media playback activity from your registered devices. These logs are critical for verifying ad delivery, conducting internal audits, and troubleshooting playback issues.
LMX Content offers two types of playlog views:
Type
Purpose
General Playlog
- Shows logs for all devices (bulk monitoring & reporting)
- Allows you to download up to 30 days of data only (including the current date).
Device Playlog
- Shows logs for a specific device (diagnostics & targeted reports)
- No days selection limitation, but only available up to the day before the current date.
## How to Access Playlogs
### General Playlog
- Navigate to: Playlog Tab
- Click Get New Log
You’ll see this Filter Playlog screen:
- Fill in the following details:
Field
Details
Date Range
Select from/to dates (required)
Device Filter
Choose All or Specific device(s)
Content Filter
Choose All or Specific content (optional)
Customize Headers
Optional: select which columns to include
File Type
Choose export format: CSV or PDF
Click Get Log
Download report instantly
### Device-Level Playlog
- Navigate to: Devices Manager Tab
- Select the specific device from the list
- Find the Playlog under Action Section
- Choose date range and filters
- Click Get Log to view or export device-specific playback data
## Fields in a Playlog Report
Field
Description
Device Name
The screen/player where the content was played
Playlist Name
The playlist associated with the content
Content Name
The media file name (e.g., Promo_June.mp4)
Play Start / End
Timestamps of content playback
Duration Played
How long the content was on screen
Brand / Schedule Type
Optional tags for content filtering
## Use Case Comparison
Feature
General Playlog
Device-Level Playlog
Scope
All registered devices
One specific device
Filters
Date, Device(s), Content
Date
Export Options
CSV, PDF
CSV, PDF
Use Case
Campaign reporting, client summary
Device troubleshooting, screen history
## Data Sync Logic
- Devices send playlog data at intervals based onPlaylog Interval setting (configured under Network)
- If a device is offline, logs are stored locally and synced when it reconnects
## Best Practices
- Use General Playlog to export weekly/monthly client reports
- Use Device Playlog to troubleshoot missing or failed playback
- Keep exported logs archived for audits
