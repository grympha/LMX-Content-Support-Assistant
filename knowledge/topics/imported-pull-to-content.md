# LMX Content – Pull To Content

## Overview

Pull To Content is a feature that allows content from SSP (Supply Side Platform) campaigns to be automatically delivered and played on screens managed through LMX Content.

This feature enables seamless integration between inventory sales and content playback by automatically pulling approved campaign creatives into the assigned playlist without requiring manual scheduling by the operator.

## How Pull To Content Works

The Pull To Content workflow consists of the following steps:

1. Inventory is created and configured in SSP.
2. Inventory is mapped to an LMX Content device.
3. A campaign is booked against the inventory.
4. The campaign content is automatically pushed into the assigned playlist.
5. LMX Content downloads and plays the content on the mapped device.

Flow: SSP Inventory → Inventory Mapping → Campaign Booking → Pull To Content → LMX Playlist → LMX Device Playback

## Prerequisites

Before using Pull To Content, ensure the following:

- Device is paired and online in LMX Content.
- Inventory has been created in SSP.
- Inventory is mapped to the correct device.
- Playlist is assigned to the device location.
- Pull To Content feature is enabled.

## Recommended Setup (Best Practice)

### One Device = One Inventory Mapping

Each device should have its own unique inventory mapping. Recommended configuration:

| Device Name | Network | Location | Playlist |
|---|---|---|---|
| MW Screen 001 | Pavilion KL | Moving Walls Malaysia | MW Malaysia |
| MW Screen 002 | Mid Valley Megamall | Moving Walls Malaysia | MW Malaysia |

Benefits:
- Individual inventory control
- Accurate campaign targeting
- Better reporting
- Easier troubleshooting
- Supports inventory-level programmatic sales

## Not Recommended Setup

Avoid mapping multiple devices to the same network, location, and playlist.

Issue: If all devices share the same network, location, and playlist, a campaign delivered to the location may be played across all devices. This reduces inventory-level control and may result in unintended content delivery.

## Inventory Mapping Process

### Step 1 – Create Device

Create the device in LMX Content with the following fields:
- Device Name
- Network
- Location
- Playlist

### Step 2 – Create Inventory

Create the corresponding inventory in SSP with a name that matches or references the device.

### Step 3 – Map Inventory

Map the SSP inventory to the LMX Content device. Each inventory entry should be mapped to exactly one device.

### Step 4 – Verify Mapping

Confirm:
- Inventory is active
- Device is online
- Playlist is assigned
- Mapping is completed successfully

## Campaign Delivery Flow

When a campaign is booked:

1. Campaign is approved in SSP.
2. Creative is assigned to the inventory.
3. Pull To Content automatically pushes the content into the mapped playlist.
4. Device downloads the content.
5. Content starts playback according to schedule.

## Verification Checklist

Before Go-Live:
- Device paired successfully
- Device online
- Playlist assigned
- Inventory created
- Inventory mapped
- Pull To Content enabled
- Test campaign created
- Content downloaded
- Playback verified

## Troubleshooting

### Campaign Not Playing

Verify:
- Inventory mapping is correct
- Device online status
- Playlist assignment
- Campaign approval status in SSP
- Content synchronization status

### Content Not Appearing

Verify:
- Correct inventory is selected
- Inventory-device mapping is correct
- SSP campaign status
- Playlist synchronization

### Wrong Device Playing Content

Verify:
- Shared network/location configuration — devices sharing the same network and location will both receive the campaign
- Inventory mapping — ensure each inventory maps to exactly one device
- Playlist assignment

Recommended Solution: Use separate inventory mappings for each device to ensure inventory-level content delivery.

## Best Practices

- Use one inventory per screen whenever possible.
- Keep device and inventory naming consistent.
- Verify mappings before campaign launch.
- Run a test campaign before production deployment.
- Monitor device online status regularly.
- Avoid using shared inventory mappings for independent screens.

## Summary

Pull To Content automates the delivery of SSP campaigns into LMX Content playlists through inventory mapping. For the best results, each screen should have its own inventory mapping while maintaining proper playlist and location configuration. This ensures accurate campaign delivery, reliable reporting, and easier operational management.
