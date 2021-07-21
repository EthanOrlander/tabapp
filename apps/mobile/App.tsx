import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Amplify, { Auth } from 'aws-amplify';

import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { PortalProvider } from '@gorhom/portal';
import { CognitoUser } from 'amazon-cognito-identity-js';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';

import AuthStack from './screens/auth/Auth';

import Home from './screens/Home';

Amplify.configure({
  Auth: {
    // region: process.env.AWS_COGNITO_REGION,
    // userPoolId: process.env.AWS_COGNITO_USER_POOL_ID,
    // userPoolWebClientId: process.env.AWS_COGNITO_USER_POOL_WEB_CLIENT_ID,
    region: 'us-east-2',
    userPoolId: 'us-east-2_ICXYUL1pp',
    userPoolWebClientId: '2017tkqfc667fd1dnmjkc0ekdt',
  },
});

const AppStack = createStackNavigator();

type AppNavigatorProps = {
  updateAuthState: (state: string) => void;
};

const AppNavigator: React.FC<AppNavigatorProps> = ({ updateAuthState }) => {
  return (
    <AppStack.Navigator>
      <AppStack.Screen name="Home">
        {(screenProps) => <Home {...screenProps} updateAuthState={updateAuthState} />}
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

const App: React.FC = () => {
  const [isUserLoggedIn, setUserLoggedIn] = useState('initializing');
  useEffect(() => {
    void checkAuthState();
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
    <SafeAreaProvider>
      <PortalProvider>
        <StatusBar />
        <NavigationContainer>
          {isUserLoggedIn === 'initializing' && <Initializing />}
          {isUserLoggedIn === 'loggedIn' && <AppNavigator updateAuthState={updateAuthState} />}
          {isUserLoggedIn === 'loggedOut' && <AuthStack updateAuthState={updateAuthState} />}
        </NavigationContainer>
      </PortalProvider>
    </SafeAreaProvider>
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
};

export default App;
