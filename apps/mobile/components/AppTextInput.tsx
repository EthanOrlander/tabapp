import React from 'react';
import { View, StyleSheet, TextInput, TextInputProps } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface AppTextInputProps extends TextInputProps {
  leftIcon: any;
}
const AppTextInput = React.forwardRef<any, AppTextInputProps>(
  ({ leftIcon, ...otherProps }, ref) => {
    return (
      <View style={styles.container}>
        {leftIcon && (
          /* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */
          <MaterialCommunityIcons name={leftIcon} size={20} color="#6e6869" style={styles.icon} />
        )}
        {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */}
        <TextInput style={styles.input} placeholderTextColor="#6e6869" {...otherProps} ref={ref} />
      </View>
    );
  },
);

export default AppTextInput;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0,0,0,0.025)',
    borderRadius: 5,
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: '#6425C7',
    shadowColor: 'rgb(100, 37, 199)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    flexDirection: 'row',
    padding: 15,
    width: '100%',
  },
  icon: {
    marginRight: 10,
  },
  input: {
    width: '80%',
    fontSize: 18,
    color: '#101010',
  },
});
