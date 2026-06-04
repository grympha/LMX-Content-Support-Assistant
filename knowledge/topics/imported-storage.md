# Storage

Source document: `Storage.doc`

# Storage
## Overview
The Storage module in MW Content is the centralized area for uploading, organizing, and managing media files such as videos, images, PDFs, HTML, audio, and widgets. These files can later be assigned to playlists and scheduled for playback across your digital signage network.
Storage is structured by Tenant-Level, Network-Level, and includes a Common Folder to enable content reuse across multiple locations.
## Types of Storage
Storage Type
Description
Tenant Storage
Private storage for your organization. Content here is only accessible to users under the same tenant.
Network Storage
Content stored for specific networks. Useful for separating media by client, region, or branch.
Common Storage
Shared content accessible across networks under the same tenant. Ideal for reusable brand assets or templates.
## Supported File Types
Category
File Extensions
Images
.jpg, .jpeg, .png, .gif
Videos
.mp4, .mov, .avi
Audio
.mp3, .wav
Documents
.pdf, .zip, .html
Web Widgets
URLs, Google IMA, RSS feeds
⚠️ Only supported file types can be added to playlists and scheduled for playback.
## How to Upload Files
- Navigate to: Main Storage Tab
- Click the Upload (⬆) icon in the top right corner
- In the upload pop-up:
Select or drag & drop your files
Choose between:
Upload – Save to storage only
Upload & Schedule – Redirect to content scheduling after upload
Cancel – Abort upload
- Uploaded files will appear immediately in your folder view
## Folder Management
- You can create folders at both Tenant and Network levels for better content organization
- Folder structure is especially useful for separating:
Clients
Brands
Campaigns
Content types (e.g., ads, promos, info)
## File Operations
Action
Function
Preview
See a quick view of uploaded media
Rename
Update file name for clarity
Move
Reorganize into other folders
Delete
Only allowed if the file is not linked to a schedule
Filter
Filter by file type (Image, Video, Audio, Zip, HTML, PDF)
## Widget Scheduling (Advanced)
LMX Content supports scheduling of interactive or dynamic widgets, including:
Widget Type
Description
URL
Schedule external websites for display
Google IMA(VAST)
Serve ads from Google’s interactive ad system
RSS Feed
Display dynamic scrolling news or data
Weather Trigger
Display content based on real-time weather conditions.
These widgets can be scheduled just like media files and assigned to playlists or layouts.
### See Related Guides:
- How to Schedule Content in CMS
- How to Bundle Schedule in CMS
- How to Schedule URL & Google IMA (VAST)
- How to Schedule a Weather Trigger
- How to Schedule Place Exchange Widget
- How to delete content in the CMS Storage
## Best Practices
- Use clear naming conventions (e.g., 2025_Q1_Promo_Video.mp4)
- Separate folders by client, region, or campaign
- Delete unused files periodically to manage storage quota
- Keep frequently used content (logos, intros) in Common Folder
- Only upload optimized file sizes to prevent screen lag
## Restrictions
- Files already scheduled in active playlists cannot be deleted
- Unsupported formats will be rejected during upload
