# Guide - How to stream youtube link in LMX Content

Source document: `Guide+-+How+to+stream+youtube+link+in+LMX+Content.doc`

# Guide - How to stream youtube link in LMX Content
For your information, as of now, LMX Content can only live stream from YouTube.
Live streaming from other platforms like Facebook, Instagram, TikTok, etc., is still not supported in LMX Content.
### Step 1: Copy the original YouTube link
Example:
https://www.youtube.com/watch?v=91RYS-QHtz4
### Step 2: Identify the Video ID
Look at the last part of the link or after ?v= in the link:
Example:
www.youtube.com/watch?v=91RYS-QHtz4
91RYS-QHtz4
That’s your Video ID.
### Step 3: Use the YouTube embed base URL
Start with this format:
https://www.youtube.com/embed/VIDEO_ID
Replace VIDEO_ID with 91RYS-QHtz4:
https://www.youtube.com/embed/91RYS-QHtz4
### Step 4: Add autoplay and other parameters
To make the video autoplay, muted, and cleaner, add this to the end of the URL:
?autoplay=1&mute=1&rel=0&showinfo=0
- autoplay=1 → The video will start playing automatically when the page loads.
- mute=1 → The video will start muted (no sound).
- rel=0 → After the video ends, no related videos (or only videos from the same channel) will be shown.
- showinfo=0 → Hide video title and uploader info at the beginning (note: YouTube changed how this behaves; it's mostly controlled differently now).
So your final URL becomes:
https://www.youtube.com/embed/91RYS-QHtz4?autoplay=1&mute=1&rel=0&showinfo=0
## How to Schedule URL
### Step 1: Select “Schedule Content” on the dashboard.
### Step 2: Select Network and Location.
### Step 3: Select “create” in the right conner
### Step 4: Select Widget
### Step 5: Select “URL”
- Fill the URL name that will appear in the Schedule content dashboard.
- Use the final URL to schedulein the URL box.
- Please set the duration of the live screen in seconds. If you're not sure how long the live broadcast will be, just set it to 99999. Make sure to remove the link once the live stream has ended.
- Save and Select for content approval
- Click Publish
## Important Notes
Scheduling a URL link in LMX Content will result in the content being streamed each time it plays. This will consume internet bandwidth continuously. Please ensure that the internet connection at the location has sufficient data capacity to support this, in order to avoid playback issues or interruptions.
