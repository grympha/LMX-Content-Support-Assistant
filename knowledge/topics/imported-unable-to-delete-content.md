# Unable to Delete Content

Source document: `Unable+to+Delete+Content.doc`

# Unable to Delete Content
In some cases customers swill not be able to delete content . here are some examples:
## Customer Unable to Delete Specific Content
- See Ticket ID: #11238 Subject: Citi Mobile Media Old content playing.
- Issue:
- FCMB_MMA2.jpg creative was not removed properly from the CMS platform, which resulted in it being displayed on the LED screen.
- Customer tried to republish the current schedule, tried to delete the content from storage(didn't delete) and also restarted the media player several times with no affect.
- Additionally, while this creative was still active, the other scheduled content did not display as expected.
- Root Cause: The order ID was missing in the FCMB_MMA2.jpg content during the scheduling process, which is why it isn't showing up on the frontend. This was due to a bug in the LMX/CMS?
- this issue will only occur with schedules created before September 2024
- Steps to fix: resolve this issue, manually removing the FCMB_MMA2.jpg creative from the History tab in the CMS platform.
