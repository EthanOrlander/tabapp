import React, { useContext } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Auth } from 'aws-amplify';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppButton from '../../components/AppButton';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from './Auth';
import AuthContext from './AuthContext';
import { useRef } from 'react';
import styles from './styles';
import FormInput, { FormInputProps } from '../../components/FormInput';

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
  const { setCognitoUser } = useContext(AuthContext);
  const ref_password = useRef<HTMLDivElement>(null);
  async function onSubmit(data: FormData) {
    try {
      console.log(data.phoneNumber);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const res = await Auth.signIn(data.phoneNumber, data.password);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      setCognitoUser(res);
      console.log('✅ Success');
      navigation.navigate('ConfirmSignIn');
    } catch (error) {
      console.log('❌ Error signing in...', error);
    }
  }

  const formInputs: Array<FormInputProps & React.RefAttributes<any>> = [
    {
      label: 'Phone number',
      leftIcon: 'phone',
      control,
      error: errors.phoneNumber?.message,
      name: 'phoneNumber',
      phone: true,
      textInputProps: {
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
      <View style={styles.container}>
        <Text style={styles.title}>Sign in to your account</Text>
        {formInputs.map((formInput, key) => (
          <FormInput key={key} {...formInput} />
        ))}
        <View style={styles.forgotPasswordButtonContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text
              style={styles.forgotPasswordButtonText}
              onPress={() => navigation.navigate('ForgotPassword')}>
              Forgot my password
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.submitButtonContainer}>
          <AppButton title="Submit" onPress={handleSubmit(onSubmit)} isLoading={isSubmitting} />
        </View>
        <View style={styles.signUpLinkContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            {/*eslint-disable-next-line react/no-unescaped-entities*/}
            <Text style={styles.signUpLink}>Don't have an account? Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SignIn;
