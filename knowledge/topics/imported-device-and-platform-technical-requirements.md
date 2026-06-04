# Device & Platform Technical Requirements

Source document: `Device+&+Platform+Technical+Requirements.doc`

# Device & Platform Technical Requirements
This page outlines the mandatory requirements and recommended specifications for devices running MW Content, including compatibility with HTML, MP4, ZIP, VAST, and programmatic ads (e.g., DV360).
Use this as a reference for device onboarding, procurement, troubleshooting, and client communication.
# 1. General Mandatory Requirements (All Platforms)
These requirements apply to every device type regardless of OS or hardware specifications.
### Stable Internet Connection (Mandatory)
- Minimum: 10 Mbps
- Recommended: 20 Mbps+
- Reason: Programmatic ads (VAST/HTML) load from remote servers; requires consistent bandwidth.
### Hardware Acceleration (Mandatory)
- Device must support accelerated decoding for:
- MP4 H.264 / H.265
- HTML animations
- Canvas/WebGL rendering
### Modern Browser Engine / WebView (Mandatory)
- Required for:
- VAST XML parsing
- HTML ZIP rendering
- URL-based creatives
- DV360 programmatic ads
### Accurate Date & Time (Mandatory)
- Critical for:
- VAST impression tracking
- Scheduling accuracy
- Campaign delivery logic
- NTP auto-sync recommended
# 2. Android TV & Android Media Players
### Minimum Requirements
- Android 11
- WebView 120+
- 4 GB RAM
- 32 GB Storage
- CPU: Quad-core
- GPU: Basic Mali / Adreno
### Recommended Specs (For heavy HTML & VAST)
- Android 11 or 12
- 3–4 GB RAM
- 32 GB Storage
- Octa-core CPU
- GPU: Mali-G52 or better
### Mandatory Features
- Auto-boot
- Auto-launch application
- RTC clock support
- Hardware decoding (H.264 / H.265)
- Stable WiFi or LAN
### Supported Formats
✔ VAST Ads
✔ DV360 Ads
✔ Web URLs
✔ HTML / ZIP
✔ MP4 (Full HD / Animation)
# 3. LG webOS (Signage Versions Only)
### Supported Versions
- LG webOS 4.1
- LG webOS 6.0
### Minimum Requirements
- Web Engine 2.0+
- 4 GB RAM (model dependent)
- 32 GB internal storage
### Recommended Models
- LG webOS 4.0+
- Latest SOC models
### Limitations
- Heavy HTML may lag
- VAST not natively supported → requires custom player
- No Google WebView
- DV360 HTML5 creatives may partially fail
### Supported Formats
✔ Web URLs
✔ Lightweight HTML
✔ MP4
⚠ ZIP HTML (must be optimized & unzipped)
⚠ VAST (custom player required)
❌ DV360 complex creatives (limited support)
# 4. Samsung Tizen (Smart Signage)
### Supported Versions
- Tizen 6.5
- Tizen 7.0
### Minimum Requirements
- Tizen 4.0
- 4 GB RAM (model dependent)
### Recommended Specs
- Tizen 6.5 or later
### Limitations
- Slower browser engine vs Android
- Heavy HTML may lag
- VAST requires SDK-based integration
- DV360 support varies by creative type
### Supported Formats
✔ Basic HTML
✔ MP4
✔ Web URLs
⚠ ZIP HTML (limited)
⚠ VAST (via SDK)
⚠ DV360 creatives (partial support)
# 5. Windows (10 / 11)
### Minimum Requirements
- Windows 10
- 8 GB RAM
- Dual-core CPU
### Recommended Specs
- Windows 11
- 8 GB RAM
- SSD storage
- Intel i3 / i5 or higher
### Supported Formats
✔ Full HTML compatibility
✔ VAST Ads
✔ ZIP HTML
✔ DV360 creatives
✔ MP4 (1080p / 4K)
✔ Best performance among all platforms
# 6. Programmatic Compatibility Summary
Platform
VAST
URL
HTML
ZIP
DV360
Windows 10/11
✔ Full support
✔
✔
✔
✔ Full support
Android 11+
✔ Full support
✔
✔
✔
✔
Android 10 & below
❌ Not supported
❌ Not supported
❌ Not supported
✔ Limited Offline ZIP only
❌ Not supported
LG webOS
⚠ Limited (custom player)
✔
⚠ Lightweight only
⚠ Optimized only
❌ Partial
Samsung Tizen
⚠ SDK required
✔
⚠ Limited
⚠ Limited
❌ Partial
# 7. Procurement Recommendations
To avoid performance issues, select devices that meet the recommended specifications.
For programmatic-heavy networks (DV360, VAST), prefer:
### Priority 1: Windows Player (Best Performance)
### Priority 2: Android 11 / 12 Media Player
#### Avoid: Android 10 and below
Because they do not support programmatic formats properly.
