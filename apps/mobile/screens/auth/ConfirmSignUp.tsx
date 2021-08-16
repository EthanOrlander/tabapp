import React, { useState } from 'react';
import { View, Text, Image } from 'react-native';
import { Auth } from 'aws-amplify';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/Button';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './Auth';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import FormInput, { FormInputProps } from '../../components/FormInput';
import styles from './styles';
import { sanitizeCognitoErrorMessage } from './utils';
import { testProperties } from '../../utils/TestProperties';
import useAuth from '../../hooks/useAuth';

interface FormData {
  code: string;
}

const schema = yup.object().shape({
  code: yup.string().required('Please enter the code we sent to your phone.'),
});

interface ConfirmSignUpProps {
  navigation: StackNavigationProp<RootStackParamList, 'ConfirmSignUp'>;
  route: RouteProp<RootStackParamList, 'ConfirmSignUp'>;
}

const ConfirmSignUp: React.FC<ConfirmSignUpProps> = ({ navigation }) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });
  const { cognitoUser } = useAuth();
  const [cognitoError, setCognitoError] = useState<{
    code: string;
    message: string;
    name: string;
  } | null>(null);

  const onSubmit = async (data: FormData) => {
    if (cognitoUser)
      await Auth.confirmSignUp(cognitoUser.getUsername(), data.code)
        .then(() => {
          setCognitoError(null);
          navigation.navigate('SignIn');
        })
        .catch(setCognitoError);
    else throw Error('Cognito user is undefined');
  };

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
      <View
        style={{
          width: '100%',
          height: '100%',
          justifyContent: 'space-between',
          display: 'flex',
          flexDirection: 'column',
        }}>
        <View style={styles.container}>
          <Text style={styles.title}>Confirm Sign Up</Text>
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
            testProps={testProperties('button-confirm-sign-up')}
            title="Confirm Sign Up"
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
    </SafeAreaView>
  );
};

export default ConfirmSignUp;
