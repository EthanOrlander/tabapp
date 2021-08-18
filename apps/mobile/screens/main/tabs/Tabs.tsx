import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useDrawer from '../../../hooks/useDrawer';
import useTheme from '../../../hooks/useTheme';
import styles from '../../auth/styles';
import { IBottomTabs } from '../MainNavigator';

type TabsTabParams = {
  Incoming: undefined;
  Outgoing: undefined;
};

const TabsNavigator = createMaterialTopTabNavigator<TabsTabParams>();

const Incoming: React.FC = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Incoming!</Text>
    </View>
  );
};

const Outgoing: React.FC = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Outgoing!</Text>
    </View>
  );
};

const Tabs: React.FC = () => {
  return (
    <TabsNavigator.Navigator>
      <TabsNavigator.Screen name="Incoming" component={Incoming} />
      <TabsNavigator.Screen name="Outgoing" component={Outgoing} />
    </TabsNavigator.Navigator>
  );
};

const Tab: React.FC = () => {
  return (
    <SafeAreaView>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>This is the modal for a specific tab!</Text>
      </View>
    </SafeAreaView>
  );
};

type IStackNavigator = {
  Tabs: undefined;
  Tab: undefined;
};

const StackNavigator = createStackNavigator<IStackNavigator>();

const TabsStack: React.FC<BottomTabScreenProps<IBottomTabs, 'Tabs'>> = () => {
  const { openDrawer } = useDrawer();
  const theme = useTheme();
  return (
    <StackNavigator.Navigator
      headerMode="screen"
      screenOptions={{
        headerLeft: () => (
          <TouchableOpacity onPress={openDrawer} style={{ paddingHorizontal: 16 }}>
            <MaterialCommunityIcons name="menu" size={25} color={theme.colors.foreground} />
          </TouchableOpacity>
        ),
      }}>
      <StackNavigator.Screen name="Tabs" component={Tabs} />
      <StackNavigator.Screen name="Tab" component={Tab} />
    </StackNavigator.Navigator>
  );
};

export default TabsStack;
