import React from 'react';
import { StyleSheet, TextInputProps } from 'react-native';
import PhoneInput from 'react-native-phone-number-input';

/*
 * Pull out 'value' from props since PhoneInput manages it's own state
 * Run parent's (react-hook-form's) onChangeText on onChangeFormattedText,
 * to update parent form state with complete phone #, including country code
 */
const AppPhoneInput = React.forwardRef<any, TextInputProps>(
  ({ value, onChangeText, ...props }, ref) => {
    return (
      <PhoneInput
        defaultCode="CA"
        containerStyle={styles.container}
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

export default AppPhoneInput;

const styles = StyleSheet.create({
  container: {
    fontSize: 18,
    color: '#101010',
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: '#6425C7',
    shadowColor: 'rgb(100, 37, 199)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    width: '100%',
  },
  textContainer: {
    borderRadius: 5,
  },
});
