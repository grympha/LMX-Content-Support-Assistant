# Troubleshooting Guide Fluctuating Online Offline Device Status in Dashboard

Source document: `Troubleshooting+Guide_+Fluctuating+Online_Offline+Device+Status+in+Dashboard.doc`

# Troubleshooting Guide: Fluctuating Online/Offline Device Status in Dashboard
Ticket ID: #13808
Subject: Pyxis : Fluctuating Online offline device status every time when we refresh the page
## Issue Summary
You may notice that the Online/Offline status of devices changes every time you refresh the LMX Content dashboard. This inconsistency can raise doubts about the actual health of the device, even though it may be working normally.
## Common Causes
### 1. Unstable Internet Connection
- Devices connected via 4G/5G dongles, low-signal Wi-Fi, or unreliable networks may frequently disconnect and reconnect.
- These brief outages can result in the device appearing Offline intermittently on the dashboard.
### 2. Heartbeat Delays
- Each player device sends a heartbeat ping every 10 seconds to the CMS platform to report its online status.
- If a device misses one or more pings (due to bandwidth issues, high CPU usage, or system lag), it may temporarily appear Offline until the next successful ping.
- Even if the device is running and content is playing, a delayed or dropped heartbeat can trigger a false offline status.
### 3. Live Sync Limitation
- The dashboard fetches live status from multiple devices, but not all responses arrive at the same time.
- During a manual refresh, the status reflects whichever responses have been received first—causing temporary mismatches between what’s shown and the actual state.
### 4. Firewall / Proxy / ISP Caching
- On some corporate networks, firewalls, proxies, or caching systems can delay communication between the CMS and devices.
- This affects the real-time heartbeat sync and may inaccurately display the status.
## Suggested Troubleshooting Actions
### Step 1: Wait and Refresh
- Wait 5–10 minutes, then refresh the dashboard manually.
- Devices with stable connections will revert to Online once heartbeat pings resume properly.
### Step 2: Investigate Frequent Fluctuators
- Devices that repeatedly flip between Online and Offline should be checked for:
- Weak signal strength (especially 4G/5G devices)
- Background CPU/memory load
- Local network/firewall restrictions
## Recommended Preventive Actions
- Deploy stable Wi-Fi or wired LAN connections for all critical screens.
- Use watchdog service on Windows to auto-restart player if it stops.
- Periodically check and update device firmware and LMX app to latest version.
- Keep OS updates installed (especially for Windows-based players).
## Additional Notes
- This issue is not always a platform bug, and is often related to network reliability or device-side constraints.
- If multiple users report the same across networks, escalate to engineering for backend log correlation.
