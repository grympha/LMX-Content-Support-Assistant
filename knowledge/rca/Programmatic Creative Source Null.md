---
category: "Programmatic / VAST"
keywords:
  - creative rejected
  - no impressions
  - delivery failure
  - dv360
  - gam configuration
  - advertiser field missing
  - programmaticCreativeSource null
  - creative validation failed
  - google ad manager
description: "RCA for programmatic campaign delivery failure — missing Advertiser field in GAM caused programmaticCreativeSource to return null."
search_priority: "medium"
related_topics:
  - "Programmatic / VAST"
---

# Programmatic Creative Source Null

## Issue

Programmatic campaign failed to deliver.

## Symptoms

- Creative rejected
    
- No impressions
    
- Delivery failure
    

## Investigation

DV360 campaign active.

Creative validation failed.

## Root Cause

Advertiser field missing in GAM configuration.

programmaticCreativeSource = null

## Resolution

Configured Advertiser field correctly.

Campaign delivery resumed successfully.

## Related Notes

[[DV360 Integration]]  
[[Programmatic Workflow]]  
[[Campaign Verification]]