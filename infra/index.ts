import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";
import * as awsx from "@pulumi/awsx";
import { PostConfirmationConfirmSignUpTriggerEvent, PreSignUpTriggerEvent } from "aws-lambda";
import { CognitoIdentityServiceProvider } from "aws-sdk";

/*
 * Email verification required for reset password. But, cognito only verifies SMS on sign up when both are required.
 * Down the line, send a verification email. For now, for the sake of speed, this lambda auto-verifies the email.
 *
 * Why verification email isn't sent https://docs.aws.amazon.com/cognito/latest/developerguide/user-pool-settings-email-phone-verification.html
 *
 * If a user signs up with both a phone number and an email address, and your
 * user pool settings require verification of both attributes, a verification
 * code is sent via SMS to the phone. The email address is not verified, so
 * your app needs to call GetUser to see if an email address is awaiting
 * verification. If it is, the app should call GetUserAttributeVerificationCode
 * to initiate the email verification flow and then submit the verification code
 * by calling VerifyUserAttribute.
 *
 * Perhaps make a lambda on the user creation event that triggers the email.
 */
const postConfirmSignUpAutoVerifyEmailLambda = new aws.lambda.CallbackFunction(`cognito-post-signup-auto-verify-email`, {
    callback: async (event: PostConfirmationConfirmSignUpTriggerEvent) => {
        const cognitoIdentityServiceProvider = new CognitoIdentityServiceProvider();
        void await cognitoIdentityServiceProvider.adminUpdateUserAttributes({
            UserAttributes: [{ Name: "email_verified", Value: "true" }],
            UserPoolId: event.userPoolId,
            Username: event.userName
        }).promise();
        return event;
    }
})

/*
 * Before sign up, check if a user exists with the same email
 * This isn't actually attached as the pre sign up lambda in Cognito, because
 * cognito checks for duplicate usernames before it runs the pre sign up lambda & fails too early
 * Must be called before signup by the frontend.
 */
const preSignUpLambda = new aws.lambda.CallbackFunction('cognito-pre-signup-lambda', {
    callback: async (event: PreSignUpTriggerEvent) => {
        const cognitoIdentityServiceProvider = new CognitoIdentityServiceProvider();
        console.log("attributes:", event.request.userAttributes);
        const users = await cognitoIdentityServiceProvider.listUsers({
            UserPoolId: event.userPoolId,
            AttributesToGet: ["phone_number", "phone_number_verified"],
            Filter: `phone_number = "${event.request.userAttributes.phone_number}"`,
            Limit: 1
        }).promise();
        console.log("users: ", users);
        if (users.Users && users.Users[0])
            console.log("attributes: ", users.Users[0].Attributes)
        return event;
    }
})

const cognitoSNSRole = new aws.iam.Role("cognito-sns-role", {
    assumeRolePolicy: JSON.stringify({
        Version: "2012-10-17",
        Statement: [
            {
                Sid: "",
                Effect: "Allow",
                Principal: {
                    Service: "cognito-idp.amazonaws.com"
                },
                Action: "sts:AssumeRole",
                Condition: {
                    StringEquals: {
                        "sts:ExternalId": "tabapp/cognito"
                    }
                }
            }
        ]
    })
});

const cognitoSNSRolePolicy = new aws.iam.RolePolicy("cognito-sns-role-policy", {
    role: cognitoSNSRole.id,
    policy: JSON.stringify({
        Version: "2012-10-17",
        Statement: [
            {
                Effect: "Allow",
                Action: [
                    "sns:publish"
                ],
                Resource: [
                    "*"
                ]
            }
        ]
    })
})

const userPool = new aws.cognito.UserPool("tabapp", {
    usernameAttributes: ["phone_number"],
    usernameConfiguration: {
        caseSensitive: true
    },
    schemas: ["email", "family_name", "given_name", "phone_number"].map(x => ({
        attributeDataType: "String",
        name: x,
        required: true
    })),
    passwordPolicy: {
        minimumLength: 8,
        requireSymbols: false,
        requireNumbers: true,
        requireLowercase: true,
        requireUppercase: true,
    },
    adminCreateUserConfig: {
        allowAdminCreateUserOnly: false
    },
    mfaConfiguration: "ON",
    smsAuthenticationMessage: "Your TabApp sign in code is {####}",
    accountRecoverySetting: {
        recoveryMechanisms: [{ name: "verified_email", priority: 1 }]
    },
    autoVerifiedAttributes: ["phone_number", "email"],
    smsVerificationMessage: "Your TabApp verification code is {####}",
    smsConfiguration: {
        externalId: "tabapp/cognito",
        snsCallerArn: cognitoSNSRole.arn
    },
    verificationMessageTemplate: {
        defaultEmailOption: "CONFIRM_WITH_LINK",
        emailMessageByLink: "{##Click Here##} to confirm your TabApp account.",
        emailSubjectByLink: "Confirm your TabApp account."
    },
    emailConfiguration: {
        emailSendingAccount: "COGNITO_DEFAULT"
    },
    lambdaConfig: {
        postConfirmation: postConfirmSignUpAutoVerifyEmailLambda.arn
    }
});

const cognitoAppClient = new aws.cognito.UserPoolClient("tabapp-client", {
    userPoolId: userPool.id,
    explicitAuthFlows: ["ALLOW_CUSTOM_AUTH", "ALLOW_USER_SRP_AUTH", "ALLOW_REFRESH_TOKEN_AUTH"],
    supportedIdentityProviders: ["COGNITO"],
    allowedOauthFlows: ["code"],
    allowedOauthFlowsUserPoolClient: true,
    allowedOauthScopes: ["phone", "email", "openid", "profile"],
    callbackUrls: ["https://localhost:3000"],
    defaultRedirectUri: "https://localhost:3000",
    generateSecret: false,
    logoutUrls: ["http://localhost:3000"],
});

const cognitoDomain = new aws.cognito.UserPoolDomain("tabapp-domain", {
    domain: pulumi.interpolate`tabapp-${pulumi.getStack()}`,
    userPoolId: userPool.id
})

const allowCognitoPostConfirmSignUp = new aws.lambda.Permission("AllowExecutionFromCognitoPostConfirmSignUp", {
    action: "lambda:InvokeFunction",
    function: postConfirmSignUpAutoVerifyEmailLambda.name,
    principal: "cognito-idp.amazonaws.com",
    sourceArn: userPool.arn,
});

const endpoint = new awsx.apigateway.API("auth", {
    routes: [
        // Serve a simple REST API on `GET /name` (using AWS Lambda)
        {
            path: "/preSignUp",
            method: "GET",
            eventHandler: async (req) => {
                if (req.queryStringParameters) {
                    const phoneNumber = req.queryStringParameters["phone_number"];
                    const cognitoIdentityServiceProvider = new CognitoIdentityServiceProvider();
                    const users = await cognitoIdentityServiceProvider.listUsers({
                        UserPoolId: userPool.id.get(),
                        AttributesToGet: ["phone_number", "phone_number_verified"],
                        Filter: `phone_number = "${phoneNumber}"`,
                        Limit: 1
                    }).promise();
                    if (users.Users && users.Users[0] && users.Users[0].Username && users.Users[0].Attributes && users.Users[0].Attributes.filter(a => a.Name === "phone_number_verified")[0].Value === 'false')
                        void await cognitoIdentityServiceProvider.adminDeleteUser({
                            UserPoolId: userPool.id.get(),
                            Username: users.Users[0].Username
                        }).promise()
                }
                return {
                    statusCode: 200,
                    body: Buffer.from(JSON.stringify({ success: true }), "utf8").toString("base64"),
                    isBase64Encoded: true,
                    headers: { "content-type": "application/json" },
                }
            }
        }
    ]
});

// Export the public URL for the HTTP service
exports.url = endpoint.url;

export const hostedSignInURL = pulumi.interpolate`https://${cognitoDomain.domain}.auth.us-east-2.amazoncognito.com/login?client_id=${cognitoAppClient.id}&response_type=code&scope=${cognitoAppClient.allowedOauthScopes.apply(scopes => scopes && scopes.join('+'))}&redirect_uri=${cognitoAppClient.defaultRedirectUri}`;