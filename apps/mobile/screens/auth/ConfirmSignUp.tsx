import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Auth } from 'aws-amplify';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppButton from '../../components/AppButton';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './Auth';
import AuthContext from './AuthContext';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import FormInput, { FormInputProps } from '../../components/FormInput';
import styles from './styles';

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
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });
  const { cognitoUser } = useContext(AuthContext);
  async function onSubmit(data: FormData) {
    try {
      if (cognitoUser) await Auth.confirmSignUp(cognitoUser.getUsername(), data.code);
      else throw Error('Cognito user is undefined');
      console.log('✅ Code confirmed');
      navigation.navigate('SignIn');
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
        <Text style={styles.title}>Confirm Sign Up</Text>
        <FormInput {...formInput} />
        <AppButton title="Confirm Sign Up" onPress={handleSubmit(onSubmit)} />
      </View>
    </SafeAreaView>
  );
};

export default ConfirmSignUp;
