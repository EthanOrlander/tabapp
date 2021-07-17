import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Auth } from 'aws-amplify';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppTextInput from '../components/AppTextInput';
import AppButton from '../components/AppButton';

export default function ForgotPassword({ navigation, username }: { navigation: any, username: string }) {
  const [password, setPassword] = useState('');
  const [authCode, setAuthCode] = useState('');
  async function forgotPasswordSubmit() {
    try {
      await Auth.forgotPasswordSubmit(username, authCode, password);
      console.log('✅ Code confirmed');
      navigation.navigate('SignIn');
    } catch (error) {
      console.log(
        '❌ Verification code does not match. Please enter a valid verification code.',
        error.code
      );
    }
  }
  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Forgot password</Text>
        <AppTextInput
          value={authCode}
          onChangeText={text => setAuthCode(text)}
          leftIcon="numeric"
          placeholder="Enter verification code"
          keyboardType="numeric"
        />
        <AppTextInput
          value={password}
          onChangeText={(text: string) => setPassword(text)}
          leftIcon="lock"
          placeholder="Enter new password"
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry
          textContentType="password"
        />
        <AppButton title="Set new password" onPress={forgotPasswordSubmit} />
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
    }
  });