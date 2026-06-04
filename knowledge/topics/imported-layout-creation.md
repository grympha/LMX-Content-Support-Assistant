# Layout Creation

Source document: `Layout+Creation.doc`

# Layout Creation
## Overview
A Layout in MW Content allows you to divide a digital signage screen into multiple sections, which are referred to as “tags”, with each tag playing a different playlist. This is ideal for scenarios where you want to show video content, live news, promotions, or branding all on a single screen simultaneously.
## What is a Layout?
- A layout refers to the total screen area of the display device.
- It determines how content is distributed across different sections of a screen.
- Each tag (section) in the layout is linked to a specific playlist.
- Layouts are assigned to locations and used as a template for rendering scheduled content.
## Layout Scaling Methods
LMX supports two scaling types for customizing layout size and responsiveness:
Scaling Type
Description
Percentage (%)
Size is defined as a percentage of the full screen. Responsive to different screen sizes and resolutions.
Pixel (px)
Fixed layout size defined using exact pixel values. Best for known screen dimensions.
## Border Configuration (Optional)
When "Border Configuration" is enabled, you can:
- Define the position of layout borders
- Set border width (thickness)
- Choose a border color using a color palette
This is useful for highlighting zones visually during content review or branding display.
## Tag Management
Tags represent the individual content zones within a layout.
### Tag Properties
Field
Description
Tag Name
Name for the screen section (e.g., Main Video, Footer Ticker)
Playlist
Assign a playlist to this specific tag
Left / Top
X and Y position of the tag relative to top-left of the screen
Width / Height
Dimensions of the tag (in % or px depending on scale type)
Description
(Optional) Brief explanation of the tag's use or function
Tip: Each tag must be linked to a playlist for the layout to function properly.
## How to Create a Layout (Step-by-Step)
- Navigate to Setup → Layout
- Click Create Layout
### Fill in the layout details:
Field
Required
Description
Layout Name
✅
Unique name for the layout (e.g., Split_Screen_KL)
Location
✅
Assign layout to an existing network location
Layout Scale Type
✅
Choose Percentage or Pixel for layout sizing
Screen Type
✅
Select the target display resolution (e.g., 1920x1080)
Is Default Layout?
❌
Set this layout as the default for the location
Tags
✅
Add and configure tags (zones) for content display
- Add Tags:
Click Add Tag
Define tag name, playlist, size, and position
Use Refresh to reset to a single default tag if needed
- Click Save
## Layout Sorting & Defaults
- You can sort layouts alphabetically in the layout list.
- Layout status determines if it is enabled or disabled.
- You can use predefined tags from existing layouts to speed up setup.
## Custom Resolution Layouts
If selecting custom screen types:
Custom Fields
Description
Resolution Width/Height
Define the overall screen size
Width/Height (per tag)
Set dimensions for each tag's layout area
The system will auto-adjust compatible layout display based on selected resolution.
## Best Practices
- Use percentage scaling for screens of varying sizes or when content needs to be responsive
- Stick to 3–4 tags per layout to maintain visual clarity
- Always set at least one layout as default per location
- Use descriptive names for tags and layouts (e.g., Retail_Menu_LeftPanel)
