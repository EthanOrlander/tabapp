# e2e/mobile

This package performs black-box tests against app builds using Appium and WebdriverIO. These tests are run on many iOS and Android devices in the automated CD pipeline to ensure that critical parts of the app do not break between releases.

Tests should be added as needed for new features.

## Run tests locally

First, run `yarn` in this directory

### iOS

1. Create an iOS simulator build:
   1. Run `yarn expo build:ios -t simulator` in the [apps/mobile](../../apps/mobile) directory
   2. Download the build
   3. Unzip the build and place `tabapp.app` into [builds](builds)
2. The iOS tests are configured to run on an iPhone 12 Pro simulator running iOS 14.5. Ensure you have a simulator on your device that matches this description.
    - See [config/wdio.ios.app.conf.ts](config/wdio.ios.app.conf.ts)
3. run `yarn ios.app` in this directory

### Android

1. Create an Android apk build:
   1. Run `yarn expo build:android -t apk` in the [apps/mobile](../../apps/mobile) directory
   2. Download the build
   3. Unzip the build and place the apk into [builds](builds)
   4. Rename the apk file to `tabapp.apk`
2. The Android tests are configured to run on a Pixel 4 emulator running API 30 (Android 11.0). Ensure you have an emulator on your device that matches this description.
    - See [config/wdio.android.app.conf.ts](config/wdio.android.app.conf.ts)
3. run `yarn android.app` in this directory

## tests/helpers



## tests/screenobjects



## tests/specs
