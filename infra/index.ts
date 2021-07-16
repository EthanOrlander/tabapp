import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

const pool = new aws.cognito.UserPool("pool", {
    // mfaConfiguration: "ON",
    // smsAuthenticationMessage: "Your tabapp code is {####}",
    // smsConfiguration: {
    //     externalId: "example",
    //     snsCallerArn: aws_iam_role.example.arn,
    // },
    softwareTokenMfaConfiguration: {
        enabled: true,
    },
    accountRecoverySetting: {
        recoveryMechanisms: [
            {
                name: "verified_email",
                priority: 1,
            },
            {
                name: "verified_phone_number",
                priority: 2,
            },
        ],
    },
});

// Set up user pool group

// Set up user pool client

// More user pool setup?