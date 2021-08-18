import * as React from 'react';
import { Image, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Auth } from 'aws-amplify';
import Tabs from './tabs/Tabs';
import useTheme from '../../hooks/useTheme';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../auth/styles';
import { DrawerScreenProps } from '@react-navigation/drawer';
import Contacts from './contacts/Contacts';
import Groups from './groups/Groups';
import { IDrawerRoutes } from './drawer/Drawer';
import { DrawerProvider } from './drawer/DrawerContext';

// const Tabs: React.FC<{ updateAuthState: (authState: string) => void }> = ({ updateAuthState }) => {
// async function signOut() {
//   try {
//     await Auth.signOut();
//     updateAuthState('loggedOut');
//   } catch (error) {
//     console.log('Error signing out: ', error);
//   }
// }
//   return (
//     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//       <Text>Home!</Text>
//       <Button title="Sign Out" color="tomato" onPress={signOut} />
//     </View>
//   );
// };

export type IBottomTabs = {
  Tabs: undefined;
  Contacts: undefined;
  Groups: undefined;
};

const Tab = createBottomTabNavigator<IBottomTabs>();

const MainNavigator: React.FC<DrawerScreenProps<IDrawerRoutes, 'TabNavigator'>> = ({
  navigation: drawerNavigation,
}) => {
  const theme = useTheme();
  return (
    <DrawerProvider value={{ openDrawer: () => drawerNavigation.openDrawer() }}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, size }) => {
            let icon = null;
            if (route.name === 'Tabs') {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              icon = focused
                ? require('../../assets/images/tabs-active.png')
                : require('../../assets/images/tabs.png');
            } else if (route.name === 'Contacts') {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              icon = focused
                ? require('../../assets/images/contacts-active.png')
                : require('../../assets/images/contacts.png');
            } else if (route.name === 'Groups') {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              icon = focused
                ? require('../../assets/images/groups-active.png')
                : require('../../assets/images/groups.png');
            }

            // You can return any component that you like here!
            return (
              <Image
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                source={icon}
                resizeMethod="scale"
                resizeMode="contain"
                style={{ width: size }}
              />
            );
          },
        })}
        tabBarOptions={{
          activeTintColor: theme.colors.primary as string,
          inactiveTintColor: theme.colors.darkGrey as string,
        }}>
        {/* <Tab.Screen name="Tabs">
        {(screenProps) => <Tabs {...screenProps} updateAuthState={updateAuthState} />}
      </Tab.Screen> */}
        <Tab.Screen
          name="Tabs"
          options={{ title: 'Tabs', tabBarTestID: 'button-tabbar-tabs' }}
          component={Tabs}
        />
        {/*
        // Stopped here. I've got all the navigators working and nested properly // Need to add a
        button to the tab screen headers to open drawer // Need to remove tab navigation from drawer
        */}
        <Tab.Screen
          name="Contacts"
          options={{ title: 'Contacts', tabBarTestID: 'button-tabbar-contacts' }}
          component={Contacts}
        />
        <Tab.Screen
          name="Groups"
          options={{ title: 'Groups', tabBarTestID: 'button-tabbar-groups' }}
          component={Groups}
        />
      </Tab.Navigator>
    </DrawerProvider>
  );
};

export default MainNavigator;
