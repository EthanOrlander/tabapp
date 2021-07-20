import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';

type AppButtonProps = {
  title: string;
  onPress: () => void;
  isLoading?: boolean;
};

// TODO disable press when loading
const AppButton: React.FC<AppButtonProps> = ({ title, onPress, isLoading = false }) => {
  return (
    <TouchableOpacity
      disabled={isLoading}
      style={[styles.button, isLoading && styles.buttonLoading]}
      onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
      {/* TODO Make this loading indicator work */}
      {isLoading && <ActivityIndicator style={styles.activityIndicator} color="#fff" />}
    </TouchableOpacity>
  );
};

export default AppButton;

const styles = StyleSheet.create({
  button: {
    display: 'flex',
    flexDirection: 'row',
    marginVertical: 10,
    backgroundColor: '#6425C7',
    borderRadius: 5,
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: '#6425C7',
    shadowColor: 'rgb(100, 37, 199)',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    width: '100%',
  },
  buttonLoading: {
    borderColor: '#8659CC',
    backgroundColor: '#8659CC',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  activityIndicator: {
    position: 'absolute',
    right: 15,
  },
});
