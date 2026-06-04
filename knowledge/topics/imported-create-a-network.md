# Create a Network

Source document: `Create+a+Network.doc`

# Create a Network
## Overview
In CMS, a Network is the primary structure used to organize screens, users, and content configurations. Each network can represent a business unit, region, client, or location cluster.
Creating a network is a required step before assigning devices or scheduling content. It defines the operational rules, playback settings, and reporting behavior for all associated screens.
## Purpose of a Network
- Groups devices under logical structures (e.g., "KL Office", "Retail Branches", "Tenant A")
- Applies consistent playback settings (volume, brightness, sync times)
- Manage content delivery, user roles, and reporting on a per-network basis
### When to Create a New Network
Creating a new network helps organize devices for better control, targeted content delivery, and clearer permissions. You should create a new network when:
#### 1. Different Content Schedule
You need to run different playlists or schedules for:
- A different client or brand
- A specific region, market, or timezone
- A department with its own campaign timelines
Example: Client A wants ads to play only during office hours, while Client B wants weekend promos.
#### 2. Separate User Permissions & Content Visibility
You want to ensure that only specific users or teams can:
- Access certain devices
- Upload or assign content
- View analytics
Example: A marketing team in Region A should not see or control devices in Region B.
#### 3. Different Start/End Schedules or Default Configurations
Devices need custom playback hours or baseline settings like:
- Start/end times (e.g., mall vs. airport screens)
- Screen orientation (portrait vs. landscape)
- Volume settings or supported content types
Example: QSR menu boards start at 7AM, while retail store displays start at 10AM.
## How to Create a Network
- Go to:
CMS Portal → Network Tab
- Click:
Create
- Fill in the following fields:
Network Name (e.g., "KL HQ", "Singapore Retail")
Description (Optional – helps for internal reference)
Start Time / End Time – Set default content playback window
Tags – Add keyword tags for filtering and reporting
By Client or Brand (Nike, CocaCola, etc)
By Campaign Name (Ramadan2025, BackToSchool, etc)
Playlog Interval (mins) – Frequency of device data syncing to the platform
It controls how often the device "checks in" with the platform to upload what content has been played.
Background Download – Allow content to download automatically in the background while the device is online
Status – Keep enabled unless disabling temporarily
- Volume Setting
Controls the default audio level for all devices in the network.
Example: “Volume for all devices in the network” sets the base playback volume for videos or audio-enabled content. You can adjust this per device if needed.
- Brightness Setting
Sets the default screen brightness levelfor the network’s devices.
This is useful for ensuring consistent visibility across different environments (e.g., indoor malls vs. outdoor kiosks).
- Set any default values if applicable
- Click Add to create the network
## Fields Explained
### Network Information
Field
Required
Description
Network Name
✅
Unique name to identify the network (e.g., KL_HQ, Retail_Tenant_A)
Description
❌
Internal notes to describe the network’s purpose
Tags
❌
Keywords used for filtering, sorting, or reporting
### Device Settings
Field
Required
Description
Start Time / End Time
✅
Defines the operational playback hours (24-hour format)
Volume Range
❌
Set min/max audio level for screens (0–100%)
Screen Brightness
❌
Set brightness level for all devices in this network (0–100%)
Playlog Interval (min)
❌
Frequency in minutes for device to sync playlog data
Play Log (Checkbox)
Recommended
Enables tracking of all content played on each device
Background Download (Checkbox)
Recommended
Allows devices to pre-download content for offline playback
### Default Values
Field
Required
Description
Schedule Types
❌
Default category for scheduled content (e.g., Fillers, Client)
Brands
❌
Brands linked to content for targeted delivery
Start Date
❌
Default starting date for content schedules
Playlist
❌
Auto-assigned playlist for this network
Duration
❌
Default loop time for the playlist (in seconds or minutes)
### Other Options
Field
Required
Description
Geo Network
❌
Use only if content is triggered by location (geo-fencing)
Status
✅
Activates the network upon creation (must be enabled for usage)
## Best Practices
- Use clear naming conventions (e.g., MY_Sales_North)
- Keep “Play Log” enabled for reporting and analytics
- Create separate networks for each client, department, or tenant
- Leave “Geo Network” unchecked unless location-based targeting is required
