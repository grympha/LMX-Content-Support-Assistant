# CMS Platform Downtime Incident - Backend Server Error or Timeout

Source document: `CMS+Platform+Downtime+Incident+-+Backend+Server+Error+or+Timeout.doc`

# CMS Platform Downtime Incident - Backend Server Error or Timeout
Ticket ID: #13819
Subject: Dana - LMX Content is slow ( urgent)
## Issue Summary
LMX Content CMS platform was loading very slowly, which was affecting CMS operation. The issue need to escalated to the DevOps and Infra teams for urgent investigation.
## Root Cause Analysis
### 1. Socket-Based Player Connection Mechanism
- CMS players communicate with the server via a persistent socket connection.
- Most content transfers (ads, sync data) also occur via this connection.
### 2. Heartbeat Mechanism
- The Ping Server sends a heartbeat message every 10 seconds to each player to ensure connectivity.
- If a player does not receive a ping for 60 seconds, it:
- Assumes connection lost
- Disconnects and attempts to reconnect
- This mechanism relies heavily on Ping Server uptime and performance.
### 3. Failure Trigger: Ping Server Disk Reached 100%
- The Ping Server was not configured with auto-scaling.
- Once disk utilization hit 100%, it failed to send heartbeat pings.
- Players began disconnecting and reconnecting in loops.
- Resulting in:
- Massive increase in socket traffic
- MongoDB CPU spike and connection overload
- CMS web server unable to connect to MongoDB
- Platform response failure
## Solutions Applied
Area
Action
Ping Server
Increased disk storage; added alert system for 70% usage threshold
MongoDB Cluster
Upgraded from M30 to M40 due to sustained high CPU
CMS Server
Pulled latest code and restarted services
Monitoring
Queue backlog of 40,000+ messages cleared; normal performance resumed
## Post-Fix Monitoring
- MongoDB and CMS server performance within acceptable range.
- No further auto-scaling or storage alerts triggered as of latest 48-hour check.
## Recommendations
- Add Ping Server to auto-scaling group.
- Setup early disk usage alerts for all backend services.
- Review MongoDB access patterns from socket services for optimization.
- Document recovery steps for faster response in future.
