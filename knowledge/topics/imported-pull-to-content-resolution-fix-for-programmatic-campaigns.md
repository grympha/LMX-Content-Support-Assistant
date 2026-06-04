# Pull to Content Resolution Fix for Programmatic Campaigns

Source document: `Pull+to+Content+Resolution+Fix+for+Programmatic+Campaigns.doc`

# Pull to Content Resolution Fix for Programmatic Campaigns
## Overview
When using Pull to Content for programmatic campaigns in LMX, mismatched resolutions between the CMS player and SSP inventory can cause playback issues such as:
- Black screens
- Incorrect scaling
- Partial playback
- Blank intervals
- Programmatic creatives not rendering full screen
This article explains the resolution alignment requirement and how to prevent these issues.
## Root Cause
Programmatic delivery relies on the inventory resolution configured in SSP (LMX) to match the actual CMS player resolution.
If these values differ, the player may:
- Render content outside visible bounds
- Fail to scale correctly
- Trigger fallback or blank segments
## Resolution Alignment Requirement
### Rule
Inventory resolution in SSP must match the CMS player resolution exactly.
### Example
Configuration
Resolution
CMS Player Resolution
786 × 325
SSP Inventory Resolution
786 × 325 ✅
SSP Inventory Resolution
1920 × 1080 ❌ (Incorrect)
## Why Media Owner Resolution May Differ
Some screens use a sending card / LED controller between the player and display.
### Impact:
- The physical LED panel resolution may differ from the player output resolution.
- Media Owners often share the LED panel resolution instead of the player output resolution.
### Example
Component
Resolution
LED Panel
1536 × 640
Player Output (via sending card)
768 × 320 ✅
Correct SSP Inventory Resolution
768 × 320
## Common Symptoms of Resolution Mismatch
You may observe:
- Content plays but not full screen
- Black bars or blank areas
- Only partial video visible
- Creative plays for a few seconds then blanks
- Filler content triggers unexpectedly
- VAST playback issues
## How to Verify Correct Resolution
### Step 1 — Check CMS Player Resolution
From CMS or device settings:
- Windows display settings
- Android player display output
- Broadsign / Yodeck / LMX player configuration
### Step 2 — Confirm Actual Output Resolution
Do NOT rely solely on:
- LED panel specs
- Media Owner documentation
Instead verify via:
- Player display settings
- Screenshot from device
- Remote access (AnyDesk / TeamViewer)
- CMS device profile
### Step 3 — Update SSP Inventory Resolution
In LMX SSP:
- Navigate to Inventory settings
- Edit resolution
- Match CMS resolution exactly
- Save & republish
## Summary
For Pull to Content programmatic delivery, resolution alignment is critical.
Always match SSP inventory resolution to the CMS player output resolution — not the LED panel resolution.
