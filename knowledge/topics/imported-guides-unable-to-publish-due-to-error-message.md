# Guides - Unable to Publish due to error Message

Source document: `Guides+-+Unable+to+Publish+due+to+error+Message.doc`

# Guides - Unable to Publish due to error Message
Error Message:
“Before creating a schedule, please ensure that at least one image schedule is added to the default playlist.”
## Problem Explanation
This error appears when attempting to publish a playlist without meeting the CMS scheduling requirement.
To successfully publish, the Default Playlist must have:
- At least one video content scheduled
- At least one image content scheduled
## Solution Steps
- Login to CMS Platform
- Go to the setup>Default Playlist.
- To add new content, go to create
- Select the video/image you want to schedule
- After select the video/image, click “create schedule”
- Then please put the content details like duration, start/end date, daypart or spot and click “Save”.
- After Saving please “Approve” the content by clicking “yes”.
### Tips & Best Practices
Do
Don’t
Schedule at least one image and one video in the Default Playlist
Leave uploaded content unscheduled
Verify the content appears on the player after publishing
Assume uploading alone is sufficient
Use valid formats: .mp4, .jpg, .png
Upload unsupported formats (e.g., PSD, AVI)
### Example Scenario
If you're trying to schedule an ad playlist and see this error, go back and check the Default Playlist. Even if you previously added content, it may not be scheduled properly. The system will block all further publishing until the minimum requirement is met.
