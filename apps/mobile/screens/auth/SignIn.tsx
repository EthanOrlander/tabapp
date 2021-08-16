import React, { useState } from 'react';
import { View, Text, TextInput as RNTextInput, Image } from 'react-native';
import { Auth } from 'aws-amplify';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/Button';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from './Auth';
import { useRef } from 'react';
import styles from './styles';
import FormInput, { FormInputProps } from '../../components/FormInput';
import { sanitizeCognitoErrorMessage } from './utils';
import { testProperties } from '../../utils/TestProperties';
import useAuth from '../../hooks/useAuth';

interface FormData {
  phoneNumber: string;
  password: string;
}

const phoneRegExp =
  /^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)?$/;

const schema = yup.object().shape({
  phoneNumber: yup
    .string()
    .required('Required')
    .matches(phoneRegExp, 'Phone number must be formatted +16475238795'),
  password: yup.string().required('Required'),
});

interface SignInProps {
  navigation: StackNavigationProp<RootStackParamList, 'SignIn'>;
  route: RouteProp<RootStackParamList, 'SignIn'>;
}

// TODO Mask phone # input
const SignIn: React.FC<SignInProps> = ({ navigation }) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });
  const { setCognitoUser } = useAuth();
  const ref_password = useRef<RNTextInput>(null);
  const [cognitoError, setCognitoError] = useState<{
    code: string;
    message: string;
    name: string;
  } | null>(null);

  const onSubmit = async (data: FormData) => {
    await Auth.signIn(data.phoneNumber, data.password)
      .then((res) => {
        setCognitoUser(res);
        setCognitoError(null);
        navigation.navigate('ConfirmSignIn');
      })
      .catch(setCognitoError);
  };

  const formInputs: Array<FormInputProps & React.RefAttributes<any>> = [
    {
      label: 'Phone number',
      leftIcon: 'phone',
      control,
      error: errors.phoneNumber?.message,
      name: 'phoneNumber',
      phone: true,
      textInputProps: {
        ...testProperties('input-phone-number'),
        placeholder: 'Enter mobile',
        autoCapitalize: 'none',
        keyboardType: 'phone-pad',
        textContentType: 'telephoneNumber',
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
        ...testProperties('input-password'),
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
    <SafeAreaView style={styles.safeAreaContainer} {...testProperties('screen-sign-in')}>
      <View
        style={{
          width: '100%',
          height: '100%',
          justifyContent: 'space-between',
          display: 'flex',
          flexDirection: 'column',
        }}>
        <View style={styles.container}>
          <Text style={styles.title}>Sign in to your account</Text>
          {cognitoError && (
            <Text style={styles.cognitoError}>
              {sanitizeCognitoErrorMessage(cognitoError.message)}
            </Text>
          )}
          {formInputs.map((formInput, key) => (
            <FormInput key={key} {...formInput} />
          ))}
          <View style={styles.forgotPasswordButtonContainer}>
            <Button
              testProps={testProperties('button-forgot-password')}
              color="primary"
              fill="clear"
              size="small"
              title="Forgot"
              uppercase={false}
              onPress={() => navigation.navigate('ForgotPassword')}
            />
          </View>
          <View style={styles.submitButtonContainer}>
            <Button
              testProps={testProperties('button-sign-in')}
              color="primary"
              fill="solid"
              size="large"
              title="Sign In"
              onPress={handleSubmit(onSubmit)}
              isLoading={isSubmitting}
            />
          </View>
        </View>
        <View style={{ width: '100%' }}>
          <Image
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            source={require('../../assets/images/logo-text.png')}
            style={{ width: '100%' }}
            resizeMethod="scale"
            resizeMode="center"
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SignIn;
