# User Roles & Permissions

Source document: `User+Roles+&+Permissions.doc`

# User Roles & Permissions
### User Roles and Permissions
#### 1. Tenant Admin
Has the highest level of access. Responsible for managing all tenant-wide configurations, user roles, devices, and full content workflows.
- Full access to all features
- Create/edit/delete content
- Schedule and publish content
- Approve content
- Restart device
- Manage devices and users
- View full activity logs
#### 2. Project Admin
Handles content and device control within their assigned network scope. Cannot manage global user roles.
- Full access to all features to specific assign network settings
- Can manage screens and scheduling
- Can approve and publish content
- Cannot manage tenant-wide user permissions
- Can restart devices
#### 3. Content Creator
Creates and prepares content for approval. Cannot publish or push content live without approval.
- Can schedule content
- Can edit scheduled content before it is approved by Admin use or Content Approver
- Cannot publish content
- Cannot restart devices
- Cannot delete approved or published content
- All content scheduled will go into Pending status
- Do not have access to Devices Manager
#### 4. Content Approver
Reviews and approves pending content. Can schedule and publish their own but has limited modification rights post-publish.
- Can approve content scheduled by Content Creators
- Can schedule and publish own content
- Cannot edit or delete content once published
- Do not have access to Devices Manager
#### 5. Media Partner
Has restricted access to monitor assigned campaigns without any modification rights.
- View-only access to campaigns and content related to their own network
- Cannot schedule, edit, or publish content
- Cannot restart devices
#### 6. Monitor User
Strictly for monitoring live performance of devices and campaigns without any control permissions.
- View-only access to real-time screen status and device status
- Can view live playback data
- Cannot schedule or approve content
- Cannot restart devices
