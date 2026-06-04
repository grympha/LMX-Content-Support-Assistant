# Device Mapping Issue – How to Remap Device to Correct Network & Location

Source document: `Device+Mapping+Issue+–+How+to+Remap+Device+to+Correct+Network+&+Location.doc`

# Device Mapping Issue – How to Remap Device to Correct Network & Location
## Problem Summary
A device was:
- Mapped under the wrong network and/or location
- Displaying unscheduled or unintended content
- Monitored under incorrect groupings in the dashboard
## Root Cause
- Network or location was incorrectly selected during device creation
- Placeholder names like “Test Location” or “Test Playlist” were mistakenly used
- Existing inactive or test networks confused with live ones
## Resolution Steps
### 1. Create a New Device Entry
- Go to Device Manager on the LMX platform
- Click “Create Device”
- Under Network, select the correct value (e.g., Sarit Centre)
- Then select the correct Location (e.g., Sarit Centre-TL)
### 2. Pair the Device
- Once created, pair the physical device with this new entry using:
- Device Code, or
- Pairing URL (as during initial setup)
### 3. (Optional) Deactivate or Rename Old Device
- Deactivate the old entry (e.g., under wrong network like Junction Mall) to avoid duplicate or confusion
### 4. Unpair or Reset the App on the Device
#### For Windows Devices:
- While the LMX Content App is running:
- Press Ctrl + L to log out the current device pairing
- Enter the new verification code to re-pair with the correct entry
#### For Android Devices:
- Go to Settings > Apps > Mac-media player
- Tap “Storage” and then select “Clear Data”
- Relaunch the LMX Content App and enter the new pairing code
This ensures the app resets its current pairing and connects to the correct network/location context.
Alternatively, uninstall and reinstall the app if preferred
## Best Practices
- Avoid using “Test” labels for production devices
- Establish and maintain proper naming conventions
- Double-check network and location selections during device creation
- Periodically audit and clean unused device entries
