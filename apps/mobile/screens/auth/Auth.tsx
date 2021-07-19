import React, { useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { CognitoUser } from 'amazon-cognito-identity-js';
import ConfirmSignIn from './ConfirmSignIn';
import ConfirmSignUp from './ConfirmSignUp';
import ForgotPassword from './ForgotPassword';
import ForgotPasswordSet from './ForgotPasswordSet';
import SignIn from './SignIn';
import SignUp from './SignUp';
import { AuthProvider } from './AuthContext';

type AuthenticationNavigatorProps = {
  updateAuthState: (state: string) => void;
};

export type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  ConfirmSignUp: undefined;
  ConfirmSignIn: undefined;
  ForgotPassword: undefined;
  ForgotPasswordSet: undefined;
};

const AuthenticationStack = createStackNavigator<RootStackParamList>();

const AuthenticationNavigator: React.FC<AuthenticationNavigatorProps> = ({ updateAuthState }) => {
  // CognitoUser needed in confirmSignUp function & confirmSignIn function
  const [cognitoUser, setCognitoUser] = useState<CognitoUser | undefined>();
  // Username needed in forgotpassword function
  const [username, setUsername] = useState<string | undefined>();

  return (
    <AuthProvider value={{ updateAuthState, cognitoUser, setCognitoUser, username, setUsername }}>
      <AuthenticationStack.Navigator headerMode="none">
        <AuthenticationStack.Screen name="SignIn">
          {(screenProps) => <SignIn {...screenProps} />}
        </AuthenticationStack.Screen>
        <AuthenticationStack.Screen name="SignUp">
          {(screenProps) => <SignUp {...screenProps} />}
        </AuthenticationStack.Screen>
        <AuthenticationStack.Screen name="ConfirmSignUp">
          {(screenProps) => <ConfirmSignUp {...screenProps} />}
        </AuthenticationStack.Screen>
        <AuthenticationStack.Screen name="ConfirmSignIn">
          {(screenProps) => <ConfirmSignIn {...screenProps} />}
        </AuthenticationStack.Screen>
        <AuthenticationStack.Screen name="ForgotPassword">
          {(screenProps) => <ForgotPassword {...screenProps} />}
        </AuthenticationStack.Screen>
        <AuthenticationStack.Screen name="ForgotPasswordSet">
          {(screenProps) => <ForgotPasswordSet {...screenProps} />}
        </AuthenticationStack.Screen>
      </AuthenticationStack.Navigator>
    </AuthProvider>
  );
};

export default AuthenticationNavigator;
