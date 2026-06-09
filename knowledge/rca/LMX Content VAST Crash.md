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