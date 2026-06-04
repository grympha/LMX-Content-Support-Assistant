# ADB Connect PC to Android devices

Source document: `ADB+Connect+PC+to+Android+devices.doc`

# ADB Connect PC to Android devices
## Option 1
ADB (Android Debug Bridge) allows you to connect remotely to Android devices for debugging, file transfer, and issuing commands. Here’s how to connect:
### 1. Enable Developer Options & USB Debugging on Android
- Go to Settings > About phone.
- Tap Build number multiple times (usually 7) until Developer Mode is enabled.
- Go back to Settings > Developer options.
- Enable USB Debugging.
- Unrooted Device use this method
### 2. Install ADB on Your Computer
#### Windows:
- Download platform-tools fromGoogle’s official site.
- Extract the folder and open it in the terminal (cmd or PowerShell).
#### Mac & Linux:
Run:
sudo apt install adb # (For Ubuntu/Debian)
brew install android-platform-tools # (For macOS)
### 3. Connect via USB
- Plug your Android device into your computer.
- Open a terminal or command prompt and navigate to the ADB folder.
- Run:
adb devices
- If prompted on your phone, allow USB debugging.
- Your device should appear in the list.
### 4. Connect via Wi-Fi (Wireless ADB)
#### Option 1: Using USB First (Recommended)
- Connect your phone via USB and run:
adb tcpip 5555
- Find your phone’s IP address in Settings > About Phone > Status.
- Disconnect the USB and connect wirelessly:
adb connect <DEVICE_IP>:5555
- Verify connection:
adb devices
#### Option 2: Direct Wireless Connection (Android 11+)
- Enable Wireless Debugging in Developer Options.
- Tap Pair device with QR code or Pair using code and follow instructions.
- On your PC, run:
adb pair <DEVICE_IP>:<PORT>
- Enter the pairing code shown on the phone.
### 5. Running ADB Commands
Once connected, you can run commands like:
- List devices: adb devices
- Install APK: adb install app.apk
- Uninstall app: adb uninstall com.example.app
- Reboot device: adb reboot
- Enter shell: adb shell
## Option 2
You can use Termux on Android, you can set up ADB directly on your phone to control other devices or your own Android device.
### 1. Install ADB in Termux
- Open Termux and update packages:
pkg update && pkg upgrade
- Install ADB:
pkg install android-tools
### 2. Enable USB Debugging
- Go to Settings > Developer options on your phone.
- Enable USB Debugging.
### 3. Connect via USB (Requires Root or OTG Adapter)
- If your Android phone supports USB OTG, you can use an OTG adapter to connect another Android phone via USB.
- Connect and run:
adb devices
- If you get a permission error, you might need root access.
### 4. Connect via Wi-Fi (Wireless ADB)
If you want to connect to your own Android device from Termux without a second device, use Wireless ADB:
#### Option 1: Using Root (Direct ADB)
If your device is rooted:
setprop service.adb.tcp.port 5555
stop adbd
start adbd
adb connect 127.0.0.1:5555
#### Option 2: Using Wireless Debugging (Android 11+)
- Enable Wireless Debugging in Developer Options.
- Pair via QR code or use:
adb pair <DEVICE_IP>:<PORT>
- Once paired, connect:
adb connect <DEVICE_IP>:5555
### 5. Using ADB Commands in Termux
- List connected devices:
adb devices
- Enter ADB shell:
adb shell
- Reboot device:
adb reboot
- Install APK:
adb install /sdcard/app.apk
- Uninstall an app:
adb uninstall com.example.app
Additional
You can use Scrcpy to mirror and control your Android device from your PC (or even within Termux), follow these steps:
### 1. Setup Scrcpy on PC
#### Windows
- Download Scrcpy fromGitHub Releases.
- Extract the folder and open a Command Prompt (cmd) in that directory.
#### Linux (Ubuntu/Debian)
sudo apt update && sudo apt install scrcpy -y
#### Mac (Homebrew)
brew install scrcpy
### 2. Enable USB Debugging on Android
- Go to Settings > Developer options.
- Enable USB Debugging.
### 3. Connect & Start Scrcpy
#### Via USB
- Connect your Android device to your PC using a USB cable.
- Run:
scrcpy
- Your Android screen should now appear on your PC!
### 4. Wireless Scrcpy (Without USB)
#### Step 1: Enable Wireless ADB
#### Using USB First (Recommended)
- Connect your phone via USB and enable ADB over TCP/IP:
adb tcpip 5555
- Find your phone's IP address (in Wi-Fi settings or using adb shell ip route).
- Disconnect USB and connect via Wi-Fi:
adb connect <DEVICE_IP>:5555
- Run Scrcpy wirelessly:
scrcpy
#### Without USB (Android 11+ - Wireless Debugging)
- Enable Wireless Debugging in Developer Options.
- Pair the device using:
adb pair <DEVICE_IP>:<PORT>
- Once paired, connect:
adb connect <DEVICE_IP>:5555
- Run Scrcpy:
scrcpy
### 5. Using Scrcpy in Termux
You can’t run Scrcpy directly in Termux because it requires a graphical interface. However, you can still control your device via ADB in Termux.
### Alternative: Running Scrcpy on a Linux PC from Termux (via SSH)
If you have a Linux PC running Scrcpy, you can SSH into the PC from Termux and launch Scrcpy remotely:
ssh user@your_pc_ip
scrcpy
Your Android device will display on the PC.
