export type SourceLink = { label: string; url: string };

export type CommonQuestion = {
  question: string;
  answer: string;
  sourceLinks?: SourceLink[];
};

export const commonQuestions: CommonQuestion[] = [
  {
    question: "How do I schedule content?",
    answer:
      "Schedule Content\n\nNavigate to Dashboard > Schedule Content. Select the Network, Location, and Playlist.\n\nKey steps\n- Configure date and time\n- Save the schedule\n- Approve content\n- Publish content\n- Remember: content will not play until it is published",
    sourceLinks: [
      { label: "How to Schedule Content", url: "https://movingwallshub.atlassian.net/wiki/x/0IKKCQ" }
    ]
  },
  {
    question: "Why is the Default Playlist showing?",
    answer:
      "Default Playlist Showing\n\nDefault Playlist appears when scheduled or targeted content is not available for playback.\n\nKey checks\n- Check if there is no active schedule\n- Check if the campaign expired\n- Check if content was published\n- Check if impression cap was reached\n- Check synchronization status\n- Check device online status",
    sourceLinks: [
      { label: "Default Playlist Guide", url: "https://movingwallshub.atlassian.net/wiki/x/h4KKCQ" }
    ]
  },
  {
    question: "Client reports black screen. What should I check?",
    answer:
      "Black Screen\n\nBlack screen can come from device, CMS, content, storage, network, or display issues.\n\nKey checks\n- Check device online status\n- Check playlist assignment\n- Check publish status\n- Check HDMI/display connection\n- Check supported media format\n- Check device storage availability",
    sourceLinks: [
      { label: "LMX Troubleshooting Guide", url: "https://movingwallshub.atlassian.net/wiki/x/VweMCQ" },
      { label: "Black Screen / Logo Issue Guide", url: "https://movingwallshub.atlassian.net/wiki/x/SQiMCQ" }
    ]
  },
  {
    question: "What is the recommended Android specification?",
    answer:
      "Android Specification\n\nRecommended Android hardware improves playback stability, HTML rendering, and VAST support.\n\nRecommended\n- Android 11+\n- 8GB RAM / 128GB Storage\n- 64-bit\n- Quad-core CPU\n\nMinimum\n- 4GB RAM / 64GB Storage",
    sourceLinks: [
      { label: "System Requirements", url: "https://movingwallshub.atlassian.net/wiki/x/cgqMCQ" },
      { label: "Recommended Android Devices", url: "https://movingwallshub.atlassian.net/wiki/x/hwqMCQ" }
    ]
  },
  {
    question: "Can 2GB RAM Android devices support LMX Content?",
    answer:
      "2GB Android Devices\n\n2GB RAM Android devices may support basic playback only, but they are not recommended for production use.\n\nLimitations\n- Unstable HTML rendering\n- VAST issues\n- Black screen risk\n- Slow synchronization\n- Not recommended for programmatic campaigns, heavy HTML, or split layouts",
    sourceLinks: [
      { label: "System Requirements", url: "https://movingwallshub.atlassian.net/wiki/x/cgqMCQ" },
      { label: "Recommended Android Devices", url: "https://movingwallshub.atlassian.net/wiki/x/hwqMCQ" }
    ]
  },
  {
    question: "Why is old content still showing?",
    answer:
      "Old Content Still Showing\n\nOld content usually means the device has not received or applied the latest update.\n\nPossible causes\n- Device offline\n- Synchronization failed\n- Content not published\n- Cached content still active\n\nRecommended action\n- Republish content\n- Verify synchronization\n- Restart player if necessary",
    sourceLinks: [
      { label: "Old Content Still Playing – RCA", url: "https://movingwallshub.atlassian.net/wiki/x/CAqMCQ" },
      { label: "LMX Troubleshooting Guide", url: "https://movingwallshub.atlassian.net/wiki/x/VweMCQ" }
    ]
  },
  {
    question: "Why is the device offline?",
    answer:
      "Device Offline\n\nA device is offline when it is not communicating with CMS.\n\nPossible causes\n- Internet instability\n- Firewall restriction\n- Player stopped\n- Device powered off\n\nKey checks\n- Internet connection\n- Player application status\n- Firewall/network access",
    sourceLinks: [
      { label: "LMX Troubleshooting Guide", url: "https://movingwallshub.atlassian.net/wiki/x/VweMCQ" },
      { label: "Fluctuating Online/Offline Status Guide", url: "https://movingwallshub.atlassian.net/wiki/x/hA6MCQ" }
    ]
  },
  {
    question: "How do I pair a new device?",
    answer:
      "Device Pairing\n\nPairing links the physical player to the CMS device record.\n\nKey steps\n- Create Device\n- Install Player\n- Launch Player\n- Generate Verification Code\n- Pair Device\n- Remember: verification codes are one-time use only",
    sourceLinks: [
      { label: "Create a Device", url: "https://movingwallshub.atlassian.net/wiki/x/sIGKCQ" }
    ]
  },
  {
    question: "Why is content uploaded but not playing?",
    answer:
      "Uploaded Content Not Playing\n\nUploaded content will not play until it is assigned, scheduled, approved, and published.\n\nPossible causes\n- Playlist not assigned\n- Schedule missing\n- Content not published\n- Unsupported format\n\nKey checks\n- Playlist\n- Schedule\n- Publish status\n- Media compatibility",
    sourceLinks: [
      { label: "Unable to Publish – Error Guide", url: "https://movingwallshub.atlassian.net/wiki/x/zwCXDw" },
      { label: "How to Schedule Content", url: "https://movingwallshub.atlassian.net/wiki/x/0IKKCQ" }
    ]
  },
  {
    question: "What formats are supported?",
    answer:
      "Supported Formats\n\nOnly supported formats should be uploaded and scheduled for playback.\n\nSupported\n- MP4\n- PNG\n- JPEG\n- GIF\n- MP3\n- PDF\n- HTML5 ZIP\n\nUnsupported formats may fail playback.",
    sourceLinks: [
      { label: "System Requirements", url: "https://movingwallshub.atlassian.net/wiki/x/cgqMCQ" },
      { label: "Device & Platform Technical Requirements", url: "https://movingwallshub.atlassian.net/wiki/x/aoCTDw" }
    ]
  },
  {
    question: "How do I generate Playlogs?",
    answer:
      "Generate Playlogs\n\nUse Playlog to export playback records for reporting and verification.\n\nKey steps\n- Go to Dashboard > Playlog\n- Select date range\n- Select device\n- Select content filter\n- Click Get Log",
    sourceLinks: [
      { label: "Playlogs (General & Device Level)", url: "https://movingwallshub.atlassian.net/wiki/x/04GKCQ" },
      { label: "Generate Device Playlog", url: "https://movingwallshub.atlassian.net/wiki/x/5giMCQ" }
    ]
  },
  {
    question: "Why are Playlogs missing?",
    answer:
      "Missing Playlogs\n\nMissing playlogs usually mean playback did not happen, the device did not sync, or the report range is incorrect.\n\nPossible causes\n- Device offline\n- Playback not triggered\n- Synchronization delay\n- Player stopped\n\nImportant\n- General Playlog = 30 days limit",
    sourceLinks: [
      { label: "Playlogs (General & Device Level)", url: "https://movingwallshub.atlassian.net/wiki/x/04GKCQ" },
      { label: "Missing Playlog (Windows)", url: "https://movingwallshub.atlassian.net/wiki/x/KQqMCQ" }
    ]
  },
  {
    question: "Why is VAST or URL content not playing?",
    answer:
      "VAST or URL Not Playing\n\nVAST and URL playback depend on platform support, WebView/browser compatibility, internet, and creative delivery.\n\nPossible causes\n- Outdated WebView\n- SSP no-fill\n- Unsupported creative\n- Unstable internet\n\nRecommended\n- Android 11+\n- WebView Version 100+",
    sourceLinks: [
      { label: "Schedule URL & Google IMA (VAST)", url: "https://movingwallshub.atlassian.net/wiki/x/AQCXDw" }
    ]
  },
  {
    question: "How do I update the player application?",
    answer:
      "Update Player Application\n\nInstall the new version directly without uninstalling the previous version.\n\nPurpose\n- Preserves device pairing\n- Preserves cache\n- Preserves configuration",
    sourceLinks: [
      { label: "Installation Guide (Android & Windows)", url: "https://movingwallshub.atlassian.net/wiki/x/AoCTDw" },
      { label: "Download MW Content App", url: "https://movingwallshub.atlassian.net/wiki/x/V4CTDw" }
    ]
  },
  {
    question: "Why can't a user access certain features?",
    answer:
      "User Feature Access\n\nFeature access depends on role, permissions, account status, and network restrictions.\n\nPossible causes\n- Incorrect role assignment\n- Insufficient permissions\n- Network restriction\n\nKey checks\n- User role\n- Assigned permissions\n- Account status",
    sourceLinks: [
      { label: "How to Create a User", url: "https://movingwallshub.atlassian.net/wiki/x/FIOKCQ" },
      { label: "User Roles & Permissions", url: "https://movingwallshub.atlassian.net/wiki/x/KIOKCQ" }
    ]
  },
  {
    question: "Why is content synchronization slow?",
    answer:
      "Slow Content Synchronization\n\nSlow sync can be caused by network, file size, storage, or device performance.\n\nPossible causes\n- Unstable internet\n- Oversized content\n- Storage limitation\n- Weak hardware\n\nRecommended\n- Optimize media files\n- Use stable internet\n- Verify storage availability",
    sourceLinks: [
      { label: "Content Not Syncing in CMS", url: "https://movingwallshub.atlassian.net/wiki/x/4QmMCQ" },
      { label: "LMX Troubleshooting Guide", url: "https://movingwallshub.atlassian.net/wiki/x/VweMCQ" }
    ]
  },
  {
    question: "What causes black screen during HTML playback?",
    answer:
      "HTML Black Screen\n\nHTML playback needs enough device resources and an updated rendering engine.\n\nPossible causes\n- Low RAM device\n- Outdated WebView\n- Unsupported HTML\n- Oversized ZIP package\n\nRecommended\n- Android 11+\n- 4GB RAM minimum\n- Updated WebView",
    sourceLinks: [
      { label: "Black Screen / Logo Issue Guide", url: "https://movingwallshub.atlassian.net/wiki/x/SQiMCQ" },
      { label: "LMX Troubleshooting Guide", url: "https://movingwallshub.atlassian.net/wiki/x/VweMCQ" }
    ]
  },
  {
    question: "How do I restart Windows player pairing?",
    answer:
      "Restart Windows Player Pairing\n\nUse Ctrl + L on the Windows player.\n\nPurpose\n- Logs out the player\n- Resets pairing\n- Allows the device to be paired again",
    sourceLinks: [
      { label: "Create a Device", url: "https://movingwallshub.atlassian.net/wiki/x/sIGKCQ" }
    ]
  },
  {
    question: "Why is the device online but not updating?",
    answer:
      "Device Online but Not Updating\n\nAn online device may still fail to update if sync, storage, publish, or internet stability has an issue.\n\nPossible causes\n- Synchronization failure\n- Storage full\n- Publish incomplete\n- Internet instability\n\nKey checks\n- Synchronization status\n- Publish status\n- Device storage",
    sourceLinks: [
      { label: "LMX Troubleshooting Guide", url: "https://movingwallshub.atlassian.net/wiki/x/VweMCQ" },
      { label: "Fluctuating Online/Offline Status Guide", url: "https://movingwallshub.atlassian.net/wiki/x/hA6MCQ" }
    ]
  },
  {
    question: "What is the purpose of Default Playlist?",
    answer:
      "Default Playlist Purpose\n\nDefault Playlist acts as fallback playback content.\n\nUsed when\n- No active campaign\n- Failed synchronization\n- No-fill programmatic response\n- Schedule expired",
    sourceLinks: [
      { label: "Default Playlist Guide", url: "https://movingwallshub.atlassian.net/wiki/x/h4KKCQ" }
    ]
  },
  {
    question: "What version supports Pull To Content?",
    answer:
      "Pull To Content Supported Version\n\nSupported versions:\n- Windows = 10.0.34 and above\n- Android = 2.9.1.2 Native and above\n\nBefore using Pull To Content, ensure:\n- Device is already paired with LMX Inventory\n- Pull To Content feature is enabled\n- Device is online and synchronized\n\nIf pairing or feature enablement is not correct:\n- Pull To Content may not trigger\n- Inventory synchronization may fail\n- Playback requests may not be received",
    sourceLinks: [
      { label: "LMX Content – Pull To Content", url: "https://movingwallshub.atlassian.net/wiki/x/FICAEQ" }
    ]
  }
];
