// javascript
// eslint-disable-next-line @typescript-eslint/no-var-requires
const wdio = require('webdriverio');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const assert = require('assert');

const opts = {
  path: '/wd/hub',
  port: 4723,
  capabilities: {
    platformName: 'Android',
    platformVersion: '11',
    deviceName: 'Android Emulator',
    app: '/Users/ethanorlander/Documents/Personal/TabApp/repo/apps/mobile/builds/tabapp-3f5e86a686e3469c995d10e144b7331f-signed.apk',
    automationName: 'UiAutomator2',
  },
};

async function main() {
  const client = await wdio.remote(opts);
  // Wait for 10 seconds to bypass loading screen. Would be best to do this using the appWaitActivity config in above opts, but can't figure it out rn
  await new Promise((r) => setTimeout(r, 30000));
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const field = await client.$('~forgot-password');
  console.log(await client.getContexts());
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
  // await field.setValue('Hello World!');
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment
  const value = await field.getText();
  assert.strictEqual(value, 'Forgot my password');
  await client.deleteSession();
}

void main();
