---
category: "Basic Troubleshooting"
keywords:
  - firewall
  - whitelist
  - ports
  - allowed urls
  - network requirements
  - outbound connections
  - cms url whitelist
  - proxy configuration
  - enterprise network
  - required domains
  - https 443
  - websocket cms
  - connectivity requirements
  - firewall blocking cms
  - network whitelist request
  - websocket blocked
  - corporate network cms
description: "Network connectivity requirements for LMX Content — covers required connection types, firewall and proxy whitelist guidance, and diagnosing connectivity-related device and CMS issues."
search_priority: "high"
related_topics:
  - "Basic Troubleshooting"
  - "Installation of LMX Content App"
  - "Device Pairing"
---

# Firewall & Network Requirements

## Quick Answer

LMX Content player devices require outbound internet access over HTTPS (port 443) and WebSocket (WSS) to the CMS platform, media CDN, and programmatic endpoints. Corporate firewalls, proxy servers, and deep packet inspection are among the most common causes of devices that fail to pair, show offline despite working internet, or fail to download content. Contact LMX Content support for the current full URL whitelist for your region.

## Why This Matters

LMX Content player devices are typically installed in commercial premises with corporate-managed networks. These networks commonly apply:

- URL and domain filtering
- Deep packet inspection (DPI)
- Proxy server interception of HTTPS traffic
- WebSocket connection blocking
- Port-level restrictions beyond port 80/443

Any of these can silently prevent the device from communicating with CMS even when the device has general internet access to public websites. Identifying and resolving firewall restrictions early prevents repeated support escalations on the same device.

## Required Connection Types

LMX Content requires the following categories of outbound connections from each player device:

### 1. CMS API

- **Protocol:** HTTPS
- **Port:** 443
- **Purpose:** Device registration (pairing), schedule sync, content publishing, device commands, and status reporting
- **Direction:** Device → CMS (outbound only)

### 2. Real-Time Heartbeat

- **Protocol:** WebSocket over TLS (WSS)
- **Port:** 443
- **Purpose:** Live device online/offline status monitoring in CMS
- **Important:** Many corporate firewalls and transparent proxies allow HTTPS but block WebSocket protocol upgrades on port 443. This causes devices to appear offline in CMS while still playing cached content.

### 3. Media Content Delivery (CDN)

- **Protocol:** HTTPS
- **Port:** 443
- **Purpose:** Downloading media files (MP4, PNG, JPG, HTML ZIP) to device local storage after a publish
- **Note:** CDN endpoints may use wildcard subdomains. Wildcard domain whitelisting (`*.example.com`) may be required. Obtain the current CDN domain list from LMX Content support.

### 4. Programmatic / VAST Endpoints

- **Protocol:** HTTPS
- **Port:** 443
- **Purpose:** VAST ad requests, SSP bid responses, and programmatic creative delivery
- **Note:** Programmatic campaigns involve third-party SSP partner domains in addition to the LMX Content platform. The specific SSP endpoint list varies by campaign configuration. Request the full SSP domain list when setting up programmatic-enabled deployments.

## Requesting the Full Whitelist

The complete list of domains and IP ranges changes over time and varies by deployment region. To obtain the current whitelist:

1. Raise a support ticket with the subject: **Firewall Whitelist Request**.
2. Include the deployment country or region.
3. Specify whether programmatic/VAST campaigns will be running — this determines whether SSP partner domains are needed.
4. The support team will provide the current domain list to share with the customer's IT team.

## Common Symptoms of Firewall Restrictions

| Symptom | Most Likely Cause |
|---|---|
| Device installs and app launches, but pairing fails | CMS API blocked |
| Device shows as offline in CMS despite confirmed internet | WebSocket (WSS heartbeat) blocked |
| Device pairs and comes online, but content does not download | CDN media delivery blocked |
| MP4 content plays normally but VAST/programmatic does not | SSP endpoint(s) blocked |
| Device goes online briefly then drops offline repeatedly | WebSocket connection timing out or being reset by DPI |
| Pairing works on mobile data (SIM) but fails on site Wi-Fi | Site network has restrictions that mobile does not |

## Diagnosing Firewall Issues

### Basic Connectivity Test

On the device, open a browser and navigate to a publicly known website. If it loads, the device has general internet access. If the CMS is still unreachable, a domain-specific restriction is the cause.

### WebSocket Test

WebSocket blocking is the most common hidden restriction. It typically produces this symptom pattern:

- Device online indicator in CMS fluctuates or shows offline
- Physical screen continues playing cached content (sync/CDN works)
- Restarting the player reconnects briefly, then drops again

If this pattern matches, ask the customer's IT team to specifically allow WebSocket (WSS) upgrades on port 443 to the CMS domain.

### Mobile Data as a Baseline

Use a mobile data connection (SIM card or mobile hotspot) as a known-clean network baseline. If the device pairs and communicates correctly on mobile data but not on site Wi-Fi/Ethernet, the site network has a restriction — not a device or CMS issue.

## Common Network Environments

| Environment | Common Restriction Pattern |
|---|---|
| Corporate office Wi-Fi | URL/domain filtering via proxy or firewall |
| Retail chain managed network | Centralized proxy blocks non-whitelisted domains |
| Hotel / hospitality network | Captive portal intercepts and breaks HTTPS |
| Public venue / airport network | DPI blocks WebSocket upgrades |
| Mobile data (SIM) | Typically unrestricted — best baseline for testing |

## Escalation Criteria

Escalate when:

- The customer confirms a corporate firewall or proxy is in place and the IT team needs the official URL whitelist
- The device has confirmed internet access but cannot pair or synchronize
- Content download works (CDN accessible) but VAST playback fails — SSP domains may need to be added
- Firewall changes were made but the issue persists — collect a network trace or firewall logs

**Information to collect before escalating:**
- Device type: Android or Windows
- Network environment: corporate Wi-Fi, Ethernet, SIM, or other
- Whether the device can access general public internet sites
- Whether a proxy or DPI appliance is in use at the site
- Whether mobile data resolves the issue

## Related Notes

[[Device Offline]]
[[Device-Pairing-Troubleshooting]]
[[Programmatic Issues]]
[[VAST Issues]]
[[Installation of LMX Content App]]
[[imported-cms-platform-downtime-incident-backend-server-error-or-timeout]]
