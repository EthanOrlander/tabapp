import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Auth } from 'aws-amplify';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppTextInput from '../components/AppTextInput';
import AppButton from '../components/AppButton';

export default function ForgotPassword({ navigation, setUsername: setUsernameParent }: { navigation: any, setUsername: (username: string) => void }) {

  const [username, setUsername] = useState('');
  async function forgotPasswordSubmit() {
    try {
        await Auth.forgotPassword(username);
        setUsernameParent(username)
        console.log('✅ Success');
        navigation.navigate('ForgotPasswordSet');
    } catch (error) {
      console.log('❌ Error signing in...', error);
    }
  }

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Forgot password</Text>
        <AppTextInput
          value={username}
          onChangeText={(text: string) => setUsername(text)}
          leftIcon="account"
          placeholder="Enter username"
          autoCapitalize="none"
          keyboardType="email-address"
          textContentType="emailAddress"
        />
        <AppButton title="Send reset code" onPress={forgotPasswordSubmit} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    safeAreaContainer: {
      flex: 1,
      backgroundColor: 'white'
    },
    container: {
      flex: 1,
      alignItems: 'center'
    },
    title: {
      fontSize: 20,
      color: '#202020',
      fontWeight: '500',
      marginVertical: 15
    },
    footerButtonContainer: {
      marginVertical: 15,
      justifyContent: 'center',
      alignItems: 'center'
    },
    forgotPasswordButtonText: {
      color: 'tomato',
      fontSize: 18,
      fontWeight: '600'
    }
  });