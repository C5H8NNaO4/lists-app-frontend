import * as React from 'react';
import Checkbox from '@mui/material/Checkbox';
import {
  createTheme,
  ThemeProvider as MUIThemeProvider,
  styled,
} from '@mui/material/styles';
import { orange } from '@mui/material/colors';

declare module '@mui/material/styles' {
  interface Theme {
    status: {
      danger: string;
    };
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    status?: {
      danger?: string;
    };
  }
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#66BEE7', //'#FDD804',
    },
    secondary: {
      main: '#FFDF00', //'#F66528',
    },
  },
});

export const ThemeProvider = ({ children }) => {
  return <MUIThemeProvider theme={theme}>{children}</MUIThemeProvider>;
};
