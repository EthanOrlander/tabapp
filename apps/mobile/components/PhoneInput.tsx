import React from 'react';
import { StyleSheet, TextInput, TextInputProps } from 'react-native';
import DefaultPhoneInput from 'react-native-phone-number-input';
import useTheme from '../hooks/useTheme';
import { styleSheet } from './TextInput';

/*
 * Pull out 'value' from props since PhoneInput manages it's own state
 * Run parent's (react-hook-form's) onChangeText on onChangeFormattedText,
 * to update parent form state with complete phone #, including country code
 */
const PhoneInput = React.forwardRef<TextInput, TextInputProps>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ({ value, onChangeText, ...props }, ref) => {
    const theme = useTheme();
    return (
      <DefaultPhoneInput
        defaultCode="CA"
        containerStyle={{ ...styleSheet(theme).container, padding: 0 }}
        placeholderTextColor="#6e6869"
        layout="first"
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        textInputProps={{ ...props, ref }}
        onChangeFormattedText={onChangeText}
        textContainerStyle={styles.textContainer}
      />
    );
  },
);

export default PhoneInput;

const styles = StyleSheet.create({
  textContainer: {
    borderRadius: 8,
  },
});
