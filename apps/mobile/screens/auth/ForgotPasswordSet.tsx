import React, { useContext, useRef, useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { Auth } from 'aws-amplify';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppTextInput from '../../components/AppTextInput';
import AppButton from '../../components/AppButton';
import AuthContext from './AuthContext';
import * as yup from 'yup';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './Auth';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import styles from './styles';
import FormInput, { FormInputProps } from '../../components/FormInput';
import { sanitizeCognitoErrorMessage } from './utils';
import { testProperties } from '../../utils/TestProperties';

interface FormData {
  code: string;
  password: string;
}

const schema = yup.object().shape({
  code: yup.string().required('Please enter the code we sent to your phone.'),
  password: yup.string().required('Required'),
});

interface ForgotPasswordSetProps {
  navigation: StackNavigationProp<RootStackParamList, 'ForgotPasswordSet'>;
  route: RouteProp<RootStackParamList, 'ForgotPasswordSet'>;
}

const ForgotPasswordSet: React.FC<ForgotPasswordSetProps> = ({ navigation }) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });
  const { username } = useContext(AuthContext);
  const ref_password = useRef<TextInput>(null);
  const [cognitoError, setCognitoError] = useState<{
    code: string;
    message: string;
    name: string;
  } | null>(null);

  const onSubmit = async (data: FormData) => {
    if (username)
      await Auth.forgotPasswordSubmit(username, data.code, data.password)
        .then(() => {
          setCognitoError(null);
          navigation.navigate('SignIn');
        })
        .catch(setCognitoError);
    else throw Error('username is undefined');
  };
  const formInputs: Array<FormInputProps & React.RefAttributes<any>> = [
    {
      label: 'Code',
      leftIcon: 'numeric',
      control,
      error: errors.code?.message,
      name: 'code',
      textInputProps: {
        placeholder: 'Enter verification code',
        autoCapitalize: 'none',
        keyboardType: 'numeric',
        textContentType: 'oneTimeCode',
        returnKeyType: 'next',
        onSubmitEditing: () => ref_password.current?.focus(),
      },
    },
    {
      label: 'New Password',
      leftIcon: 'lock',
      control,
      error: errors.password?.message,
      name: 'password',
      ref: ref_password,
      textInputProps: {
        placeholder: 'Enter new password',
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
        <Text style={styles.title}>Forgot password</Text>
        {cognitoError && (
          <Text style={styles.cognitoError}>
            {sanitizeCognitoErrorMessage(cognitoError.message)}
          </Text>
        )}
        {formInputs.map((formInput, key) => (
          <FormInput key={key} {...formInput} />
        ))}
        <AppButton
          testProps={testProperties('button-forgot-password-set')}
          title="Set new password"
          onPress={handleSubmit(onSubmit)}
          isLoading={isSubmitting}
        />
      </View>
    </SafeAreaView>
  );
};

export default ForgotPasswordSet;
