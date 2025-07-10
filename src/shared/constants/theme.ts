import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  // defaultColorScheme: 'dark',
  // cssVariables: {
  //   colorSchemeSelector: 'class',
  // },

  colorSchemes: {
    dark: true,
  },
  palette: {
    primary: {
      main: '#7124CB',
    },
    secondary: {
      main: '#A230C7',
    },
  },
});
