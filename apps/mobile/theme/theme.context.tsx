import React from 'react';
import { Theme, theme } from './theme';

const ThemeContext = React.createContext<Theme>(theme);

export const ThemeProvider: React.FC = ({ children }) => (
  <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
);

export default ThemeContext;
