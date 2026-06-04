# Playlist Metrics for Scheduled Content in LMX Content

Source document: `Playlist+Metrics+for+Scheduled+Content+in+LMX+Content.doc`

# Playlist Metrics for Scheduled Content in LMX Content
# Playlist Metrics (Scheduled Content)
This guide explains the meaning of the playlist performance indicators shown at the top of the Scheduled Content section in the CMS platform.
These values help users monitor how much content has been scheduled, how much playback time remains, and how the screen is being utilized throughout the day.
## Where to Set the "Allocated Seconds" in Playlist Configuration
When you create or edit a playlist, the Allocated Duration (also known as "Allocated Seconds") is defined in the Duration (Seconds) field:
### What Does It Do?
This value sets the maximum target duration for each full loop of content on the screen. It is used for reference and loop calculation purposes only.
Important Note:
- These indicators do not block content from playing even if the loop exceeds the allocated value. They are for monitoring only.
- Even when "Utilized" > "Allocated", all contents will still play unless restricted by device or campaign settings.
- It is a helpful tool to track loop health and screen capacity, especially when managing campaigns with time-based rules or commercial agreements.
- Even if your scheduled contents go over this value, the platform will still allow all approved content to play. This is just a visibility tool to help you monitor screen usage.
## Playlist Timing Metrics Explained
Label
Meaning
Example
Network Start - End Time
The operational time window when content is allowed to play on the screen.
05:00 – 23:59 (Total 19 hours per day)
Allocated (secs)
Maximum allowed content duration for each loop, set in the playlist's configuration.
1000 secs = 16 mins 40 secs
Utilized (secs)
Total duration of scheduled contents currently active in the loop.
59 secs of scheduled content
Current Loop (secs)
The actual duration of the full loop based on the active contents. Usually the same as Utilized.
59 secs
Loops per Day
How many complete loops will play in one day, based on operating hours and loop duration.
1158 loops/day
Available (secs)
Remaining time in the loop for adding new content.
941 secs left to schedule
Occupied for Day (%)
Percent of the allocated loop time that is currently used.
5.9% of loop is filled
Vacant for Day (%)
Percent of the loop time that is still free for scheduling.
94.1% still available
Placeholder
Number of empty slots manually reserved but not yet filled.
0 placeholders currently in use
