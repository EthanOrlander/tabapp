import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Auth } from 'aws-amplify';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppTextInput from '../components/AppTextInput';
import AppButton from '../components/AppButton';
import {CognitoUser} from "amazon-cognito-identity-js";

export default function ConfirmSignUp({ navigation, cognitoUser }: { navigation: any, cognitoUser: CognitoUser }) {
  const [authCode, setAuthCode] = useState('');
  async function confirmSignUp() {
    try {
      await Auth.confirmSignUp(cognitoUser.getUsername(), authCode);
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
        <Text style={styles.title}>Confirm Sign Up</Text>
        <AppTextInput
          value={authCode}
          onChangeText={text => setAuthCode(text)}
          leftIcon="numeric"
          placeholder="Enter verification code"
          keyboardType="numeric"
        />
        <AppButton title="Confirm Sign Up" onPress={confirmSignUp} />
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