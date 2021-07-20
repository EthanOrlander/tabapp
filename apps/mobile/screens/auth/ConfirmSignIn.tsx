import React, { useContext } from 'react';
import { View, Text } from 'react-native';
import { Auth } from 'aws-amplify';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppButton from '../../components/AppButton';
import AuthContext from './AuthContext';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './Auth';
import * as yup from 'yup';
import FormInput, { FormInputProps } from '../../components/FormInput';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import styles from './styles';

interface FormData {
  code: string;
}

const schema = yup.object().shape({
  code: yup.string().required('Please enter the code we sent to your phone.'),
});

interface ConfirmSignInProps {
  navigation: StackNavigationProp<RootStackParamList, 'ConfirmSignIn'>;
  route: RouteProp<RootStackParamList, 'ConfirmSignIn'>;
}

const ConfirmSignIn: React.FC<ConfirmSignInProps> = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });
  const { updateAuthState, cognitoUser } = useContext(AuthContext);
  async function onSubmit(data: FormData) {
    try {
      await Auth.confirmSignIn(cognitoUser, data.code, 'SMS_MFA');
      console.log('✅ Code confirmed');
      updateAuthState('loggedIn');
    } catch (error) {
      console.log(
        '❌ Verification code does not match. Please enter a valid verification code.',
        error,
      );
    }
  }
  const formInput: FormInputProps & React.RefAttributes<any> = {
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
      returnKeyType: 'done',
      onSubmitEditing: handleSubmit(onSubmit),
    },
  };
  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Confirm Sign In</Text>
        <FormInput {...formInput} />
        <AppButton title="Confirm" onPress={handleSubmit(onSubmit)} isLoading={isSubmitting} />
      </View>
    </SafeAreaView>
  );
};

export default ConfirmSignIn;
