import * as React from 'react';
import { Platform, TouchableOpacity, View, StyleSheet, Text, Image } from 'react-native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerContentComponentProps,
  DrawerContentOptions,
} from '@react-navigation/drawer';
import MainNavigator from '../MainNavigator';
import { EvilIcons } from '@expo/vector-icons';
import AboutStack from './About/AboutStack';
import AccountStack from './Account/AccountStack';
import { Auth } from 'aws-amplify';
import useUpdateAuthState from '../../../hooks/updateAuthState/useUpdateAuthState';
import { Theme } from '../../../theme/theme';
import useTheme from '../../../hooks/useTheme';

export type IDrawerRoutes = {
  Account: undefined;
  About: undefined;
  TabNavigator: undefined;
};

const DrawerNavigator = createDrawerNavigator<IDrawerRoutes>();

const DrawerContent: React.FC<DrawerContentComponentProps<DrawerContentOptions>> = (props) => {
  const updateAuthState = useUpdateAuthState();
  const theme = useTheme();
  const signOut = async () => {
    try {
      await Auth.signOut();
      updateAuthState('loggedOut');
    } catch (error) {
      console.log('Error signing out: ', error);
    }
  };
  const styles = styleSheet(theme);
  return (
    <View style={{ flex: 1 }}>
      <View style={{ height: '90%' }}>
        <DrawerContentScrollView {...props}>
          <View style={{ width: '50%' }}>
            <Image
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              source={require('../../../assets/images/logo-text.png')}
              style={{
                height: 50,
                marginHorizontal: 16,
                aspectRatio: 2.5,
                alignSelf: 'flex-start',
              }}
              resizeMethod="scale"
              resizeMode="contain"
            />
          </View>
          <TouchableOpacity
            style={styles.contactUsContainer}
            onPress={() => {
              props.navigation.navigate('Account');
            }}>
            <EvilIcons name={'user'} size={30} color={'black'} />
            <Text style={styles.drawerText}>Account</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.contactUsContainer}
            onPress={() => {
              props.navigation.navigate('About');
            }}>
            <EvilIcons name={'question'} size={30} color={'black'} />
            <Text style={styles.drawerText}>About</Text>
          </TouchableOpacity>
        </DrawerContentScrollView>
      </View>

      <TouchableOpacity style={styles.logoutContainer} onPress={signOut}>
        <Text style={styles.logoutText}>SIGN OUT</Text>
      </TouchableOpacity>
    </View>
  );
};

const Drawer: React.FC = () => {
  return (
    <DrawerNavigator.Navigator
      initialRouteName="TabNavigator"
      drawerContent={(props) => <DrawerContent {...props} />}>
      <DrawerNavigator.Screen name="TabNavigator" component={MainNavigator} />
      <DrawerNavigator.Screen name="Account" component={AccountStack} />
      <DrawerNavigator.Screen name="About" component={AboutStack} />
    </DrawerNavigator.Navigator>
  );
};

export default Drawer;

const drawerStyle = {
  activeTintColor: 'black',
  inactiveTintColor: 'black',
  labelStyle: {
    marginVertical: 16,
    marginHorizontal: 0,
  },
  iconContainerStyle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemStyle: {},
};

const styleSheet = (theme: Theme) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      paddingTop: Platform.OS === 'android' ? 25 : 0,
    },
    container: {
      flex: 1,
    },
    image: {
      resizeMode: 'contain',
      width: '80%',
      height: '100%',
    },
    contactUsContainer: {
      flexDirection: 'row',
      width: '100%',
      height: 50,
      alignItems: 'center',
      paddingLeft: 15,
    },
    logoutContainer: {
      flexDirection: 'row',
      width: '100%',
      height: 50,
      alignItems: 'flex-end',
      justifyContent: 'center',
    },
    drawerText: {
      marginLeft: 16,
    },
    logoutText: {
      color: theme.colors.darkGrey,
    },
  });
