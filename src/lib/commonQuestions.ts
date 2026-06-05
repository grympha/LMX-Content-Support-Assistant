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
      "How do I schedule content?\n\nNavigate to Dashboard → Schedule Content. Select the Network, Location, and Playlist. Configure the schedule date and time, save the schedule, approve the content, and publish it.\n\nRecommendation\n- Verify the correct playlist is selected.\n- Verify schedule date and time are correct.\n- Verify content is approved.\n- Verify content has been published.\n- Remember: content will not play until it is published.",
    sourceLinks: [
      { label: "How to Schedule Content", url: "https://movingwallshub.atlassian.net/wiki/x/0IKKCQ" }
    ]
  },
  {
    question: "Why is the Default Playlist showing?",
    answer:
      "Why is the Default Playlist showing?\n\nThe Default Playlist appears when no valid scheduled or targeted content is available for playback.\n\nBasic Troubleshooting\n- Check if there is an active schedule.\n- Check if content has been published.\n- Check if the campaign has expired.\n- Check if impression cap has been reached.\n- Check device online status.\n- Check synchronization status.\n- Check if the playlist contains active content.",
    sourceLinks: [
      { label: "Default Playlist Guide", url: "https://movingwallshub.atlassian.net/wiki/x/h4KKCQ" }
    ]
  },
  {
    question: "Client reports a black screen. What should I check?",
    answer:
      "Client reports a black screen. What should I check?\n\nA black screen can be caused by device, CMS, content, display, storage, or network issues.\n\nBasic Troubleshooting\n- Verify device is online.\n- Verify playlist is assigned.\n- Verify content is published.\n- Check HDMI/display connection.\n- Check available storage.\n- Restart the player application.\n- Verify screen power status.",
    sourceLinks: [
      { label: "LMX Troubleshooting Guide", url: "https://movingwallshub.atlassian.net/wiki/x/VweMCQ" },
      { label: "Black Screen / Logo Issue Guide", url: "https://movingwallshub.atlassian.net/wiki/x/SQiMCQ" }
    ]
  },
  {
    question: "What is the recommended Android specification?",
    answer:
      "What is the recommended Android specification?\n\nRecommended specification:\n- Android 11+\n- 4GB RAM\n- 32GB Storage\n- Quad-Core CPU\n- 64-bit Architecture\n\nFor Programmatic/VAST:\n- Android 11+\n- 8GB RAM\n- 64GB Storage\n- Updated WebView\n\nRecommendation\n- Use Android 11+ for production deployments.\n- Use 8GB RAM for VAST, HTML, and programmatic campaigns.\n- Avoid low-spec devices for commercial environments.",
    sourceLinks: [
      { label: "System Requirements", url: "https://movingwallshub.atlassian.net/wiki/x/cgqMCQ" },
      { label: "Recommended Android Devices", url: "https://movingwallshub.atlassian.net/wiki/x/hwqMCQ" }
    ]
  },
  {
    question: "Can 2GB RAM Android devices support LMX Content?",
    answer:
      "Can 2GB RAM Android devices support LMX Content?\n\nYes, 2GB RAM devices can support basic image and video playback.\n\nSuitable for:\n- Images\n- Basic MP4 videos\n- Simple scheduling\n\nNot recommended for:\n- HTML content\n- VAST campaigns\n- Programmatic campaigns\n- Multi-zone layouts\n\nFor production deployments, use at least 4GB RAM.",
    sourceLinks: [
      { label: "System Requirements", url: "https://movingwallshub.atlassian.net/wiki/x/cgqMCQ" },
      { label: "Recommended Android Devices", url: "https://movingwallshub.atlassian.net/wiki/x/hwqMCQ" }
    ]
  },
  {
    question: "Why is old content still showing?",
    answer:
      "Why is old content still showing?\n\nThe device may not have received or applied the latest content update.\n\nBasic Troubleshooting\n- Republish content.\n- Verify synchronization status.\n- Verify device is online.\n- Restart the player application.",
    sourceLinks: [
      { label: "Old Content Still Playing – RCA", url: "https://movingwallshub.atlassian.net/wiki/x/CAqMCQ" },
      { label: "LMX Troubleshooting Guide", url: "https://movingwallshub.atlassian.net/wiki/x/VweMCQ" }
    ]
  },
  {
    question: "Why is the device offline?",
    answer:
      "Why is the device offline?\n\nThe CMS is unable to communicate with the device.\n\nBasic Troubleshooting\n- Check internet connectivity.\n- Verify player application is running.\n- Restart device.\n- Check firewall or network restrictions.",
    sourceLinks: [
      { label: "LMX Troubleshooting Guide", url: "https://movingwallshub.atlassian.net/wiki/x/VweMCQ" },
      { label: "Fluctuating Online/Offline Status Guide", url: "https://movingwallshub.atlassian.net/wiki/x/hA6MCQ" }
    ]
  },
  {
    question: "How do I pair a new device?",
    answer:
      "How do I pair a new device?\n\nCreate a device in CMS, install the player, launch the application, generate a verification code, and pair the device.\n\nRecommendation\n- Verification codes are one-time use only.\n- Ensure the device is online before pairing.",
    sourceLinks: [
      { label: "Create a Device", url: "https://movingwallshub.atlassian.net/wiki/x/sIGKCQ" }
    ]
  },
  {
    question: "Why is content uploaded but not playing?",
    answer:
      "Why is content uploaded but not playing?\n\nUploading content alone does not start playback. Content must be assigned, scheduled, approved, and published.\n\nBasic Troubleshooting\n- Verify playlist assignment.\n- Verify schedule exists.\n- Verify content approval status.\n- Verify publish status.\n- Verify media format compatibility.",
    sourceLinks: [
      { label: "Unable to Publish – Error Guide", url: "https://movingwallshub.atlassian.net/wiki/x/zwCXDw" },
      { label: "How to Schedule Content", url: "https://movingwallshub.atlassian.net/wiki/x/0IKKCQ" }
    ]
  },
  {
    question: "What formats are supported?",
    answer:
      "What formats are supported?\n\nSupported formats:\n- MP4\n- PNG\n- JPG/JPEG\n- GIF\n- MP3\n- PDF\n- HTML5 ZIP\n- URL\n- VAST\n\nRecommendation\n- Use MP4 with H.264 encoding.\n- Optimize media file sizes.\n- Verify URL content is publicly accessible.\n- Test HTML5 ZIP content before production deployment.",
    sourceLinks: [
      { label: "System Requirements", url: "https://movingwallshub.atlassian.net/wiki/x/cgqMCQ" },
      { label: "Device & Platform Technical Requirements", url: "https://movingwallshub.atlassian.net/wiki/x/aoCTDw" }
    ]
  },
  {
    question: "How do I generate Playlogs?",
    answer:
      "How do I generate Playlogs?\n\nNavigate to Dashboard → Playlog, select the date range, device, and content filter, then click Get Log.\n\nRecommendation\n- Verify the correct date range is selected.\n- Verify the correct device is selected.",
    sourceLinks: [
      { label: "Playlogs (General & Device Level)", url: "https://movingwallshub.atlassian.net/wiki/x/04GKCQ" },
      { label: "Generate Device Playlog", url: "https://movingwallshub.atlassian.net/wiki/x/5giMCQ" }
    ]
  },
  {
    question: "Why are Playlogs missing?",
    answer:
      "Why are Playlogs missing?\n\nPlayback may not have occurred or the device may not have synchronized successfully.\n\nBasic Troubleshooting\n- Verify device online status.\n- Verify playback occurred.\n- Verify synchronization status.\n- Check the selected date range.",
    sourceLinks: [
      { label: "Playlogs (General & Device Level)", url: "https://movingwallshub.atlassian.net/wiki/x/04GKCQ" },
      { label: "Missing Playlog (Windows)", url: "https://movingwallshub.atlassian.net/wiki/x/KQqMCQ" }
    ]
  },
  {
    question: "Why is VAST or URL content not playing?",
    answer:
      "Why is VAST or URL content not playing?\n\nVAST and URL playback depend on internet connectivity, WebView compatibility, and creative availability.\n\nBasic Troubleshooting\n- Verify internet connectivity.\n- Verify the VAST URL is accessible.\n- Verify Android System WebView version.\n- Verify creative content is available.\n- Verify device date and time settings.",
    sourceLinks: [
      { label: "Schedule URL & Google IMA (VAST)", url: "https://movingwallshub.atlassian.net/wiki/x/AQCXDw" }
    ]
  },
  {
    question: "How do I update the player application?",
    answer:
      "How do I update the player application?\n\nInstall the latest version directly over the existing version without uninstalling the current application.\n\nAndroid:\n- Download the latest APK.\n- Install the APK.\n- Do NOT uninstall the existing version.\n- Launch the player.\n\nWindows:\n- Download the latest installer.\n- Run the installer.\n- Complete installation.\n- Launch the player.\n\nUpdating preserves:\n- Device pairing\n- Configuration\n- Cached content",
    sourceLinks: [
      { label: "Installation Guide (Android & Windows)", url: "https://movingwallshub.atlassian.net/wiki/x/AoCTDw" },
      { label: "Download MW Content App", url: "https://movingwallshub.atlassian.net/wiki/x/V4CTDw" }
    ]
  },
  {
    question: "Why can't a user access certain features?",
    answer:
      "Why can't a user access certain features?\n\nFeature access depends on user role and permissions.\n\nBasic Troubleshooting\n- Verify user role assignment.\n- Verify assigned permissions.\n- Verify account status.",
    sourceLinks: [
      { label: "How to Create a User", url: "https://movingwallshub.atlassian.net/wiki/x/FIOKCQ" },
      { label: "User Roles & Permissions", url: "https://movingwallshub.atlassian.net/wiki/x/KIOKCQ" }
    ]
  },
  {
    question: "Why is content synchronization slow?",
    answer:
      "Why is content synchronization slow?\n\nSlow synchronization is usually caused by internet, storage, file size, or hardware limitations.\n\nBasic Troubleshooting\n- Verify internet speed.\n- Check available storage.\n- Reduce content file size.\n- Verify device performance.",
    sourceLinks: [
      { label: "Content Not Syncing in CMS", url: "https://movingwallshub.atlassian.net/wiki/x/4QmMCQ" },
      { label: "LMX Troubleshooting Guide", url: "https://movingwallshub.atlassian.net/wiki/x/VweMCQ" }
    ]
  },
  {
    question: "What causes black screen during HTML playback?",
    answer:
      "What causes black screen during HTML playback?\n\nHTML content requires sufficient device resources and an updated WebView engine.\n\nBasic Troubleshooting\n- Verify WebView version.\n- Verify device RAM.\n- Verify HTML ZIP package integrity.\n- Test content on another device.",
    sourceLinks: [
      { label: "Black Screen / Logo Issue Guide", url: "https://movingwallshub.atlassian.net/wiki/x/SQiMCQ" },
      { label: "LMX Troubleshooting Guide", url: "https://movingwallshub.atlassian.net/wiki/x/VweMCQ" }
    ]
  },
  {
    question: "How do I restart Windows player pairing?",
    answer:
      "How do I restart Windows player pairing?\n\nPress Ctrl + L on the Windows player application.\n\nGuide\n- Press Ctrl + L.\n- Generate a new verification code.\n- Pair the device again.",
    sourceLinks: [
      { label: "Create a Device", url: "https://movingwallshub.atlassian.net/wiki/x/sIGKCQ" }
    ]
  },
  {
    question: "Why is the device online but not updating?",
    answer:
      "Why is the device online but not updating?\n\nThe device may be online but unable to synchronize new content.\n\nBasic Troubleshooting\n- Verify synchronization status.\n- Verify publish status.\n- Check available storage.\n- Restart the player application.",
    sourceLinks: [
      { label: "LMX Troubleshooting Guide", url: "https://movingwallshub.atlassian.net/wiki/x/VweMCQ" },
      { label: "Fluctuating Online/Offline Status Guide", url: "https://movingwallshub.atlassian.net/wiki/x/hA6MCQ" }
    ]
  },
  {
    question: "What is the purpose of Default Playlist?",
    answer:
      "What is the purpose of Default Playlist?\n\nThe Default Playlist acts as fallback content when no active campaign or scheduled content is available.\n\nRecommendation\n- Always keep at least one image or video in the Default Playlist.\n- Avoid leaving the Default Playlist empty.",
    sourceLinks: [
      { label: "Default Playlist Guide", url: "https://movingwallshub.atlassian.net/wiki/x/h4KKCQ" }
    ]
  },
  {
    question: "What version supports Pull To Content?",
    answer:
      "What version supports Pull To Content?\n\nSupported versions:\n- Windows 1.0.34 and above\n- Android 2.9.1.2 Native and above\n\nBefore using Pull To Content:\n- Device paired successfully\n- Device mapped to inventory\n- Pull To Content enabled\n- Playlist assigned\n- Device online and synchronized",
    sourceLinks: [
      { label: "LMX Content – Pull To Content", url: "https://movingwallshub.atlassian.net/wiki/x/FICAEQ" }
    ]
  },
  {
    question: "How do I replace a device?",
    answer:
      "How do I replace a device?\n\nReplace Device allows you to migrate an existing CMS device to a new player without recreating the setup.\n\nGuide\n- Install LMX Content on the new device.\n- Generate a verification code.\n- Navigate to Devices.\n- Select the existing device.\n- Click Replace Device.\n- Enter the new verification code.\n- Confirm replacement.\n\nUse Replace Device when:\n- Upgrading hardware\n- Replacing failed devices\n- Migrating to a new player\n\nAvoid deleting and recreating devices whenever possible.",
    sourceLinks: [
      { label: "Replace Devices in LMX Content", url: "https://movingwallshub.atlassian.net/wiki/x/ZA2MCQ" }
    ]
  },
  {
    question: "Why is my content stretched or cropped?",
    answer:
      "Why is my content stretched or cropped?\n\nThis is usually caused by a resolution mismatch between content, layout, and screen.\n\nBasic Troubleshooting\n- Verify layout resolution.\n- Verify content resolution.\n- Verify screen orientation.\n- Verify LED controller settings.",
    sourceLinks: [
      { label: "Device & Platform Technical Requirements", url: "https://movingwallshub.atlassian.net/wiki/x/aoCTDw" },
      { label: "LMX Troubleshooting Guide", url: "https://movingwallshub.atlassian.net/wiki/x/VweMCQ" }
    ]
  },
  {
    question: "Why is my campaign showing in Playlog but not on screen?",
    answer:
      "Why is my campaign showing in Playlog but not on screen?\n\nPlayback was recorded, but the display may have a hardware, connection, or configuration issue.\n\nBasic Troubleshooting\n- Check screen power.\n- Check display connection.\n- Verify layout resolution.\n- Verify display source input.",
    sourceLinks: [
      { label: "LMX Troubleshooting Guide", url: "https://movingwallshub.atlassian.net/wiki/x/VweMCQ" },
      { label: "Black Screen / Logo Issue Guide", url: "https://movingwallshub.atlassian.net/wiki/x/SQiMCQ" }
    ]
  },
  {
    question: "How do I verify if Pull To Content is working?",
    answer:
      "How do I verify if Pull To Content is working?\n\nPull To Content automatically pushes SSP campaigns into playlists.\n\nBasic Troubleshooting\n- Verify inventory mapping.\n- Verify campaign is active.\n- Verify device is online.\n- Verify playlist assignment.\n- Verify synchronization status.",
    sourceLinks: [
      { label: "LMX Content – Pull To Content", url: "https://movingwallshub.atlassian.net/wiki/x/FICAEQ" },
      { label: "Pair LMX Inventory to Devices", url: "https://movingwallshub.atlassian.net/wiki/x/GA6MCQ" }
    ]
  },
  {
    question: "Still Need Help?",
    answer:
      "Still Need Help?\n\nIf the issue persists after troubleshooting, please contact the Moving Walls Support Team.\n\nInformation to Provide\n- Tenant Name\n- Device Name\n- Location Name\n- Screenshot/Error Message\n- Date & Time of Issue\n- Steps already performed\n\nProviding this information helps us investigate and resolve issues faster.",
    sourceLinks: [
      { label: "Moving Walls Hub – Documentation", url: "https://movingwallshub.atlassian.net/wiki/x/mYCKCQ" }
    ]
  }
];
