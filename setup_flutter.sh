#!/bin/bash
set -e

WORKSPACE="/home/piet/sportify-tools"
mkdir -p "$WORKSPACE"
cd "$WORKSPACE"

echo "1. Downloading OpenJDK 17 for aarch64..."
if [ ! -d "jdk-17" ]; then
    wget -q https://github.com/adoptium/temurin17-binaries/releases/download/jdk-17.0.10%2B7/OpenJDK17U-jdk_aarch64_linux_hotspot_17.0.10_7.tar.gz -O jdk17.tar.gz
    tar -xzf jdk17.tar.gz
    mv jdk-17.0.10+7 jdk-17
    rm jdk17.tar.gz
fi
export JAVA_HOME="$WORKSPACE/jdk-17"
export PATH="$JAVA_HOME/bin:$PATH"

echo "2. Downloading Android Command Line Tools..."
if [ ! -d "android-sdk" ]; then
    mkdir -p android-sdk/cmdline-tools
    cd android-sdk/cmdline-tools
    wget -q https://dl.google.com/android/repository/commandlinetools-linux-10406996_latest.zip -O cmdline-tools.zip
    unzip -q cmdline-tools.zip
    mv cmdline-tools latest
    rm cmdline-tools.zip
    cd ../..
fi
export ANDROID_HOME="$WORKSPACE/android-sdk"
export PATH="$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools:$PATH"

echo "3. Accepting Licenses and installing Android SDK components..."
yes | sdkmanager --licenses || true
sdkmanager "platform-tools" "platforms;android-34" "build-tools;34.0.0"

echo "4. Downloading Flutter SDK..."
if [ ! -d "flutter" ]; then
    git clone https://github.com/flutter/flutter.git -b stable
fi
export PATH="$WORKSPACE/flutter/bin:$PATH"

echo "5. Running Flutter Doctor..."
flutter doctor -v

echo "Setup Complete!"
