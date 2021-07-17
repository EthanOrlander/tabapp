import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Auth } from 'aws-amplify';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppTextInput from '../components/AppTextInput';
import AppButton from '../components/AppButton';
import {CognitoUser} from "amazon-cognito-identity-js";

export default function SignUp({ navigation, setCognitoUser }: {navigation: any, setCognitoUser: (user: CognitoUser) => void }) {
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  async function signUp() {
    try {
      const res = await Auth.signUp({ username: phoneNumber, password, attributes: { email, phone_number: phoneNumber, given_name: firstName, family_name: lastName } });
      setCognitoUser(res.user)
      console.log('✅ Sign-up Confirmed');
      navigation.navigate('ConfirmSignUp');
    } catch (error) {
      console.log('❌ Error signing up...', error);
    }
  }
  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Create a new account</Text>
        <AppTextInput
          value={firstName}
          onChangeText={text => setFirstName(text)}
          leftIcon="account"
          placeholder="Enter first name"
          autoCapitalize="words"
          keyboardType="default"
          textContentType="givenName"
        />
        <AppTextInput
          value={lastName}
          onChangeText={text => setLastName(text)}
          leftIcon="account"
          placeholder="Enter last name"
          autoCapitalize="words"
          keyboardType="default"
          textContentType="familyName"
        />
        <AppTextInput
          value={phoneNumber}
          onChangeText={text => setPhoneNumber(text)}
          leftIcon="phone"
          placeholder="Enter mobile"
          autoCapitalize="none"
          keyboardType="phone-pad"
          textContentType="telephoneNumber"
        />
        <AppTextInput
          value={email}
          onChangeText={text => setEmail(text)}
          leftIcon="email"
          placeholder="Enter email"
          autoCapitalize="none"
          keyboardType="email-address"
          textContentType="emailAddress"
        />
        <AppTextInput
          value={password}
          onChangeText={text => setPassword(text)}
          leftIcon="lock"
          placeholder="Enter password"
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry
          textContentType="password"
        />
        <AppButton title="Sign Up" onPress={signUp} />
        <View style={styles.footerButtonContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
            <Text style={styles.forgotPasswordButtonText}>
              Already have an account? Sign In
            </Text>
          </TouchableOpacity>
        </View>
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