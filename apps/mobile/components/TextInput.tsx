import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TextInput as RNTextInput,
  TextInputProps as RNTextInputProps,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import useTheme from '../hooks/useTheme';
import { Colors, Theme } from '../theme/theme';

interface TextInputProps extends RNTextInputProps {
  leftIcon: any;
}
const TextInput = React.forwardRef<RNTextInput, TextInputProps>(
  ({ leftIcon, secureTextEntry: propsSecureTextEntry, ...otherProps }, ref) => {
    const [hidePassword, setHidePassword] = useState<boolean>(propsSecureTextEntry ?? false);
    const onTogglePassword = () => setHidePassword((curr) => !curr);
    const theme = useTheme();
    const styles = styleSheet(theme);

    return (
      <View style={styles.container}>
        {leftIcon && (
          <MaterialCommunityIcons
            /* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */
            name={leftIcon}
            size={20}
            color="#6e6869"
            style={styles.leftIcon}
          />
        )}
        <RNTextInput
          style={styles.input}
          placeholderTextColor="#6e6869"
          secureTextEntry={hidePassword}
          {...otherProps}
          ref={ref}
        />
        {propsSecureTextEntry && (
          <MaterialCommunityIcons
            name={hidePassword ? 'eye' : 'eye-off'}
            size={20}
            color="#6e6869"
            style={styles.rightIcon}
            onPress={onTogglePassword}
          />
        )}
      </View>
    );
  },
);

export default TextInput;

export const styleSheet = (theme: Theme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.lightGrey,
      borderRadius: 8,
      borderWidth: 1,
      borderStyle: 'solid',
      borderColor: theme.colors.grey,
      flexDirection: 'row',
      padding: 15,
      width: '100%',
    },
    leftIcon: {
      marginRight: 10,
    },
    rightIcon: {
      marginLeft: 10,
    },
    input: {
      width: '80%',
      fontSize: 18,
      color: theme.colors.darkGrey,
    },
  });
