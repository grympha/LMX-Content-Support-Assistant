---
category: "Supported Operating Systems & Hardware"
keywords: [requirements, spec, hardware, "operating system", os, webview, ram, storage, "android 11", "windows 10", "windows 11", linux, webos, brightsign]
confluence_urls:
  - label: "System Requirements"
    url: "https://movingwallshub.atlassian.net/wiki/x/cgqMCQ"
  - label: "Device & Platform Technical Requirements"
    url: "https://movingwallshub.atlassian.net/wiki/x/aoCTDw"
next_step: "Install the player application, pair the device, and verify playback."
---

# Supported Operating Systems & Hardware

## Overview

LMX Content CMS supports multiple operating systems and hardware platforms for digital signage deployments.

Supported platforms include Windows, Linux, Android, LG webOS, and BrightSign.

Hardware capability directly affects playback stability, synchronization performance, HTML rendering, programmatic campaign support, and multi-zone playback capability.

Low-spec hardware may experience playback lag, black screen, failed synchronization, player crash, or unstable HTML rendering.

## Supported Operating Systems & Hardware

| Platform | OS Version | Processor Type | System Type | RAM / Graphics Requirements |
| --- | --- | --- | --- | --- |
| Windows | Windows 10 & 11 | Intel Core i5/i7 recommended, Intel Pentium II/III, AMD Processor | 64-bit recommended, 32-bit supported | 8GB RAM recommended, 4GB minimum, 1GB Graphics Card and above |
| Linux | Ubuntu 18.04 LTS and above | Intel Core i5/i7 recommended, Intel Pentium II/III | 64-bit recommended, 32-bit supported | 8GB RAM recommended, 4GB minimum, 1GB Graphics Card and above |
| Android | Android 11 and above | Rockchip RK3328 Cortex A53 Quad-Core, Amlogic S905 Cortex A53 Quad-Core | 64-bit recommended | 8GB RAM / 128GB ROM recommended, 4GB RAM / 64GB ROM minimum |
| LG webOS | LG webOS Signage 4.0.1 | Alpha 5 Gen5 AI / ARM Cortex-A53 Quad-Core 1.0GHz | 64-bit recommended | 4GB RAM / 16GB ROM, 2GB RAM / 8GB ROM |
| BrightSign | HS123, XT1143, HD224 | ARM Cortex-A15 Quad-Core 1.0 & 2.0GHz | 64-bit recommended | 4GB RAM / 16GB ROM, 2GB RAM / 8GB ROM |

## Windows Support Notes

Supported versions are Windows 10 and Windows 11.

Windows 7 is no longer supported.

Last supported Windows 7 version: 1.0.29.29_SR.

## Android Support Notes

Recommended Android specification:

- Android 11+
- 8GB RAM / 128GB ROM
- 64-bit
- Quad-Core CPU

Minimum Android specification:

- 4GB RAM / 64GB ROM

Devices with 2GB RAM / 16GB storage may experience unstable playback, synchronization issues, HTML rendering limitations, or black screen during heavy playback, especially for VAST, HTML ZIP, URL widgets, and split layouts.

## LG webOS Support Notes

LG webOS has limited feature support.

Possible limitations include advanced HTML rendering, programmatic features, certain widgets, and complex layouts.

Use lightweight media playback for stable operation.

## BrightSign Support Notes

Supported devices include BrightSign HS123, BrightSign XT1143, and BrightSign HD224.

BrightSign is recommended for stable MP4 playback, lightweight deployments, and commercial signage environments.

## Supported Media Formats

Windows:

- Image: PNG, JPG, JPEG
- Video: MP4, MOV, WEBM, WMV

Linux:

- Image: PNG, JPG, JPEG
- Video: MP4, MOV, WEBM

Android:

- Image: PNG, JPG, JPEG
- Video: MP4, MKV

LG webOS:

- Image: PNG, JPG, JPEG
- Video: MP4

BrightSign:

- Image: PNG, JPG, JPEG
- Video: MP4

## Supported Web Browsers

| Browser | Supported Version |
| --- | --- |
| Google Chrome | Version 104 |
| Mozilla Firefox | Version 104 |
| Apple Safari | Version 5.1.7 |

Using unsupported browsers may cause CMS display issues, upload problems, or playback configuration issues.

## Supported File Types

| File Type | Format |
| --- | --- |
| Image | PNG, JPEG, GIF |
| Video | MP4 |
| HTML & ZIP | HTML5 |
| Audio | MP3 |
| Document | PDF |

## Programmatic Campaign Support

| Platform | Compatibility | Supported Formats |
| --- | --- | --- |
| Windows 10 & 11 | Fully Supported | VAST, URL, HTML, Offline/Online ZIP |
| Android 11+ | Fully Supported with WebView v100+ | VAST, URL, HTML online content |

Programmatic creatives such as VAST, URL, and HTML require a modern browser engine, updated WebView, and supported rendering environment.

Android devices require WebView Version 100 or above for stable HTML rendering, VAST playback, and URL widget support.

Windows 11 or Android 11+ is recommended for programmatic playback.

## Common Compatibility Issues

### Black Screen on Android

Possible causes include low RAM, outdated WebView, unsupported codec, or insufficient storage.

Fix: check Android version, WebView version, device specification, and content compatibility.

### HTML Content Not Rendering

Possible causes include outdated browser engine, unsupported WebView, insufficient RAM, or unsupported device.

Fix: update WebView, use Android 11+, and verify HTML compatibility.

### VAST Content Failing

Possible causes include outdated OS, unsupported browser engine, internet instability, or unsupported creative.

Fix: verify WebView version, internet connectivity, and creative compatibility.

### Slow Synchronization

Possible causes include low storage, weak CPU, unstable internet, or oversized content.

Fix: optimize content, verify hardware specification, and monitor storage usage.

## Best Practices

- Use recommended hardware specifications.
- Keep operating systems, WebView, and browsers updated.
- Optimize media content with compressed MP4, optimized images, and lightweight HTML packages.
- Validate hardware before deployment.

## Important Notes

- Hardware capability directly affects playback performance.
- Low-end Android devices may struggle with advanced content.
- Programmatic playback requires updated browser and WebView environments.
- Unsupported OS versions may cause playback instability.
- Windows 7 is no longer supported.

## Troubleshooting Checklist

If users report: Device supports CMS but playback unstable

Check:

- Operating system version
- RAM and storage
- WebView version
- Internet stability
- Content complexity
- Graphics capability

## Best Practice Workflow

Validate Device Specification -> Install Latest Player -> Update WebView/Browser -> Upload Optimized Content -> Schedule Content -> Publish Campaign -> Verify Playback

## Next Step

After validating compatibility, proceed to install player application, pair device, upload content, schedule campaign, and verify playback.
