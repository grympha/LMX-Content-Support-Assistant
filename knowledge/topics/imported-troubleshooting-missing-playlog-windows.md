# Troubleshooting - Missing Playlog(windows)

Source document: `Troubleshooting+-+Missing+Playlog(windows).doc`

# Troubleshooting - Missing Playlog(windows)
Ticket ID #11599
## Issue Statement
When downloading playlogs from the LMX Content platform, the detail section is empty.
## Cause of Issue
This happened because the player was running an outdated version due to a configuration migration issue, which prevented syncing and all the data store in the local player send to the server.
## Steps for Troubleshooting
- Remote Access Required:
- Please get remote access to the affected player via AnyDesk or TeamViewer.
- Check Daily Log File:
Navigate to the following path:
C:\Users\Hezri\AppData\Roaming\mac-media-player\DailyLogs
- Open the latest daily log file using Notepad.
- Look for a Device ID entry within the log file.
- If Device ID is Missing:
Locate the network_info.json file to retrieve the Device ID:
C:\Users\Hezri\AppData\Roaming\mac-media-player\storage
- Use the search function to find: network_info.json
- Open it in Notepad and copy the Device ID shown.
- Update the Daily Log File:
- Paste the copied Device ID into the corresponding field in the daily log file.
- Save the file.
- Reboot the Player:
- Restart the player device to initiate syncing with the server.
- After rebooting, the player should begin syncing.
- You can now download the playlogs from the platform.
## Recommendation
To avoid similar issues in the future, it’s strongly recommended to update the player to the latest version.
