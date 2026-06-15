---
category: "Publish Content"
keywords:
  - upload failed
  - cannot upload
  - file upload error
  - upload not working
  - content not uploading
  - storage full
  - file too large
  - unsupported format upload
  - upload stuck
  - upload progress stuck
  - upload percentage not moving
  - file rejected
  - upload button not working
  - content upload troubleshooting
description: "Troubleshooting guide for content upload failures in LMX Content — covers unsupported format, storage full, file size limits, stuck uploads, and network-related upload failures."
search_priority: "high"
related_topics:
  - "Publish Content"
  - "Storage Management"
  - "Basic Troubleshooting"
---

# Upload Errors

## Quick Answer

If a file fails to upload, first confirm the format is supported (MP4, PNG, JPG, ZIP for HTML packages). If the format is correct, check available storage — a full or near-full storage blocks all new uploads. For uploads that stall mid-way, a network interruption is the most common cause; try a stable connection or a different browser. Content linked to an active published campaign cannot be deleted to free storage until the campaign is unpublished.

## Symptoms

- Upload dialog appears but the file is immediately rejected with an error
- Upload starts (progress bar appears) but stops before reaching 100%
- Upload appears to complete but the file does not appear in Main Storage
- Upload button is greyed out or unresponsive
- Error message: "Unsupported format", "File too large", "Storage limit reached", or similar
- Upload works for small files but fails consistently for large video files
- The same file uploads successfully from a different browser or network

## Common Causes

### Format Issues

| Cause | Explanation |
|---|---|
| Unsupported video codec | MOV or AVI files may fail if codec is unsupported; convert to MP4 H.264 |
| Unsupported image type | BMP, TIFF, or PSD files are not accepted; use JPG or PNG |
| Malformed HTML ZIP | ZIP package missing `index.html` at root, or ZIP is password-protected |
| Corrupt file | File is partially downloaded or corrupt before the upload attempt |

### Storage Issues

- Storage capacity at or near limit — no space for new files
- Content assigned to active campaigns cannot be deleted to free space until the campaign is unpublished

### Network Issues

- Slow or unstable connection causes a timeout before the upload completes
- Large video files require a sustained connection — any interruption fails the upload
- Corporate proxy or firewall blocking multipart file uploads above a size threshold

### Browser or Session Issues

- Browser session expired mid-upload
- Browser extension interfering with the file upload form
- File size exceeds what the browser can handle in a single upload request

## Troubleshooting Steps

### Step 1 — Verify the File Format

1. Confirm the file matches a supported format:
   - **Images**: JPG, JPEG, PNG, GIF
   - **Videos**: MP4 (recommended, H.264 codec), MOV, WEBM
   - **HTML packages**: ZIP file containing `index.html` at the root level
2. If the file is a video in a format other than MP4, convert it to MP4 H.264 before uploading.
3. If the file is a ZIP HTML package, open it and confirm `index.html` exists at the root (not inside a subfolder).
4. For the full supported format list, see [[Supported Formats]].

### Step 2 — Check Storage Availability

1. In CMS, navigate to **Main Storage**.
2. Check the storage indicator at the top of the storage page.
3. If storage is at or near capacity:
   - Identify unused or expired content that is not linked to any active campaign.
   - Select those files and delete them to free space.
   - For storage management steps, see [[imported-how-to-delete-content-in-the-storage]].
4. If content cannot be deleted because it is linked to an active campaign, unpublish or end the campaign first, then delete the content.

### Step 3 — Check File Size and Connection Stability

1. Confirm your internet connection is stable throughout the upload. For large video files, a connection interruption at any point will fail the entire upload — it must restart.
2. If uploading a large video (100MB+), consider compressing it to reduce file size before uploading.
3. Try uploading from a different network (e.g., mobile hotspot vs. office Wi-Fi) to rule out a network restriction or size limit.
4. If the issue occurs only on one network, a corporate proxy or firewall may be blocking large uploads — see [[Firewall-And-Network-Requirements]].

### Step 4 — Try a Different Browser

1. Clear the browser cache and cookies, then retry the upload.
2. Try the upload in an Incognito window to rule out session or extension interference.
3. Try a different browser entirely (Chrome, Firefox, Edge).
4. Temporarily disable browser extensions — especially ad blockers, script blockers, and download managers, which can intercept file upload requests.

### Step 5 — Verify the File Is Not Corrupt

1. Open the file on your computer before uploading — play the video in a media player, open the image in a viewer, or open `index.html` in a browser for HTML packages.
2. If the file does not open locally, it is likely corrupt — re-export or re-download the source.
3. For MP4 files, confirm the video plays end-to-end before attempting the upload.

### Step 6 — HTML ZIP-Specific Issues

If uploading an HTML package:

1. Open the ZIP file locally and confirm `index.html` exists at the **root level** — not inside a subfolder.
   - Correct structure: `package.zip` → `index.html`, `assets/`, `style.css`
   - Incorrect structure: `package.zip` → `my-folder/` → `index.html`
2. Ensure the ZIP is not password-protected.
3. Check all asset references in `index.html` use **relative paths**, not absolute paths from your local machine.
4. Remove files not required for playback to reduce ZIP size — embedded videos or large libraries can cause the upload to fail or time out.
5. For HTML content playback issues after a successful upload, see [[HTML-ZIP-Content]].

## Escalation Criteria

Escalate when:

- File format is confirmed correct, storage is available, connection is stable, but upload still fails
- Upload fails consistently across multiple browsers and networks
- Upload completes in the browser but the file does not appear in Main Storage after 5+ minutes
- A specific file type or size is consistently rejected without a clear error message
- Storage shows space available but upload still fails with a storage error

**Information to collect before escalating:**
- File format and file size
- Exact error message shown (screenshot preferred)
- Browser and OS used for the upload attempt
- Whether the issue occurs on multiple browsers or networks
- Storage percentage shown at the time of the upload attempt

## Related Notes

[[Supported Formats]]
[[Storage Management]]
[[imported-how-to-delete-content-in-the-storage]]
[[imported-unable-to-delete-content]]
[[HTML-ZIP-Content]]
[[Firewall-And-Network-Requirements]]
[[Publish Content]]
