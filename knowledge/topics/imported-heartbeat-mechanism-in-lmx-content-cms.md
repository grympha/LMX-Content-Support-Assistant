# Heartbeat Mechanism in LMX Content CMS

Source document: `Heartbeat+Mechanism+in+LMX+Content+CMS.doc`

# Heartbeat Mechanism in LMX Content CMS
### Overview
The heartbeat mechanism in the LMX Content CMS ensures consistent and reliable communication between the CMS server and player devices. It functions as a health-check signal to maintain persistent socket connections and detect disconnections promptly.
### 1. Socket-Based Player Communication
- Each LMX player maintains a persistent socket connection with the CMS server.
- This connection is responsible not only for heartbeat signaling but also for:
- Content delivery (ads, videos, images)
- Sync requests
- Status reporting (e.g., online/offline, content playback status)
### 2. Heartbeat Workflow
#### Step-by-Step Process
Component
Function
Ping Server
Sends a heartbeat ping to each connected player every 10 seconds
Player
Expects to receive regular pings from the server
Timeout Logic
If no ping is received within 60 seconds, the player:
→ Assumes connection lost
→ Disconnects
→ Attempts reconnection
### 3. What Happens During a Disconnection?
If the heartbeat ping is missed:
- The player auto-disconnects from the server.
- It immediately attempts to reconnect, which:
- Creates extra socket traffic
- Increases load on:
- MongoDB (session/connection logging)
- CMS Web Server
- Ping Server
### 4. Example: Failure Incident
#### Root Cause:
- Ping Server disk hit 100% usage (no auto-scaling)
- It stopped sending heartbeat messages
- Players started reconnecting in infinite loops
- Resulted in:
- MongoDB CPU spike
- CMS server unable to reach MongoDB
- Total platform slowdown and failure
### 5. Resolution Summary
Area
Fix Applied
Ping Server
Increased disk, added alert at 70% usage
MongoDB
Upgraded from M30 to M40 for higher capacity
CMS
Code refreshed, services restarted
Queue
Backlog of over 40,000 messages cleared
### 6. Recommendations
- Add auto-scaling to Ping Server
- Implement early alerting for disk usage on all backend services
- Review MongoDB access pattern for socket requests
- Document a recovery playbook for incident response
### 7. Post-Fix Monitoring
- MongoDB and CMS servers operating within normal parameters
- No new alerts for disk or CPU
- Heartbeat pings and socket traffic stabilized
### Why Heartbeat Matters
Without the heartbeat mechanism:
- CMS wouldn’t know if a device is live
- Players might stay in a “ghost” connected state
- Content delivery would become unreliable
Maintaining the heartbeat loop ensures:
- Reliable uptime monitoring
- Accurate online/offline device reporting
- Stable content sync
