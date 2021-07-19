import React from 'react';
import { Control, Controller } from 'react-hook-form';
import { StyleSheet, View, Text, TextInputProps } from 'react-native';
import AppTextInput from './AppTextInput';

export type FormInputProps = {
  label: string;
  leftIcon?: string;
  control: any;
  name: string;
  defaultValue?: string;
  textInputProps: TextInputProps;
  error?: string;
};

const FormInput = React.forwardRef<any, FormInputProps>(
  ({ label, textInputProps, control, error, leftIcon, name, defaultValue }, ref) => {
    return (
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>{label}</Text>
        <Controller
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <AppTextInput
              onBlur={onBlur}
              onChangeText={onChange}
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
              value={value}
              leftIcon={leftIcon}
              ref={ref}
              {...textInputProps}
            />
          )}
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
  },
  inputError: {
    display: 'flex',
    fontSize: 12,
    color: 'red',
  },
});
