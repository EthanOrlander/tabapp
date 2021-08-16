// https://shopify.engineering/5-ways-to-improve-your-react-native-styling-workflow

import { ColorValue } from 'react-native';

const palette = {
  electric: '#17D5FF',
  teal: '#0085A3',
  green: '#8DFBAC',
  red: '#FF4F64',
  black: '#0B0B0B',
  white: '#FFF',
  grey: '#E8E8E8',
  darkGrey: '#BDBDBD',
  lightGrey: '#F6F6F6',
};

export type Colors =
  | 'background'
  | 'foreground'
  | 'primary'
  | 'success'
  | 'danger'
  | 'failure'
  | 'grey'
  | 'lightGrey'
  | 'darkGrey';
export type Spacing = 's' | 'm' | 'l' | 'xl';
export type TextVariants = 'header' | 'body';

export type Theme = {
  colors: Record<Colors, ColorValue>;
  spacing: Record<Spacing, number>;
  textVariants: Record<TextVariants, Record<string, string | number>>;
};

export const theme: Theme = {
  colors: {
    background: palette.white,
    foreground: palette.black,
    primary: palette.electric,
    success: palette.green,
    danger: palette.red,
    failure: palette.red,
    grey: palette.grey,
    lightGrey: palette.lightGrey,
    darkGrey: palette.darkGrey,
  },
  spacing: {
    s: 8,
    m: 16,
    l: 24,
    xl: 40,
  },
  textVariants: {
    header: {
      fontFamily: 'Raleway',
      fontSize: 36,
      fontWeight: 'bold',
    },
    body: {
      fontFamily: 'Merriweather',
      fontSize: 16,
    },
  },
};
