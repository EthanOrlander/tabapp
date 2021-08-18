import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import { DrawerScreenProps } from '@react-navigation/drawer';
import React from 'react';
import useTheme from '../../../../hooks/useTheme';
import { IDrawerRoutes } from '../Drawer';
import About from './About';
import { TouchableOpacity } from 'react-native';

type IStackNavigator = {
  About: undefined;
};

const StackNavigator = createStackNavigator<IStackNavigator>();

const AboutStack: React.FC<DrawerScreenProps<IDrawerRoutes, 'About'>> = ({ navigation }) => {
  const theme = useTheme();
  return (
    <StackNavigator.Navigator
      headerMode="screen"
      screenOptions={{
        headerLeft: () => (
          <TouchableOpacity
            onPress={navigation.goBack.bind(null)}
            style={{ paddingHorizontal: 16 }}>
            <MaterialCommunityIcons name="arrow-left" size={25} color={theme.colors.foreground} />
          </TouchableOpacity>
        ),
      }}>
      <StackNavigator.Screen name="About" component={About} />
    </StackNavigator.Navigator>
  );
};

export default AboutStack;
