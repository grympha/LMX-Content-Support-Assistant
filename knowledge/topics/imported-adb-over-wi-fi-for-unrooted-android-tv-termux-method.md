# ADB Over Wi-Fi for Unrooted Android TV (Termux Method)

Source document: `ADB+Over+Wi-Fi+for+Unrooted+Android+TV+(Termux+Method).doc`

# ADB Over Wi-Fi for Unrooted Android TV (Termux Method)
## Overview
This guide explains how to connect to an unrooted Android TV over Wi-Fi using Termux directly on the TV to perform the initial checks and connection preparation before using a Windows PC.
## Prerequisites
- Android TV and PC on the same Wi-Fi network
- Access to the TV remote
- Termux installed on the TV
- Platform Tools installed on your PC (Download here)
- TV firmware with ADB service running (pre-enabled by manufacturer)
## Check ADB Status in Termux
Open Termux on the TV and run:
- Check for root access:
su
- If you see # prompt → root access is available.
- If su: not found → no root access.
- Check if ADB is listening on port 5555:
netstat -tnlp | grep 5555
- If you see :::5555 → listening on IPv6 only.
- If you see 0.0.0.0:5555 → listening on IPv4.
- Get the TV's IP address:
ip addr show wlan0
- Look for inet line, e.g., 192.168.0.216/24.
- Test network connectivity to your PC or router:
ping -c 4 192.168.0.1
(Replace 192.168.0.1 with your router’s IP if different.)
## Connect from PC
- On your PC, open Command Prompt and navigate to the platform-tools folder:
cd "C:\Users\<YourName>\Downloads\platform-tools-latest-windows\platform-tools"
- Test network reachability:
ping 192.168.0.216
(Replace with the IP found in Termux.)
- Connect via ADB:
adb connect 192.168.0.216:5555
Expected outputs:
- connected to 192.168.0.216:5555 → success
- already connected to 192.168.0.216:5555 → already connected
- If connection refused → reboot TV and recheck ADB status in Termux.
- Check authorization:
adb devices
- device → authorized and ready
- unauthorized → approve the prompt on TV (tick Always allow)
## Test ADB Control
Open a remote shell:
adb shell
Expected prompt:
shell@<device>:/ $
Type exit to close.
Test commands:
adb shell pm list packages adb shell screencap -p /sdcard/screen.png adb pull /sdcard/screen.png
## Optional: Mirror TV Screen
- Download scrcpy (GitHub link)
- Run:
scrcpy
The TV screen will display in a window on your PC.
## Troubleshooting
Issue
Cause
Fix
unauthorized
Debugging prompt not approved
Revoke authorizations, reconnect
connection refused
ADB daemon not active
Reboot TV and retry Termux check
offline
Temporary state
Disconnect/reconnect
IP changes
DHCP assigned a new address
Set static IP in TV network settings
