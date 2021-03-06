import React, { useRef, useState } from 'react';
import { View, Text, TextInput as RNTextInput, Image } from 'react-native';
import { Auth } from 'aws-amplify';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/Button';
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
import useAuth from '../../hooks/useAuth';

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
  const { username } = useAuth();
  const ref_password = useRef<RNTextInput>(null);
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
    <View
      style={{
        width: '100%',
        height: '100%',
        justifyContent: 'space-between',
        display: 'flex',
        flexDirection: 'column',
      }}>
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
        <Button
          color="primary"
          fill="solid"
          size="large"
          testProps={testProperties('button-forgot-password-set')}
          title="Set new password"
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

export default ForgotPasswordSet;
