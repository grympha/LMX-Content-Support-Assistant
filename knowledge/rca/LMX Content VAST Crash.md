---
category: "Programmatic / VAST"
keywords:
  - vast crash
  - lmx content crash
  - force close vast
  - webview outdated
  - android system webview
  - webview 106
  - programmatic not playing
  - update webview
  - webview 120 required
description: "RCA for LMX Content crashing during VAST playback — outdated Android System WebView (106) required update to 120+."
search_priority: "high"
related_topics:
  - "Programmatic / VAST"
  - "Basic Troubleshooting"
  - "Supported Operating Systems & Hardware"
---

# LMX Content VAST Crash

## Issue

LMX Content crashed when attempting to play VAST content.

## Symptoms

- Application force close
    
- Endless loading
    
- Programmatic content not displayed
    

## Investigation

Device Information:

- Android 15
    
- WebView 106
    

## Root Cause

Outdated Android System WebView.

Programmatic content requires:

- Android 11+
    
- WebView 120+
    

## Resolution

Update Android System WebView.

## Prevention

Verify:

- Android Version
    
- WebView Version
    

before onboarding programmatic devices.

## Related Notes

[[VAST Issues]]  
[[Programmatic Issues]]  
[[System Requirements]]  
[[Update-Android-WebView]]