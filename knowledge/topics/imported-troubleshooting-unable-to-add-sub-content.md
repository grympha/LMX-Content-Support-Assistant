# Troubleshooting - Unable to add sub-content

Source document: `Troubleshooting+-+Unable+to+add+sub-content.doc`

# Troubleshooting - Unable to add sub-content
Ticket ID:#11423
### Issue Description:
Users are unable to add sub-content in the CMS while scheduling content.
Error message - Maximum -1 sub contents allowed
### Root Cause:
- Network Start & End Time Conflict: If the start and end times are the same, the system does not allow sub-content to be added.
- Playlist Duration Dependency: The sub-content option is linked to the network start/end time and the playlist duration.
### Current Status:
- The issue has been identified and is linked to incorrect network start/end time settings.
- Users need to adjust the start and end times to enable sub-content addition.
### Next Steps:
- Immediate Fix: Adjust network start and end times and ensure proper playlist duration.
- Long-Term Action: Review CMS configurations to prevent similar conflicts and update documentation for clarity.
