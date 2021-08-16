import React from 'react';
import { Theme } from '../theme/theme';
import ThemeContext from '../theme/theme.context';

const useTheme = (): Theme => React.useContext(ThemeContext);

export default useTheme;
