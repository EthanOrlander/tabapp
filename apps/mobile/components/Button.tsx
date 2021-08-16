import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { TestProps } from '../utils/TestProperties';
import useTheme from '../hooks/useTheme';
import { Colors, Theme } from '../theme/theme';

type Fill = 'clear' | 'solid' | 'outline';

type Size = 'small' | 'large';

type ButtonProps = {
  title: string;
  color: Colors | 'secondary';
  fill: Fill;
  uppercase?: boolean;
  size: 'small' | 'large';
  onPress: () => void;
  isLoading?: boolean;
  testProps: TestProps;
};

const Button: React.FC<ButtonProps> = ({
  title,
  color,
  fill,
  size,
  onPress,
  isLoading = false,
  testProps,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const theme = useTheme();
  const styles = styleSheet(theme, color, fill, size);
  return (
    <TouchableOpacity
      disabled={isLoading}
      activeOpacity={0.5}
      style={[styles.button, isLoading && styles.buttonLoading]}
      onPress={onPress}
      {...testProps}>
      <Text style={styles.buttonText}>{title}</Text>
      {isLoading && <ActivityIndicator style={styles.activityIndicator} color="#fff" />}
    </TouchableOpacity>
  );
};

export default Button;

const styleSheet = (theme: Theme, color: Colors | 'secondary', fill: Fill, size: Size) =>
  StyleSheet.create({
    button: {
      display: 'flex',
      flexDirection: 'row',
      backgroundColor: (() => {
        if (fill === 'clear') return 'transparent';
        if (fill === 'solid')
          return color === 'primary' ? theme.colors[color] : theme.colors.lightGrey;
        if (fill === 'outline') return theme.colors.background;
      })(),
      borderRadius: fill === 'clear' ? 0 : 50,
      borderWidth: fill === 'outline' ? 2 : 0,
      borderStyle: fill === 'outline' ? 'solid' : undefined,
      borderColor: (() => {
        if (fill === 'clear') return 'transparent';
        if (fill === 'solid') return undefined;
        if (fill === 'outline') return theme.colors.primary;
      })(),
      justifyContent: 'center',
      alignItems: 'center',
      padding: size === 'small' ? 5 : 15,
      width: size === 'large' ? '100%' : undefined,
    },
    buttonLoading: {
      backgroundColor: 'rgba(23, 213, 255, 0.5)',
    },
    buttonText: {
      color:
        fill === 'solid'
          ? color === 'primary'
            ? theme.colors.background
            : theme.colors.primary
          : theme.colors.primary,
      fontSize: size === 'large' ? 18 : 14,
      fontWeight: '600',
    },
    activityIndicator: {
      position: 'absolute',
      right: 15,
    },
  });
