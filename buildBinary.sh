#!/bin/bash

NOW=$(date +'%Y%m%d%H%M%S')
mkdir -p ./binaries
rm -rf ./binaries/*.apk
react-native bundle \
    --platform android \
    --dev false \
    --entry-file index.js \
    --bundle-output android/app/src/main/assets/index.android.bundle \
    --assets-dest android/app/src/main/res
cd android
./gradlew assembleDebug
cd ..
mv ./android/app/build/outputs/apk/debug/app-debug.apk ./binaries/$NOW-dbg.apk