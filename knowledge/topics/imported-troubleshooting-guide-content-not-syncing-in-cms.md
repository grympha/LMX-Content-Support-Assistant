---
category: "Publish Content"
keywords:
  - content not syncing
  - sync failed
  - content sync issue
  - content not downloading
  - firewall blocking sync
  - cms sync troubleshooting
  - schedule sync issue
  - windows sync cms
  - android sync cms
  - content not updating device
  - sync diagnostic steps
description: "Step-by-step troubleshooting guide for content syncing failures on Windows and Android devices — covers connectivity, firewall, scheduling, and storage causes."
search_priority: "high"
related_topics:
  - "Publish Content"
  - "Basic Troubleshooting"
  - "Schedule Content"
---

# Troubleshooting Guide Content Not Syncing in CMS

Source document: `Troubleshooting+Guide_+Content+Not+Syncing+in+CMS.doc`

# Troubleshooting Guide: Content Not Syncing in CMS
This guide provides a step-by-step approach to diagnosing and resolving content syncing issues for Windows and Android devices running the CMS application on CMS Platform.
Root Cause Analysis: Old Content Still Playing on CMS-Connected Screens
## Verify Internet Connectivity
Step 1: Check if the device is connected to the internet (Wi-Fi, Ethernet, or Mobile Data).
Step 2: Open a web browser and try accessing Google.com and CMS Platform.
Step 3: Run a speed test to ensure stable bandwidth.
Step 4: Restart the router or switch to another network to rule out connectivity issues.
Step 5: If the connection is unstable, contact the network administrator for troubleshooting.
## Confirm CMS Platform Accessibility
Step 1: Open a browser and go to CMS Platform.
Step 2: Log in with valid credentials.
Step 3: If the website is inaccessible:
- Check for CMS downtime or maintenance updates.
- Try accessing from another device on the same network.
- Use a mobile hotspot to rule out network restrictions.
## Disable Firewall & Security Restrictions
🔹 For Windows Players:
- Step 1: Open Windows Defender Firewall via the Control Panel.
- Step 2: Click "Allow an app through Windows Firewall."
- Step 3: Ensure the CMS application is added to the allow list.
- Step 4: Temporarily disable firewall and antivirus software, then restart the CMS app.
🔹 For Android Players:
- Step 1: Disable any VPN, security, or firewall apps that might block CMS connectivity.
- Step 2: Test the application again after disabling security restrictions.
## Restart the CMS Application & Device
Step 1: Close the CMS application completely (End task in Task Manager on Windows).
Step 2: Restart the device (Windows or Android).
Step 3: Relaunch the CMS application and check if content syncs.
## Verify Content Scheduling & Sync Status in CMS
Step 1: Log into CMS Platform.
Step 2: Check if the content is properly scheduled under the "Content" or "Playlist" section.
Step 3: Verify the assigned playlist is published and active.
Step 4: Check the last sync time on the CMS dashboard: If it hasn’t been updated recently, manually trigger a sync.
Step 5: If content isn’t updating, republish the playlist and check for any errors.
## Confirm Online Status
Step 1: Open the CMS dashboard and navigate to the Devices or Players section.
Step 2: Verify if the player is listed as Online.
Step 3: If the player appears Offline:
- Check its network connection.
- Restart the player and reattempt registration.
- Ensure it is assigned to the correct CMS server.
## Check Local Storage Availability
🔹 For Windows Players:
- Step 1: Open File Explorer and check available storage on the drive where the CMS application is installed.
- Step 2: If space is low, delete old content files to free up storage.
🔹 For Android Players:
- Step 1: Go to Settings > Storage and check available space.
- Step 2: If storage is nearly full, clear cache and remove unnecessary files.
## Update CMS Application & System Software
Step 1: Check for updates in the CMS application (Windows or Android).
Step 2: If an update is available, install it and restart the device.
Step 3: Ensure the Windows OS or Android system is updated to the latest version.
## Contact Support (If Issue Persists)
If the issue is still not resolved, provide the following details to the support team:
Device type (Windows or Android)
CMS application version
Network connection status
Error messages (if any)
Screenshots or screen recordings of the issue
Submit a ticket via your support portal or email support atsupport@movingwalls.com with the collected information.
