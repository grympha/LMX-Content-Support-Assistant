# Auto Boot Shutdown Configuration Guide

Source document: `Auto+Boot+_+Shutdown+Configuration+Guide.doc`

# Auto Boot / Shutdown Configuration Guide
## Overview
The Auto Boot / Shutdown feature enables a system to automatically power on and power off based on predefined application logic.
By default, this feature is disabled and must be manually enabled after installation.
For large-scale deployments, a pre-configured build with:
"AUTO_POWER_ON_OFF": true
can be provided upon request.
# Prerequisites & System Configuration
Before enabling the feature, ensure the following configurations are completed in order:
## 1. Remove Lock Screen Password
- Press Win + R
- Type:
regedit
- Go to:
HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Winlogon
- Set:
- AutoAdminLogon = 1
- DefaultUserName = your username (Hezri)
- DefaultPassword = your password
- Restart PC
## 2. Enable Wake Timer Configuration (Mandatory)
Auto Boot relies on Windows Wake Timers.
If disabled, the system will NOT power on automatically.
### Steps:
- Open Control Panel
- Navigate to Power Options
- Click Edit Plan Settings (active plan)
- Select Change advanced power settings
- Expand:
Sleep → Allow wake timers
- Set:
- On battery → Optional
- Plugged in → Enable
- Click Apply → OK
### ⚠️ Important:
If Wake Timers are disabled, Auto Boot will fail.
## 3. Install / Update the Application
Ensure the latest version of the application is installed.
### Steps:
- Download the latest build
- Install or update the application
- Verify the application launches correctly
- Close the application before configuration
## 4. Enable Auto Boot / Shutdown in Application
### Default Behavior:
"AUTO_POWER_ON_OFF": false
### Configuration Steps:
- Navigate to:
Application Installation Directory → resources
- Locate:
Configuration.json
- Open using:
- Notepad / Notepad++ / VS Code
- Find:
"AUTO_POWER_ON_OFF": false
- Change to:
"AUTO_POWER_ON_OFF": true
- Save the file
# Summary Checklist
Requirement
Status
Lock screen removed
☐
Wake timers enabled
☐
Application installed/updated
☐
AUTO_POWER_ON_OFF enabled
☐
