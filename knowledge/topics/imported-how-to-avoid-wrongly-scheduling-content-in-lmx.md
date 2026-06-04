# How to Avoid Wrongly Scheduling Content in LMX

Source document: `How+to+Avoid+Wrongly+Scheduling+Content+in+LMX.doc`

# How to Avoid Wrongly Scheduling Content in LMX
## Scenarios to avoid that cause the LMX Black screen issue
### ❌ 1. Bulk Uploading
- Avoid uploading and scheduling multiple pieces of content at once as part of a single “publish” action.
- Uploading too many files at once may cause publishing failures, where the system shows content as published but it fails to reach the LMXC player.
- When the LMXC doesn’t receive content properly or doesn’t sync up correctly, it may result in a black screen on the display.
✅ To avoid this issue: Upload each piece of content individually, the press publish and verifying its playback before adding the next piece of content. See LMX Content Black Screen/Logo Issue for more.
### ❌ 2. Uploading Content but not Publishing
Try to avoid uploading content into the playlist and leaving it unpublished, assuming it will sync automatically/later.
✅ Instead: Always publish the playlist immediately after uploading new content.
### ❌ 3. Scheduling Too Close to the Start Time
- Don’t schedule content at the last minute, expecting it to sync immediately before it plays.
✅ Instead : Schedule content 1-2 day in advance and verify synchronization before the scheduled start time.
- To verify that synchronization is complete, follow these steps:
- Go to the Schedule Content tab.
- Select the appropriate Network, Location, and Playlist.
- Choose the date for when the content is scheduled to play.
- Check the Start Date of the content and ensure the Status is set to “Approved.”
### ❌ 4. Overloading the Playlist with Unchecked Content
Do NOT: Add multiple new content pieces without verifying resolution compatibility, correct file formats, or potential errors.
✅ Instead: Double-check all content before scheduling to ensure proper playback. e.g.
- Resolution - Uploaded content should match the screen resolution.
- Size - Ensure the size are below 50Mb
- File Format - mp4, Jpeg
How to check : go to the selected file > right click > choose properties > Details.
### ❌ 5. Assuming Auto-Sync Will Handle Everything
While auto-sync … you cannot ….
### What Does Auto Sync Normally Do in LMX Content?
The Auto Sync feature in LMX Content is designed to automatically:
- Check for new content or schedule updates assigned to the device.
- Download and cache the latest content files (images, videos, HTML packages, etc.).
- Apply updated schedules to ensure the correct content plays at the correct time.
- Report playback status and device activity back to the CMS at regular intervals.
### What Auto Sync Does Not Handle Automatically
While Auto Sync is helpful, it does not handle everything, such as:
- Manual content verification – It won’t detect incorrect file formats or resolution mismatches.
- Corrupted or missing files – It won’t retry or fix broken packages unless a full sync is triggered.
- Placeholder content issues – If a placeholder is mistakenly scheduled, Auto Sync will still sync it.
- Network interruptions – It won’t resume partial downloads if the network disconnects mid-sync.
- Deleted content cleanup – It won’t automatically remove old or unused content unless specifically triggered.
Do not rely solely on auto-sync to update content without manual verification.
Correct Approach: Manually check that scheduled content has been published in the content info.
Go to schedule content tab, select the network, location and playlist.
Indicate content not publish
✅ Indicate content are publish
## How best to schedule content in CMS
- Login to CMS Platform
- Go to the schedule content page. Select Network, Location and Playlist
- To add new content, go to create
- Select the video/image you want to schedule
- After select the video/image, click “create schedule”
- Then please put the content details like duration, start/end date, daypart or spot and click “Save”.
- After Saving please “Approve” the content by clicking “yes”.
- After that there is one popup showing that “You just need do one more step, Just click publish and see your changes in screen” Please click the publish button.
- You can verify whether the publishing process was successful by checking the “Last published at:” status at the top of the page and in the scheduled content status.
- Next, if you want to add sub content, you can click “Edit”
- Go to “Sub Content”
- Select the content you want to add and click “Add Sub Content”
- If you want to add more sub content just click “Add Sub Content”, select the content and then “add”. When you are finished , click “update” and then approve
- After you have approved, there is one more popup showing that “You just need do one more step, Just click publish and see your changes in screen” Please click the “Publish” button.
Basically, every time you schedule content, you need to publish and verify it before scheduling another piece of content. This will help avoid the black screen or LMX logo issue, especially in locations with an unstable internet or network connection.
## To Avoid the Black Screen Error Summary
Scheduling content in phases helps prevent synchronization issues, especially in locations with unstable internet connections. Instead of uploading and scheduling all content at once, follow these steps:
#### 1. Upload and Publish One Content at a Time
- Upload a single piece of content to the playlist.
- Publish the playlist immediately after uploading each content.
- Verify that the content is properly displayed before proceeding to the next upload.
#### 2. Avoid Bulk Uploading and Scheduling
- Do not upload and schedule multiple pieces of content at once.
- Large uploads can overwhelm the system, leading to incomplete synchronization or black screen issues.
- Instead, divide uploads into smaller batches and publish them incrementally.
#### 3. Verify After Each Scheduling Step
- After scheduling a piece of content, check if it appears in the playlist correctly.
- Ensure that it is published and synchronized with the player before adding the next item.
#### 4. Monitor Network Stability
- If the internet connection is slow or unstable, avoid scheduling large files or multiple updates at once.
- Consider scheduling during non-peak hours when network traffic is lower.
#### 5. Manually Refresh and Confirm Sync
- Even if the system auto-syncs, manually check if the scheduled content is displaying as expected.
- Refresh the playlist and verify content playback on the player.
## Possible Causes:
- Unstable Internet Connection/Network:
- An unstable internet connection or network issues can cause problems during synchronization between the player and the server, potentially leading to a black screen.
- Sometimes, this issue can occur when uploading too much content over a slow internet connection.
- Graphics Driver Incompatibility:
- Outdated or incompatible graphics drivers can cause rendering issues leading to a black screen.
- Insufficient System Resources:
- Low RAM, high CPU usage, or limited GPU memory can cause the application to fail to render the interface correctly.
- Software Conflicts:
- Third-party software, including antivirus programs and overlays (e.g., Discord, NVIDIA ShadowPlay), may interfere with LMX and cause display issues.
- Incorrect Display:
- An unsupported resolution or incorrect file format uploaded into the LMX content playlist can prevent proper rendering.
- This is an example of a file with an incorrect resolution or format. It will not display a preview image.
- Operating System Updates or Incompatibility:
- Recent OS updates may introduce compatibility issues with LMX, causing display problems.
- Outdated Application:
- Using an outdated version of the application can cause compatibility issues, missing bug fixes, or failure to load critical components, resulting in a black screen.
- Playlist Configuration:
- Incorrect content settings, daypart/spot/day preferences, or start/end date configurations can cause the black screen issue.
## Things to Do If You Have a Network Issue:
- Avoid scheduling multiple pieces of content at once without verifying that the previous content has been successfully published.
- Do not schedule all content in bulk without checking for successful synchronization, especially if the network is unstable.
- Do not leave content unpublished after uploading, as it may not sync properly with the player.
- Do not rely solely on auto-sync, especially when dealing with a weak internet connection. Always manually verify that the content has been published.
## Resolution Steps:
- Update Graphics Drivers:
- Ensure that the GPU drivers are up to date (NVIDIA, AMD, or Intel).
- Verify Integrity of Installation Files:
- Reinstall LMX or use a file verification tool if available.
- Check System Resources:
- Close unnecessary applications to free up RAM and CPU.
- Disable Conflicting Software:
- Temporarily disable overlays, antivirus software, and background applications.
- Check OS Compatibility:
- If the issue started after an OS update, try running LMX in compatibility mode or rolling back the update.
- Improve Network Stability:
- Ensure a stable internet connection, restart the router, or switch to a wired connection if possible.
- Check Content in the Playlist:
- Make sure all content uses the correct resolution and file format.
- Update Order and Republish Playlist:
- When uploading content into the playlist, publish the playlist after uploading each piece of content to avoid network issues rather than publishing bulk content in one shot.
- Ensure that the playlist is published. If changes have been made, re-publish the playlist, update the order, and save the changes.
- Update the Application:
- Check for the latest version of LMX and update to ensure all bug fixes and compatibility improvements are applied.
- Check Playlist Content Configuration:
- Verify the playlist content setup, including spot, daypart, day preferences, repeat settings, and start/end dates for each piece of content.
- Upload and Publish Content Individually:
- Instead of uploading and scheduling multiple pieces of content at once, upload and publish each piece individually.
- This helps prevent data loss or incomplete synchronization due to a weak network.
- Schedule Content in Phases:
- Avoid scheduling multiple pieces of content all at once.
- Instead, schedule a few at a time and confirm their successful publication before adding more.
- Step and Guides here.
- Here are the thing need to avoid.
## Additional Support:
If the issue persists, users should report the problem to LMX Content support and grant remote access (e.g., AnyDesk, TeamViewer). They should also provide system logs, error messages, and details of recent changes to their system.
