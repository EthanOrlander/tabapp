import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Controller } from 'react-hook-form';
import { StyleSheet, View, Text, TextInputProps } from 'react-native';
import AppPhoneInput from './PhoneInput';
import AppTextInput from './TextInput';
import Tooltip from './Tooltip';

export type FormInputProps = {
  label: string;
  leftIcon?: string;
  phone?: boolean;
  control: any;
  name: string;
  defaultValue?: string;
  textInputProps: TextInputProps;
  error?: string;
  tooltip?: React.ReactNode;
};

const FormInput = React.forwardRef<any, FormInputProps>(
  (
    { label, textInputProps, control, error, leftIcon, phone = false, name, defaultValue, tooltip },
    ref,
  ) => {
    return (
      <View style={styles.inputContainer}>
        <View style={styles.labelContainer}>
          <Text style={styles.inputLabel}>{label}</Text>
          {tooltip}
        </View>
        <Controller
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          control={control}
          render={({ field: { onChange, onBlur, value } }) =>
            phone ? (
              <AppPhoneInput
                onBlur={onBlur}
                onChangeText={onChange}
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                value={value}
                ref={ref}
                {...textInputProps}
              />
            ) : (
              <AppTextInput
                onBlur={onBlur}
                onChangeText={onChange}
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                value={value}
                leftIcon={leftIcon}
                ref={ref}
                {...textInputProps}
              />
            )
          }
          name={name}
          defaultValue={defaultValue}
        />
        <Text style={styles.inputError}>{error}</Text>
      </View>
    );
  },
);

export default FormInput;

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '100%',
  },
  inputLabel: {
    fontSize: 18,
    textAlign: 'left',
    alignItems: 'flex-start',
    marginRight: 5,
  },
  inputError: {
    display: 'flex',
    fontSize: 12,
    color: 'red',
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
