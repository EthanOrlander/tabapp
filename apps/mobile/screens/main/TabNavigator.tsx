import * as React from 'react';
import { Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Tabs from './tabs/Tabs';
import useTheme from '../../hooks/useTheme';
import { DrawerScreenProps } from '@react-navigation/drawer';
import Contacts from './contacts/Contacts';
import Groups from './groups/Groups';
import { IDrawerRoutes } from './drawer/Drawer';
import { DrawerProvider } from './drawer/DrawerContext';

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
          safeAreaInsets: { bottom: 10 },
          style: {
            paddingTop: 10,
          },
        }}>
        <Tab.Screen
          name="Tabs"
          options={{ title: 'Tabs', tabBarTestID: 'button-tabbar-tabs' }}
          component={Tabs}
        />
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
