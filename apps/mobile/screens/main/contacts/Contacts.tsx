import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { SafeAreaView, View, Text, TouchableOpacity } from 'react-native';
import useDrawer from '../../../hooks/useDrawer';
import useTheme from '../../../hooks/useTheme';

type IStackNavigator = {
  Contacts: undefined;
  Contact: undefined;
};

const Contacts: React.FC = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Contacts page</Text>
    </View>
  );
};

const Contact: React.FC = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>This is the modal for a specific contact!</Text>
    </View>
  );
};

const StackNavigator = createStackNavigator<IStackNavigator>();

const ContactsStack: React.FC = () => {
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
      <StackNavigator.Screen name="Contacts" component={Contacts} />
      <StackNavigator.Screen name="Contact" component={Contact} />
    </StackNavigator.Navigator>
  );
};

export default ContactsStack;
