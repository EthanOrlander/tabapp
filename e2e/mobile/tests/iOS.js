/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
const wdio = require('webdriverio');
const assert = require('assert');

const opts = {
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
};

async function main() {
  const client = await wdio.remote(opts);
  // Wait for 10 seconds to bypass loading screen. Would be best to do this using the appWaitActivity config in above opts, but can't figure it out rn
  await new Promise((r) => setTimeout(r, 30000));
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const field = await client.$('~forgot-password');
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
  // await field.setValue('Hello World!');
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
  const value = await field.getText();
  assert.strictEqual(value, 'Forgot my password');
  await client.deleteSession();
}

void main();

/*
 * To run iPhone emulator:
 * xcrun simctl boot 0C6E2C30-A3BF-4BF0-990D-0041B7EF23DC
 * open /Applications/Xcode.app/Contents/Developer/Applications/Simulator.app/
 */
