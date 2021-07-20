import React, { useContext, useRef } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Auth } from 'aws-amplify';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import AuthContext from './AuthContext';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './Auth';
import styles from './styles';
import FormInput, { FormInputProps } from '../../components/FormInput';
import AppButton from '../../components/AppButton';
import { useState } from 'react';

interface FormData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  password: string;
}

const phoneRegExp =
  /^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)?$/;

const schema = yup.object().shape({
  firstName: yup.string().required('Required'),
  lastName: yup.string().required('Required'),
  phoneNumber: yup
    .string()
    .required('Required')
    .matches(phoneRegExp, 'Phone number must be formatted +16475238795'),
  email: yup.string().email('Enter a valid email').required('Required'),
  password: yup.string().required('Required'),
});

interface SignUpProps {
  navigation: StackNavigationProp<RootStackParamList, 'SignUp'>;
  route: RouteProp<RootStackParamList, 'SignUp'>;
}

// TODO what happens when user signs up but doesn't confirm phone #?
// They can't log in and they can't reuse the info to sign up
const SignUp: React.FC<SignUpProps> = ({ navigation }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: yupResolver(schema) });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setCognitoUser } = useContext(AuthContext);
  const ref_lastName = useRef<HTMLDivElement>(null);
  const ref_phoneNumber = useRef<HTMLDivElement>(null);
  const ref_email = useRef<HTMLDivElement>(null);
  const ref_password = useRef<HTMLDivElement>(null);

  async function onSubmit(data: FormData) {
    setIsSubmitting(true);
    try {
      const params = new URLSearchParams({ phone_number: encodeURIComponent(data.phoneNumber) });
      // This checks if a user abandoned signup with this phone number, and deletes the abandoned record if it exists
      await fetch(
        `https://0xny7s40fh.execute-api.us-east-2.amazonaws.com/stage/preSignUp?${params.toString()}`,
      );
      const res = await Auth.signUp({
        username: data.phoneNumber,
        password: data.password,
        attributes: {
          email: data.email,
          phone_number: data.phoneNumber,
          given_name: data.firstName,
          family_name: data.lastName,
        },
      });
      setCognitoUser(res.user);
      console.log('✅ Sign-up Confirmed');
      navigation.navigate('ConfirmSignUp');
    } catch (error) {
      console.log('❌ Error signing up...', error);
      // TODO display error message above sign up button. Can map the error codes from AWS to friendlier messages
    }
    setIsSubmitting(false);
  }

  const formInputs: Array<FormInputProps & React.RefAttributes<any>> = [
    {
      label: 'First name',
      leftIcon: 'account',
      control,
      error: errors.firstName?.message,
      name: 'firstName',
      textInputProps: {
        placeholder: 'Enter first name',
        autoCapitalize: 'words',
        keyboardType: 'default',
        textContentType: 'givenName',
        returnKeyType: 'next',
        onSubmitEditing: () => ref_lastName.current?.focus(),
      },
    },
    {
      label: 'Last name',
      leftIcon: 'account',
      control,
      error: errors.lastName?.message,
      name: 'lastName',
      ref: ref_lastName,
      textInputProps: {
        placeholder: 'Enter last name',
        autoCapitalize: 'words',
        keyboardType: 'default',
        textContentType: 'familyName',
        returnKeyType: 'next',
        onSubmitEditing: () => ref_phoneNumber.current?.focus(),
      },
    },
    {
      label: 'Phone number',
      leftIcon: 'phone',
      control,
      error: errors.phoneNumber?.message,
      name: 'phoneNumber',
      ref: ref_phoneNumber,
      phone: true,
      textInputProps: {
        placeholder: 'Enter mobile',
        autoCapitalize: 'none',
        keyboardType: 'phone-pad',
        textContentType: 'telephoneNumber',
        returnKeyType: 'next',
        onSubmitEditing: () => ref_email.current?.focus(),
      },
    },
    {
      label: 'Email',
      leftIcon: 'email',
      control,
      error: errors.email?.message,
      name: 'email',
      ref: ref_email,
      textInputProps: {
        placeholder: 'Enter email',
        autoCapitalize: 'none',
        keyboardType: 'email-address',
        textContentType: 'emailAddress',
        returnKeyType: 'next',
        onSubmitEditing: () => ref_password.current?.focus(),
      },
    },
    {
      label: 'Password',
      leftIcon: 'lock',
      control,
      error: errors.password?.message,
      name: 'password',
      ref: ref_password,
      textInputProps: {
        placeholder: 'Enter password',
        autoCapitalize: 'none',
        keyboardType: 'default',
        secureTextEntry: true,
        textContentType: 'password',
        autoCorrect: false,
        returnKeyType: 'done',
        onSubmitEditing: handleSubmit(onSubmit),
      },
    },
  ];

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <KeyboardAwareScrollView enableOnAndroid={true} extraScrollHeight={5}>
        <View style={styles.container}>
          <Text style={styles.title}>Create a new account</Text>
          {formInputs.map((formInput, key) => (
            <FormInput key={key} {...formInput} />
          ))}
          <AppButton title="Sign Up" onPress={handleSubmit(onSubmit)} isLoading={isSubmitting} />
          <View style={styles.footerButtonContainer}>
            <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
              <Text style={styles.forgotPasswordButtonText}>Already have an account? Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
