# Devices Showing as Offline but Playing Content (Troubleshooting Guide)

Source document: `Devices+Showing+as+Offline+but+Playing+Content+(Troubleshooting+Guide).doc`

# Devices Showing as Offline but Playing Content (Troubleshooting Guide)
This issue involves Android-based CMS devices appearing offline in the management platform, while continuing to play scheduled content normally on-screen. This discrepancy can lead to confusion in monitoring and support operations.
Known Symptoms:
- Device shows as offline in CMS
- Content playback is uninterrupted
- Last ping or heartbeat to CMS is outdated
Root Cause:
Incorrect system time on the device can prevent successful communication with CMS servers. This breaks synchronization and causes the device to appear as offline.
Ticket Example: Ticket ID: #12494
Subject: Prowtech: CMS: Need Latest whitelist APK version 2.891 as number of offline devices are increasing
URL: https://helpdesk.movingwalls.com/agent/movingwallsholdingpteltd/all/tickets/details/723002000050215053
## Resolution Steps
- Validate Device Time Settings:
- Navigate to device settings > Date & Time
- Enable "Set time automatically" or sync with NTP
- Manual Correction:
- Temporarily disable automatic time
- Manually set the current date/time
- Reboot device and monitor CMS status
- Remote Troubleshooting (if needed):
- Connect device to a local network with a PC
- Use remote tools like AnyDesk or TeamViewer
- Collect Android logs via ADB if accessible
- Verify in CMS:
- Confirm that the device has resumed pinging CMS
- Check that it appears online in the dashboard
