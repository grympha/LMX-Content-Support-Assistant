---
category: "Installation of LMX Content App"
keywords: [android, windows, install, installation, apk, installer, "verification code", "software render", "sr build"]
confluence_urls:
  - label: "Installation Guide (Android & Windows)"
    url: "https://movingwallshub.atlassian.net/wiki/x/AoCTDw"
  - label: "Download MW Content App"
    url: "https://movingwallshub.atlassian.net/wiki/x/V4CTDw"
next_step: "Pair Device, Publish Content, and verify playback."
---

# Installation of LMX Content App

## Overview

This guide explains how to install and register the LMX Content Player application for Android devices and Windows devices.

The LMX Content Player is responsible for downloading content, playing scheduled media, synchronizing with CMS, generating playlogs, and receiving playlist updates.

## Important Notes

### Application Update

To update an existing application, download and install the latest version directly without uninstalling the previous version.

This preserves device pairing, local cache, and player configuration.

### New Device Installation

Before installing on a new device, create the device in the CMS platform first. This generates the verification code required for registration.

Verification codes are one-time use only.

## Software Render (SR) Version

SR means Software Render.

The SR build is designed for devices without GPU acceleration. It relies on CPU-based rendering, improves compatibility for low-end devices, and may reduce graphical performance.

Use SR for low-spec hardware, unsupported GPU environments, or older Android and Windows devices.

## Android Installation Guide

1. Download the Android installation APK.
2. After download, click Install.
3. When prompted, select Just Once.
4. Click Install again to begin installation.
5. Allow all requested permissions, including Permission 1/2 and Permission 2/2.

Permissions are required for storage access, playback functionality, and content synchronization. Without permissions, playback or downloads may fail.

## Android Registration Process

1. Launch the installed player application.
2. Select Login with Verification Code.
3. Enter the verification code generated from CMS.
4. Confirm successful registration.

After successful registration, the device becomes paired, synchronization begins, and content can be published.

## Windows Installation Guide

1. Download the Windows installer package.
2. Right-click the installer.
3. Select Run as Administrator.
4. If Windows Defender displays a security popup, select Run anyway.
5. Follow the installation wizard until completion.

Running as Administrator ensures proper installation permissions.

## Windows Registration Process

1. Launch the installed LMX Content Player.
2. Enter the verification code generated from CMS.
3. Confirm successful registration.

After successful registration, the device becomes paired, synchronization begins, and content can be published.

## Common Installation Issues

### APK Installation Blocked

Possible causes include unknown sources disabled, security restriction, or unsupported Android version.

Fix: enable Install from Unknown Sources and retry installation.

### Windows Installation Failed

Possible causes include insufficient permissions, antivirus restriction, or corrupted installer.

Fix: run as administrator, temporarily allow the installer, or re-download the installer.

### Verification Code Invalid

Possible causes include code already used, typing error, or expired code.

Fix: generate a new verification code from CMS.

### Player Installed but Not Synchronizing

Possible causes include internet issue, firewall restriction, device not paired, or unstable network.

Fix: check internet connectivity, CMS pairing status, and player application status.

### Black Screen After Installation

Possible causes include unsupported hardware, unsupported codec, failed synchronization, or storage limitation.

Fix: verify device specification, restart player, and validate content compatibility.

## Recommended Device Requirements

Android recommended specification:

- Android 11+
- 4GB RAM minimum
- 32GB/64GB storage
- Quad-core CPU

These specifications are recommended for stable playback, HTML content, VAST content, and multi-zone layouts.

## Best Practices

- Always create the device in CMS before registration.
- Use stable internet during installation and registration.
- Install the latest version only.
- Avoid uninstalling during updates to prevent pairing loss, cache removal, or configuration reset.

## Important Notes

- Verification codes are one-time use only.
- Devices must be paired before content playback can begin.
- Stable internet is recommended during installation and registration.
- Low-spec devices may require SR builds.
- Unsupported hardware may affect playback performance.

## Troubleshooting Checklist

If users report: Player installed but not working

Check:

- Installation completed successfully
- Device paired correctly
- Internet connectivity
- Player permissions
- Device compatibility
- Storage availability

## Best Practice Workflow

Create Device in CMS -> Download Player -> Install Application -> Launch Player -> Enter Verification Code -> Verify Pairing -> Publish Content -> Verify Playback

## Next Step

After successful installation, proceed to pair device, upload content, schedule content, publish campaign, and verify playback.
