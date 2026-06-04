# LMX Content Linux Installation Guide

Source document: `LMX+Content+Linux+Installation+Guide.doc`

# LMX Content Linux Installation Guide
# Steps to Run on Ubuntu/Linux
## Download / Copy File
Place the AppImage file into desired directory.
Example:
Downloads/ or /home/user/LMX/
## Open Terminal
Navigate to file location:
Example:
cd ~/Downloads
## Grant Execute Permission
Run:
chmod +x mac-media-player-1.0.35_SR.AppImage
## Launch the Application
Run:
./mac-media-player-1.0.35_SR.AppImage
# Pair Device with CMS
Once application launches:
- Copy verification code
- Create device in CMS
- Pair device
# Optional – Create Desktop Shortcut
## Create shortcut:
nano ~/.local/share/applications/lmxcontent.desktop
Example:
[Desktop Entry] Name=LMX Content Exec=/home/user/Downloads/mac-media-player-1.0.35_SR.AppImage Icon=utilities-terminal Type=Application Categories=Utility;
# Optional – Auto Launch on Startup
Go to:
Startup Applications
Add:
/path/mac-media-player-1.0.35_SR.AppImage
# Common Linux Issues
Issue
Fix
Permission denied
chmod +x
App not launching
install libfuse2
Black screen
GPU acceleration issue
Verification not showing
firewall/network
# If AppImage won't open
Install:
sudo apt install libfuse2
(very common on Ubuntu 22/24)
# Important Note
Since this is AppImage:
✅ Portable
✅ Easy to test
BUT:
⚠️ Linux version may not be actively maintained.
# Recommended Ubuntu Version
Best compatibility:
Ubuntu 22.04 LTS
# Final Command Summary
chmod +x mac-media-player-1.0.35_SR.AppImage ./mac-media-player-1.0.35_SR.AppImage
