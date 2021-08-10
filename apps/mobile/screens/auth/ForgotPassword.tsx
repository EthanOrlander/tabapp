import React, { useContext, useState } from 'react';
import { View, Text } from 'react-native';
import { Auth } from 'aws-amplify';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppButton from '../../components/AppButton';
import AuthContext from './AuthContext';
import * as yup from 'yup';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './Auth';
import styles from './styles';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import FormInput, { FormInputProps } from '../../components/FormInput';
import { sanitizeCognitoErrorMessage } from './utils';
import { testProperties } from '../../utils/TestProperties';

interface FormData {
  phoneNumber: string;
}

const phoneRegExp =
  /^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)?$/;

const schema = yup.object().shape({
  phoneNumber: yup
    .string()
    .required('Required')
    .matches(phoneRegExp, 'Phone number must be formatted +16475238795'),
});

interface ForgotPasswordProps {
  navigation: StackNavigationProp<RootStackParamList, 'ForgotPassword'>;
  route: RouteProp<RootStackParamList, 'ForgotPassword'>;
}

const ForgotPassword: React.FC<ForgotPasswordProps> = ({ navigation }) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });
  const { setUsername: setUsernameParent } = useContext(AuthContext);
  const [cognitoError, setCognitoError] = useState<{
    code: string;
    message: string;
    name: string;
  } | null>(null);

  const onSubmit = async (data: FormData) => {
    await Auth.forgotPassword(data.phoneNumber)
      .then(() => {
        setUsernameParent(data.phoneNumber);
        setCognitoError(null);
        navigation.navigate('ForgotPasswordSet');
      })
      .catch(setCognitoError);
  };

  const formInput: FormInputProps & React.RefAttributes<any> = {
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
      returnKeyType: 'done',
      onSubmitEditing: handleSubmit(onSubmit),
    },
  };

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Forgot password</Text>
        {cognitoError && (
          <Text style={styles.cognitoError}>
            {sanitizeCognitoErrorMessage(cognitoError.message)}
          </Text>
        )}
        <FormInput {...formInput} />
        <Text>A recovery code will be sent to your email.</Text>
        <AppButton
          testProps={testProperties('button-forgot-password')}
          title="Send recovery code"
          onPress={handleSubmit(onSubmit)}
          isLoading={isSubmitting}
        />
      </View>
    </SafeAreaView>
  );
};

export default ForgotPassword;
