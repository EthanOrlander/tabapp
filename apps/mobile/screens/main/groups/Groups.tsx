import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { SafeAreaView, View, Text, TouchableOpacity } from 'react-native';
import useDrawer from '../../../hooks/useDrawer';
import useTheme from '../../../hooks/useTheme';

type IStackNavigator = {
  Groups: undefined;
  Group: undefined;
};

const Groups: React.FC = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Groups page</Text>
    </View>
  );
};

const Group: React.FC = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>This is the modal for a specific group!</Text>
    </View>
  );
};

const StackNavigator = createStackNavigator<IStackNavigator>();

const GroupsStack: React.FC = () => {
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
      <StackNavigator.Screen name="Groups" component={Groups} />
      <StackNavigator.Screen name="Group" component={Group} />
    </StackNavigator.Navigator>
  );
};

export default GroupsStack;
