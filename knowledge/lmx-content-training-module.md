# LMX Content Training Module

Source: LMX Content Training Module.pdf. This Markdown file is the searchable runtime knowledge version of the uploaded training PDF.

## Page 3 - Required Default Content

As part of the updated platform workflow, it is mandatory to assign default content to activate key features such as scheduling content and publishing campaigns. Each setup must include one image creative and one video creative.

## Pages 4-6 - Dashboard Overview

The Dashboard is the default landing page in CMS. It provides device health, content scheduling status, storage usage, online/offline/unpaired device summary, network visualization, storage usage, notifications, and release information. Best practices: review dashboard daily, investigate offline or unpaired devices in Device Manager, monitor storage, resolve pending or placeholder content to avoid screen blackouts, and track player/software version updates.

## Pages 7-11 - Create a Network

A Network organizes screens, users, and content configuration. It can represent a business unit, region, client, or location cluster. Create separate networks for different content schedules, separate user permissions, different playback hours, or different default configuration. Required fields include network name, start time, end time, and status. Recommended settings include Play Log enabled and Background Download enabled. Playlog interval controls how often a device checks in to upload played-content data.

## Pages 12-14 - Create a Location

A Location represents where a device is deployed, such as a building, floor, zone, or screen group. Locations are linked under Networks. Required fields include name, country, region, timezone, zone name, subzone name, and status. Always select the correct timezone to avoid scheduling issues.

## Pages 15-18 - Playlist Creation

A Playlist is a sequence of media files that plays on assigned screens. Playlist setup includes playlist name, duration in seconds, playlist type, location, play type, optional tags, description, media partner, and status. Playlist types include Normal, Fixed, Prime, and Dependent. Best practices: set playlist duration based on total content length, use Prime Time for day-part campaigns, assign a default playlist as backup, and use tags for grouping.

## Pages 19-22 - Layout Creation

A Layout divides a digital signage screen into sections or tags, with each tag linked to a playlist. Scaling can be percentage or pixel based. Tags require a name, playlist, position, width, height, and optional description. Best practices: use percentage scaling when screens vary, keep layouts visually clear, set at least one default layout per location, and use descriptive names.

## Pages 23-26 - Create a Device and Pairing

A Device is the physical player or screen that displays scheduled content. Create the device in Device Manager, assign the location, confirm network, playback start/end time, screen type, and status. A verification code is generated after saving. Open the MW Player app on the physical device and enter the verification code to complete pairing. Verification codes are one-time use only.

## Pages 27-30 - Playlogs

Playlogs provide playback reports for auditing and validation at general and device level. Play Log should be enabled at network level. If playlogs are missing, check whether the player was active, content actually played, the reporting date range is correct, the device had connectivity, and whether the playlog interval or upload was delayed.

## Pages 31-36 - Storage

Storage is used to upload, manage, and organize media files and folders. Dashboard storage usage helps monitor capacity and cleanup needs. If content cannot sync or upload, check storage availability, file format, and upload status. Cleanup may be needed before more media can be added.

## Pages 37-41 - Default Playlist Management

Default Playlist is fallback content and is required for publishing and scheduling workflows. To add or remove content in Default Playlist, go to Setup > Default Playlist, add the required content, create schedule, set duration, start/end date, daypart or spot, save, then approve. At least one image and one video should be scheduled in the Default Playlist.

## Pages 42-45 - How to Schedule Content

To schedule content, confirm network, location, playlist, content asset, campaign timing, daypart or spot settings, and publish status. The schedule must be active for the device local timezone. If content is not playing, verify the campaign is saved, approved, published, assigned to the correct playlist/device/location, and synced to the player.

## Pages 52-53 - Scheduling Bundles

Bundle scheduling is used when multiple schedules or grouped content need to be managed together. Confirm bundle assignment, active dates, target playlist, and publish status when troubleshooting bundle playback.

## Pages 58-60 - Playlist Metrics for Scheduled Content

Playlist metrics help validate scheduled content performance. Use metrics and playlogs to confirm whether scheduled content was actually played. Missing metrics may indicate that content did not play, the device did not upload logs, the date range is wrong, or the device was offline during reporting.

## Pages 61-63 - URL and Google IMA VAST Scheduling

For URL and Google IMA/VAST schedules, confirm the URL/ad tag, environment, duration, fallback/filler content, network access, WebView/browser compatibility, and whether the player can reach ad endpoints. Programmatic and VAST playback depends heavily on modern browser/WebView support and stable internet.

## Pages 64-70 - Widgets and Programmatic Integrations

Weather, temperature trigger, Place Exchange, and Hivestack widgets require correct configuration, network access, API keys or IDs, screen/ad unit mapping, fallback content, and compatible player environment. For Hivestack, configure ad serving environment, ad slot duration, filler content, organization/API key, and Screen ID or CMS device ID mapping.

## Pages 71-73 - Unable to Publish Error

Error message: Before creating a schedule, please ensure that at least one image schedule is added to the default playlist.

Problem: CMS blocks publishing when the Default Playlist does not meet scheduling requirements. The Default Playlist must have at least one video content scheduled and at least one image content scheduled.

Solution steps: log in to CMS, go to Setup > Default Playlist, create schedule for selected video/image content, set content details such as duration, start/end date, daypart or spot, save, and approve the content. Tips: schedule at least one image and one video in the Default Playlist, verify content appears on player after publishing, use valid formats such as MP4, JPG, and PNG, and do not assume uploading alone is sufficient.

## Pages 74-79 - Android and Windows Installation

For existing application updates, download and install the new version without uninstalling the current or previous version. For new installation, create the device in CMS first to generate a verification code. Android installation: install app, allow permissions, choose once where relevant, select Login with Verification Code, and enter CMS verification code. Windows installation: run installer as administrator, select Run Anyway if Windows protection appears, then register using CMS verification code. Verification codes are one-time use only.

## Pages 80-83 - Supported OS, Media Formats, Browsers, and Programmatic

Windows: Windows 10 and 11. Recommended Intel Core i5/i7, 64-bit, 8GB RAM and above. Minimum 4GB RAM.

Linux: Ubuntu 18.04 LTS and above. Recommended Intel Core i5/i7, 64-bit, 8GB RAM and above. Minimum 4GB RAM.

Android: Android 11 and above. Recommended Rockchip RK3328 Cortex A53 quad-core 64-bit or Amlogic S905 Cortex A53 quad-core, 8GB RAM / 128GB ROM recommended, 4GB RAM / 64GB ROM minimum.

Supported image formats include PNG, JPG, JPEG. Supported video formats include MP4, MOV, WEBM, WMV depending on platform. Android supports PNG, JPG, JPEG, MP4, and MKV.

Programmatic-friendly requirements: VAST, URL, and HTML creatives require modern OS versions due to browser engine and WebView dependencies. Windows 11 or Android 11+ is recommended for programmatic playback. Android 11+ is fully supported if WebView version is 100 or above for VAST, URL, and HTML online content.

## Pages 84-85 - Recommended Android Devices

Minimum Android requirements: Android 11.0 and above, Rockchip RK3328 or Amlogic S905 Cortex A53 quad-core CPU, 64-bit OS recommended, recommended 8GB RAM / 128GB ROM, minimum 4GB RAM / 64GB ROM. Example compatible commercial Android media players include DSDevices DSCS9X, Minix Neo U22-XJ, Ugoos AM6 Plus, Zidoo Z9X Pro, Tanix TX5 Max, Tanix TX3 Mini Plus, X96 Max Plus, and Beelink GT-King.

## Pages 86-87 - Recommended LG webOS Devices

LG webOS requirement: LG webOS Signage 4.0.1 or above, alpha 5 Gen5 AI / ARM Cortex-A53 quad-core, 64-bit recommended, 4GB RAM / 16GB ROM recommended, 2GB RAM / 8GB ROM minimum. Always verify webOS version before deployment. Heavy HTML and VAST may be limited.

## Pages 88-89 - Recommended BrightSign Devices

BrightSign requirement: BrightSign OS version 6.2, ARM Cortex-A15 quad-core, 64-bit recommended, 4GB RAM / 16GB ROM recommended, 2GB RAM / 8GB ROM minimum. Tested compatibility includes XT1143, HD224, and HS123. Update OS to 6.2 or later.

## Pages 90-91 - Recommended Windows Devices

Windows requirement: Windows 10 or 11. Recommended Intel Core i5 or i7. Minimum Intel Pentium II, III, or AMD processor. 64-bit recommended. Recommended 8GB RAM or more. Minimum 4GB RAM plus 1GB graphics card. Ensure Windows updates, drivers, codecs, and hardware-accelerated video decoding are available.

## Pages 92-93 - Recommended Linux Devices

Linux requirement: Ubuntu 18.04 LTS and above. Recommended Intel Core i5/i7, 64-bit, 8GB RAM and above. Minimum 4GB RAM plus 1GB graphics card. Recommended devices include Intel NUC, Lenovo Tiny, ASUS PN series, Zotac ZBOX, and System76 Meerkat. Raspberry Pi and ODROID are advanced/custom options requiring optimization.

## Pages 95-99 - Device and Platform Technical Requirements

Mandatory general requirements for all platforms: stable internet connection, recommended 20Mbps+, hardware acceleration for MP4 H.264/H.265, HTML animations, Canvas/WebGL rendering, modern browser engine or WebView for VAST XML parsing, HTML ZIP rendering, URL creatives, DV360 programmatic ads, and accurate date/time with NTP auto-sync.

Android TV and Android Media Player minimum: Android 11, WebView 120+, 4GB RAM, 32GB storage, quad-core CPU, basic Mali or Adreno GPU. Recommended for heavy HTML and VAST: Android 11 or 12, 3-4GB RAM, 32GB storage, octa-core CPU, Mali-G52 or better. Required features include auto-boot, auto-launch, RTC clock support, hardware decoding, and stable WiFi or LAN. Supported formats include VAST ads, DV360 ads, web URLs, HTML/ZIP, and MP4.

LG webOS: supported webOS 4.1 and 6.0, Web Engine 2.0+, model-dependent 4GB RAM, 32GB internal storage recommended. Limitations include heavy HTML lag, VAST requiring custom player, no Google WebView, and partial DV360 support.

Samsung Tizen: supported Tizen 6.5 and 7.0, minimum Tizen 4.0 and model-dependent 4GB RAM. Limitations include slower browser engine, heavy HTML lag, VAST requiring SDK integration, and partial DV360 support.

Windows: minimum Windows 10, 8GB RAM, dual-core CPU. Recommended Windows 11, 8GB RAM, SSD, Intel i3/i5 or higher. Windows offers full HTML, VAST, ZIP HTML, DV360, and MP4 support and is the best performance platform for programmatic-heavy networks.

Programmatic recommendation: for DV360/VAST-heavy networks, prefer Windows Player first and Android 11/12 media players second. Avoid Android 10 and below because they do not properly support programmatic formats.

## Pages 100-102 - Linux Installation and Troubleshooting

Linux AppImage setup: place the AppImage in a chosen directory, grant execute permission using chmod +x, launch the application, then pair the device with CMS using the verification code. Common Linux issues: permission denied requires chmod +x, app not launching may require libfuse2, black screen may indicate GPU acceleration issue, verification not showing may indicate firewall/network issue. Best compatibility is Ubuntu 22.04 LTS.
