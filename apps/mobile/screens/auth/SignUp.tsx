import React, { useRef } from 'react';
import { View, Text, TextInput as RNTextInput, Image } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Auth } from 'aws-amplify';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './Auth';
import styles from './styles';
import FormInput, { FormInputProps } from '../../components/FormInput';
import Button from '../../components/Button';
import { useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Tooltip from '../../components/Tooltip';
import { sanitizeCognitoErrorMessage } from './utils';
import { testProperties } from '../../utils/TestProperties';
import useAuth from '../../hooks/useAuth';

interface FormData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  password: string;
}

const phoneRegExp =
  /^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)?$/;

// eslint-disable-next-line no-useless-escape
const passwordRegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;

const schema = yup.object().shape({
  firstName: yup.string().required('Required'),
  lastName: yup.string().required('Required'),
  phoneNumber: yup
    .string()
    .required('Required')
    .matches(phoneRegExp, 'Phone number must be formatted +16475238795'),
  email: yup.string().email('Enter a valid email').required('Required'),
  password: yup
    .string()
    .required('Required')
    .matches(
      passwordRegExp,
      'Must Contain 8 Characters, One Uppercase, One Lowercase, and One Number',
    ),
});

interface SignUpProps {
  navigation: StackNavigationProp<RootStackParamList, 'SignUp'>;
  route: RouteProp<RootStackParamList, 'SignUp'>;
}

const SignUp: React.FC<SignUpProps> = ({ navigation }) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: yupResolver(schema) });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setCognitoUser } = useAuth();
  const ref_lastName = useRef<RNTextInput>(null);
  const ref_phoneNumber = useRef<RNTextInput>(null);
  const ref_email = useRef<RNTextInput>(null);
  const ref_password = useRef<RNTextInput>(null);
  const [cognitoError, setCognitoError] = useState<{
    code: string;
    message: string;
    name: string;
  } | null>(null);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    const params = new URLSearchParams({ phone_number: encodeURIComponent(data.phoneNumber) });
    // This checks if a user abandoned signup with this phone number, and deletes the abandoned record if it exists
    await fetch(
      `https://0xny7s40fh.execute-api.us-east-2.amazonaws.com/stage/preSignUp?${params.toString()}`,
    );
    await Auth.signUp({
      username: data.phoneNumber,
      password: data.password,
      attributes: {
        email: data.email,
        phone_number: data.phoneNumber,
        given_name: data.firstName,
        family_name: data.lastName,
      },
    })
      .then((res) => {
        setCognitoUser(res.user);
        setCognitoError(null);
        console.log('✅ Sign-up Confirmed');
        navigation.navigate('ConfirmSignUp');
      })
      .catch(setCognitoError);
    setIsSubmitting(false);
  };

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
      tooltip: (
        <Tooltip
          anchor={<MaterialCommunityIcons name="information" size={18} color="#6e6869" />}
          popover={
            <View style={styles.passwordRequirementsContainer}>
              <Text style={styles.passwordRequirementsTitle}>Password requirements</Text>
              {[
                '8 characters minimum',
                'at least 1 lowercase letter',
                'at least 1 uppercase letter',
                'at least 1 number',
              ].map((requirement, key) => (
                <Text style={styles.passwordRequirementsBody} key={key}>
                  • {requirement}
                </Text>
              ))}
            </View>
          }
        />
      ),
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
    <KeyboardAwareScrollView enableOnAndroid={true} extraScrollHeight={5}>
      <View style={styles.container}>
        <Text style={styles.title}>Create a new account</Text>
        {cognitoError && (
          <Text style={styles.cognitoError}>
            {sanitizeCognitoErrorMessage(cognitoError.message)}
          </Text>
        )}
        {formInputs.map((formInput, key) => (
          <FormInput key={key} {...formInput} />
        ))}
        <Button
          testProps={testProperties('button-sign-up')}
          color="primary"
          fill="solid"
          size="large"
          title="Sign Up"
          onPress={handleSubmit(onSubmit)}
          isLoading={isSubmitting}
        />
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
    </KeyboardAwareScrollView>
  );
};

export default SignUp;
