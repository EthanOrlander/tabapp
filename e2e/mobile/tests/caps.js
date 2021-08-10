module.exports = {
  ios: {
    path: '/wd/hub',
    port: 4723,
    capabilities: {
      platformName: 'iOS',
      platformVersion: '14.5',
      deviceName: 'iPhone 12 Pro',
      app: '/Users/ethanorlander/Documents/Personal/TabApp/repo/apps/mobile/builds/tabapp.app',
      automationName: 'XCUITest',
      wdaStartupRetries: '4',
      iosInstallPause: '8000',
      wdaStartupRetryInterval: '20000',
    },
  },
  android: {
    path: '/wd/hub',
    port: 4723,
    capabilities: {
      platformName: 'Android',
      platformVersion: '11',
      deviceName: 'Android Emulator',
      app: '/Users/ethanorlander/Documents/Personal/TabApp/repo/apps/mobile/builds/tabapp-3f5e86a686e3469c995d10e144b7331f-signed.apk',
      automationName: 'UiAutomator2',
    },
  },
};
