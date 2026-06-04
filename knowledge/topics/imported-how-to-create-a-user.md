# How to Create a User

Source document: `How+to+Create+a+User.doc`

# How to Create a User
## Overview
In MW Content, users are created and assigned roles to manage digital signage content, devices, and workflows based on access levels. The platform supports role-based access control (RBAC), allowing for secure, collaborative content management.
As a Tenant Admin, you can create and manage users within your tenant and define what networks, locations, and features they have access to.
## Why User Roles Matter
Each user is assigned a role that defines their permissions. This ensures tasks like content creation, approval, and monitoring are performed by the right individuals — without exposing sensitive system-wide controls.
## Available User Roles
Role
Access Scope
Tenant Admin
Full access to all tenant features, networks, devices, users, and content.
Only Tenant users can create new user accounts.
Project Admin
Manage settings and content for assigned networks only
Content Creator
- Upload and schedule content
- No approval access
- No editing after approval
- Cannot remove content after approval
- No access to device manager
Content Approver
- Approve or reject scheduled content
- Can edit approve and pending content
- No access to device manager
- Can remove content
Media Partner
Limited access to view and manage playlists assigned to them
Monitor User
View-only access to device status, real-time monitoring, and remote restart tools
🔐 Only Tenant Admins can create or assign users to these roles.
User Role Permissions
## How to Create a User
- Navigate to:
Setup → User
- Click Create User
- Fill in the user details:
Field
Required
Description
Username
✅
Username of the user
Email
✅
User’s email address (also used for login)
First Name
✅
User's First Name
Last Name
✅
User’s Last Name
User Type
✅
Choose from Tenant Admin, Network Admin, etc.
Choose Language
✅
Choose your prefered langguage
Status
✅
Enable or disable user account
- Click Add to save the new user
## Access Control Notes
- Tenant Admins can:
Create/edit all users
Assign networks and permissions
Disable or delete accounts
- Network Admins cannot:
Create other users
Access settings outside their assigned network
- Media Partners can only:
View and manage playlists mapped to them
Cannot access other content, devices, or storage
## User Management Tools
Action
Description
Edit
Modify name, role, or network access
Deactivate
Temporarily disable login access
Reset Password
Send a password reset to the user
Delete
Permanently remove a user (only if not linked to active schedules)
## Best Practices
- Assign users to only the networks they operate in
- Use Content Creator + Approver roles for workflow separation
- Regularly review user list and disable inactive accounts
- Use Monitor User role for technical or support staff
