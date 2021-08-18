import React from 'react';
import { View, Text, Image } from 'react-native';
import { Auth } from 'aws-amplify';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/Button';
import useAuth from '../../hooks/useAuth';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './Auth';
import * as yup from 'yup';
import FormInput, { FormInputProps } from '../../components/FormInput';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import styles from './styles';
import { sanitizeCognitoErrorMessage } from './utils';
import { useState } from 'react';
import { testProperties } from '../../utils/TestProperties';

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
  const { updateAuthState, cognitoUser } = useAuth();
  const [cognitoError, setCognitoError] = useState<{
    code: string;
    message: string;
    name: string;
  } | null>(null);

  const onSubmit = async (data: FormData) => {
    await Auth.confirmSignIn(cognitoUser, data.code, 'SMS_MFA')
      .then(() => {
        setCognitoError(null);
        updateAuthState('loggedIn');
      })
      .catch(setCognitoError);
  };

  const formInput: FormInputProps & React.RefAttributes<any> = {
    label: 'Code',
    leftIcon: 'numeric',
    control,
    error: errors.code?.message,
    name: 'code',
    textInputProps: {
      ...testProperties('input-code'),
      placeholder: 'Enter verification code',
      autoCapitalize: 'none',
      keyboardType: 'numeric',
      textContentType: 'oneTimeCode',
      returnKeyType: 'done',
      onSubmitEditing: handleSubmit(onSubmit),
    },
  };
  return (
    <View
      style={{
        width: '100%',
        height: '100%',
        justifyContent: 'space-between',
        display: 'flex',
        flexDirection: 'column',
      }}>
      <View style={styles.container}>
        <Text style={styles.title}>Confirm Sign In</Text>
        {cognitoError && (
          <Text style={styles.cognitoError}>
            {sanitizeCognitoErrorMessage(cognitoError.message)}
          </Text>
        )}
        <FormInput {...formInput} />
        <Button
          color="primary"
          fill="solid"
          size="large"
          testProps={testProperties('button-confirm-sign-in')}
          title="Confirm"
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
    </View>
  );
};

export default ConfirmSignIn;
