# Create a Device

Source document: `Create+a+Device.doc`

# Create a Device
## Overview
A Device in MW Content refers to the physical screen or player (e.g., Android box, Smart TV, or media player) that displays scheduled content. Before any content can play on a screen, the device must be registered in the platform, linked to a location, and verified with a code.
Once added, the device can be monitored, scheduled, restarted, and configured remotely.
## Purpose of Device Registration
- Link screens to their respective locations and networks
- Enable centralized content scheduling and remote monitoring
- Allow tracking via playlogs, online status, and screenshot capture
- Support device reboot and health checks
## How to Add a Device
- Navigate to:
Device Manager → Add Device
- Fill in the following details:
Field
Required
Description
Device Name
✅
Unique name for the screen/device (e.g., KL_Lobby_Screen01)
Location
✅
Assign the device to a registered location
Network
✅
Automatically selected if set via location
Start Time / End Time
✅
Playback hours for the screen
Screen Type
✅
Specify screen size (e.g., Full HD, 4K)
Status
✅
Keep enabled to activate the device
Verification Code
✅
Used during installation to pair the device with the CMS
- Click Save
## Device Verification
- Once saved, a Verification Code is generated.
- Open the MW Player App on the actual device.
- Enter the verification code to complete the registration.
- The device will begin syncing content once verified.
## Additional Device Details
Attribute
Description
IP Address
Captured automatically once the device is online
Connection Type
WiFi / Ethernet
Online/Offline Status
Shown in real time on Device Manager
Screenshot Capture
Captures live preview of what is currently displayed
Remote Reboot
You can restart the player remotely from the CMS
## Device Status Colors
Indicator
Meaning
🟢 Green
Device is online
🔴 Red
Device is offline
⚪ Grey
Device is unpaired
## Device Management Actions
- Edit Device Settings (e.g., location, screen type, schedule window)
- Deactivate Device (disables screen content and CMS control)
- Delete Device (only allowed after deactivation)
- Restart Device (remote reboot from CMS)
## Best Practices
- Use naming convention: Region_Location_Screen# (e.g., MY_KL_Lobby_01)
- Keep the status enabled unless intentionally disabling the screen
- Always pair the device using the Verification Code right after saving
- Group devices into locations and networks before adding
