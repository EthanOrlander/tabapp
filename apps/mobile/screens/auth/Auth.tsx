import React, { useState } from 'react';
import { createStackNavigator, HeaderBackButton } from '@react-navigation/stack';
import { CognitoUser } from 'amazon-cognito-identity-js';
import ConfirmSignIn from './ConfirmSignIn';
import ConfirmSignUp from './ConfirmSignUp';
import ForgotPassword from './ForgotPassword';
import ForgotPasswordSet from './ForgotPasswordSet';
import SignIn from './SignIn';
import SignUp from './SignUp';
import Landing from './Landing';
import { AuthProvider } from './AuthContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import useTheme from '../../hooks/useTheme';

type AuthenticationNavigatorProps = {
  updateAuthState: (state: string) => void;
};

export type RootStackParamList = {
  Landing: undefined;
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
  const theme = useTheme();

  return (
    <AuthProvider value={{ updateAuthState, cognitoUser, setCognitoUser, username, setUsername }}>
      <AuthenticationStack.Navigator
        headerMode="screen"
        initialRouteName="Landing"
        screenOptions={{
          headerLeft: (props) => (
            <HeaderBackButton
              {...props}
              labelVisible={false}
              accessibilityLabel="button-back"
              backImage={() => (
                <MaterialCommunityIcons
                  name="chevron-left"
                  size={25}
                  color={theme.colors.foreground}
                />
              )}
            />
          ),
        }}>
        <AuthenticationStack.Screen
          name="Landing"
          options={{
            headerShown: false,
          }}
          component={Landing}
        />
        <AuthenticationStack.Screen
          name="SignIn"
          options={{
            title: 'Sign In',
            headerBackAccessibilityLabel: 'button-back',
          }}
          component={SignIn}
        />
        <AuthenticationStack.Screen
          name="SignUp"
          component={SignUp}
          options={{ title: 'Sign Up' }}
        />
        <AuthenticationStack.Screen
          name="ConfirmSignUp"
          component={ConfirmSignUp}
          options={{ title: 'Confirm Sign Up' }}
        />
        <AuthenticationStack.Screen
          name="ConfirmSignIn"
          component={ConfirmSignIn}
          options={{ title: 'Confirm Sign In' }}
        />
        <AuthenticationStack.Screen
          name="ForgotPassword"
          component={ForgotPassword}
          options={{ title: 'Forgot Password' }}
        />
        <AuthenticationStack.Screen
          name="ForgotPasswordSet"
          component={ForgotPasswordSet}
          options={{ title: 'New Password' }}
        />
      </AuthenticationStack.Navigator>
    </AuthProvider>
  );
};

export default AuthenticationNavigator;
