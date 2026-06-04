# Root Cause Analysis Old Content Still Playing on CMS-Connected Screens

Source document: `Root+Cause+Analysis_+Old+Content+Still+Playing+on+CMS-Connected+Screens.doc`

# Root Cause Analysis: Old Content Still Playing on CMS-Connected Screens
This page identifies and explains the possible root causes behind the issue where old content continues to play on screens, even after it has been removed or replaced in the CMS (Content Management System). Each point is derived from the detailed troubleshooting guide.
## 1. Internet Connectivity Issues
Cause: Device is not connected or has unstable internet, preventing it from syncing with the CMS.
- Devices may continue playing previously cached content.
- New playlists or content won't be downloaded until the device reconnects.
Example: The screen plays outdated content because the device failed to fetch the updated playlist due to a disconnected or weak internet source.
## 2. CMS Platform Inaccessible from Device
Cause: The device cannot reach the CMS platform URL.
- DNS issues, firewalls, or ISP blocks can prevent the CMS from loading.
Example: The screen keeps running old content because the CMS interface is inaccessible, and scheduled changes cannot be received.
## 3. Firewall or Security Restrictions
Cause: Firewall, antivirus, or VPN software blocks the CMS application.
- Syncing fails silently while the app keeps running in offline mode.
Example: CMS content update request is blocked, and the system falls back to old cached media.
## 4. CMS Application Not Running Properly
Cause: CMS application was not restarted after a network outage or OS issue.
- Device does not pull the latest playlist.
Example: Windows player crashed or hanged, and the CMS app didn't resume sync automatically.
## 5. Incorrect or Missing Content Scheduling
Cause: The content is not properly scheduled or published in CMS.
- Device will revert to the last valid playlist or fallback loop.
Example: New content was uploaded but not attached to a playlist, resulting in screens looping older creatives.
## 6. Device Marked as Offline in CMS
Cause: CMS shows device as offline due to lack of heartbeat/sync.
- Actual content on-screen is unaffected unless device is rebooted.
Example: Screen appears online onsite but CMS cannot confirm this, blocking new content from syncing.
## 7. Local Storage Full
Cause: Storage is insufficient to download new content.
- The device is unable to cache updated content, and continues using what was previously stored.
Example: Device reports 100% disk usage, so the CMS playlist sync fails and screen displays outdated media.
## 8. Outdated CMS Application or OS
Cause: Running outdated CMS app version or operating system.
- Compatibility issues prevent sync operations from executing correctly.
Example: New features like updated playlist logic don’t apply because the installed app version doesn’t support it.
## 9. Manual Republish Not Done
Cause: After editing a playlist, the publish/republish step is skipped.
- Changes made in CMS are not pushed to devices.
Example: Creative was removed from playlist, but changes were never published—causing device to continue playing the old schedule.
## 10. CMS Not Assigned Correctly to Device
Cause: Device may be pointing to an incorrect CMS tenant or project.
- Playlist updates are delivered to another project, not the device.
Example: Device was reinstalled but not correctly registered, linking it to a wrong CMS instance.
## Next Steps
- Review each root cause when troubleshooting syncing issues.
- Use the Content Sync Troubleshooting Guide for detailed steps.
- Contact support@movingwalls.com if none of the above resolves the issue.
