import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Amplify, { Auth } from 'aws-amplify';

import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {CognitoUser} from "amazon-cognito-identity-js";

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';

import SignIn from './screens/SignIn';
import SignUp from './screens/SignUp';
import ConfirmSignUp from './screens/ConfirmSignUp';
import ConfirmSignIn from './screens/ConfirmSignIn';
import ForgotPassword from "./screens/ForgotPassword";
import ForgotPasswordSet from "./screens/ForgotPasswordSet";

import Home from './screens/Home';

Amplify.configure({
  Auth: {
    // region: process.env.AWS_COGNITO_REGION,
    // userPoolId: process.env.AWS_COGNITO_USER_POOL_ID,
    // userPoolWebClientId: process.env.AWS_COGNITO_USER_POOL_WEB_CLIENT_ID,
    region: "us-east-2",
    userPoolId: "us-east-2_ICXYUL1pp",
    userPoolWebClientId: "2017tkqfc667fd1dnmjkc0ekdt",
  },
});

const AuthenticationStack = createStackNavigator();
const AppStack = createStackNavigator();

const AuthenticationNavigator = (props: any) => {
  return (
    <AuthenticationStack.Navigator headerMode="none">
      <AuthenticationStack.Screen name="SignIn">
        {screenProps => (
          <SignIn {...screenProps} setCognitoUser={props.setCognitoUser}/>
        )}
      </AuthenticationStack.Screen>
      <AuthenticationStack.Screen name="SignUp">
      {screenProps => (
          <SignUp {...screenProps} setCognitoUser={props.setCognitoUser}/>
        )}
      </AuthenticationStack.Screen>
      <AuthenticationStack.Screen
        name="ConfirmSignUp">
          {screenProps => (
          <ConfirmSignUp {...screenProps} cognitoUser={props.cognitoUser}/>
        )}
        </AuthenticationStack.Screen>
      <AuthenticationStack.Screen name="ConfirmSignIn">
        {screenProps => (<ConfirmSignIn {...screenProps} updateAuthState={props.updateAuthState} cognitoUser={props.cognitoUser}/>)}
        </AuthenticationStack.Screen>
        <AuthenticationStack.Screen name="ForgotPassword">
        {screenProps => (<ForgotPassword {...screenProps} setUsername={props.setUsername} />)}
        </AuthenticationStack.Screen>
        <AuthenticationStack.Screen name="ForgotPasswordSet">
        {screenProps => (<ForgotPasswordSet {...screenProps} username={props.username} />)}
        </AuthenticationStack.Screen>
    </AuthenticationStack.Navigator>
  );
};
const AppNavigator = (props: any) => {
  return (
    <AppStack.Navigator>
      <AppStack.Screen name="Home">
        {screenProps => (
          <Home {...screenProps} updateAuthState={props.updateAuthState} />
        )}
      </AppStack.Screen>
    </AppStack.Navigator>
  );
};
const Initializing = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="tomato" />
    </View>
  );
};

function App() {

  const [isUserLoggedIn, setUserLoggedIn] = useState('initializing');
  // CognitoUser needed in confirmSignUp function & confirmSignIn function
  const [cognitoUser, setCognitoUser] = useState<CognitoUser | null>();
  // Username needed in forgotpassword function
  const [username, setUsername] = useState<CognitoUser | null>();

  useEffect(() => {
    checkAuthState();
  }, []);
  async function checkAuthState() {
    try {
      await Auth.currentAuthenticatedUser();
      console.log('✅ User is signed in');
      setUserLoggedIn('loggedIn');
    } catch (err) {
      console.log('❌ User is not signed in');
      setUserLoggedIn('loggedOut');
    }
  }
  function updateAuthState(isUserLoggedIn: string) {
    setUserLoggedIn(isUserLoggedIn);
  }

  return (
    <NavigationContainer>
      {isUserLoggedIn === 'initializing' && <Initializing />}
      {isUserLoggedIn === 'loggedIn' && (
        <AppNavigator updateAuthState={updateAuthState}/>
      )}
      {isUserLoggedIn === 'loggedOut' && (
        <AuthenticationNavigator updateAuthState={updateAuthState} cognitoUser={cognitoUser} setCognitoUser={setCognitoUser} username={username} setUsername={setUsername}/>
      )}
    </NavigationContainer>
  );
  // const isLoadingComplete = useCachedResources();
  // const colorScheme = useColorScheme();
  // if (!isLoadingComplete) {
  //   return null;
  // } else {
  //   return (
  //     <SafeAreaProvider>
  //       {/* <Navigation colorScheme={colorScheme} /> */}
  //       <StatusBar />
  //     </SafeAreaProvider>
  //   );
  // }
}


export default App;
