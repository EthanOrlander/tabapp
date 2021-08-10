import ConfirmSignInScreen from "../../screenobjects/ConfirmSignInScreen";
import SignInScreen from "../../screenobjects/SignInScreen";
import { Twilio } from "twilio";
import * as moment from "moment";
import { CognitoIdentityServiceProvider, Config } from "aws-sdk";
import HomeScreen from "../../screenobjects/HomeScreen";
import * as dotenv from "dotenv";

dotenv.config();

const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;

const awsAccessKeyId = process.env.AWS_ACCESS_KEY_ID;
const awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const awsRegion = process.env.AWS_REGION;

if (!twilioAccountSid || !twilioAuthToken)
  throw Error("Ensure TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN are defined in the environment");

if (!awsAccessKeyId || !awsSecretAccessKey || !awsRegion)
  throw Error("Ensure AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, and AWS_REGION are defined in the environment")

const client = new Twilio(twilioAccountSid, twilioAuthToken);
const awsConfig = new Config({
  credentials: {
    accessKeyId: awsAccessKeyId,
    secretAccessKey: awsSecretAccessKey,
  }, region: awsRegion
});
const cognitoIdentityServiceProvider = new CognitoIdentityServiceProvider(awsConfig);

describe('WebdriverIO and Appium, when interacting with a login form,', () => {
  beforeEach(async () => {
    // Navigate to sign in screen before each test
    // This is incomplete. It waits for the screen to be shown, but doesn't actually try to navigat there
    await SignInScreen.waitForIsShown();
  });
  beforeAll(async () => {
    // Create cognito user
    const res = await cognitoIdentityServiceProvider.adminCreateUser({
      UserPoolId: 'us-east-2_ICXYUL1pp',
      Username: '+16472518247',
      MessageAction: 'SUPPRESS',
      TemporaryPassword: 'Thisisadankpassword69',
      UserAttributes: [
        {
          Name: "email",
          Value: "ethanorlander@gmail.com"
        },
        {
          Name: "phone_number",
          Value: "+16472518247"
        },
        {
          Name: "given_name",
          Value: "Test"
        },
        {
          Name: "family_name",
          Value: "User"
        },
      ]
    }).promise();
    if (res?.User?.Username) {
      void await cognitoIdentityServiceProvider.adminUpdateUserAttributes({
        UserAttributes: [{ Name: "email_verified", Value: "true" }, { Name: "phone_number_verified", Value: "true" }],
        UserPoolId: 'us-east-2_ICXYUL1pp',
        Username: res.User.Username
      }).promise();
      // This confirms user so they aren't required to update password on first login
      // Just a quirk of adminCreateUser
      await cognitoIdentityServiceProvider.adminSetUserPassword({
        UserPoolId: 'us-east-2_ICXYUL1pp',
        Username: res.User.Username,
        Password: 'Thisisadankpassword69',
        Permanent: true
      }).promise();
    }
    else throw Error('Error creating Cognito user');
  });
  afterAll(async () => {
    // Delete cognito user
    const users = await cognitoIdentityServiceProvider.listUsers({
      UserPoolId: 'us-east-2_ICXYUL1pp',
      AttributesToGet: ["phone_number"],
      Filter: `phone_number = "+16472518247"`,
      Limit: 1
    }).promise();
    if (users.Users && users.Users[0] && users.Users[0].Username)
      void await cognitoIdentityServiceProvider.adminDeleteUser({
        UserPoolId: 'us-east-2_ICXYUL1pp',
        Username: users.Users[0].Username
      }).promise()
  });
  // Remove @wdio/sync and switch to async mode
  it("should should be able to sign in successfully", async () => {
    await SignInScreen.submitSignInForm({ phoneNumber: '6472518247', password: 'Thisisadankpassword69' });
    await ConfirmSignInScreen.waitForIsShown();

    // Wait 10 seconds to receive sms
    await new Promise(r => setTimeout(r, 5000));
    // Get recent sms in twilio
    const messages = await client.messages.list();
    const verificationCodeMessage = messages.find(message => moment(message.dateSent).isAfter(moment().subtract(10, 'seconds')))
    const code = verificationCodeMessage?.body.replace('Your TabApp sign in code is ', '');
    if (!code) throw Error("Could not get verification code");

    await ConfirmSignInScreen.submitVerificationForm({ code });
    const atHomeScreen = await HomeScreen.waitForIsShown();

    expect(atHomeScreen).toBeTrue();
  });
  xit("should not be able to sign in with incorrect phone number");
  xit("should not be able to sign in with incorrect password");
  // Get past sign in screen, but fail at confirm sign in screen
  xit("should not be able to sign in with incorrect sms verification code");
});
