import { Amplify } from "aws-amplify";

const amplifyConfig = {
    // AWS configuration will be added here later
    // when API Gateway / Cognito / other AWS services
    // are created.
};

Amplify.configure(amplifyConfig);

export default amplifyConfig;