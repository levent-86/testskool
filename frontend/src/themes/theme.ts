import { createTheme } from '@mui/material/styles';
import { fonts } from './fonts';

const theme = createTheme({

  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },

  // Dark theme
  colorSchemes: {
    light:true,
    dark: true,
  },

  cssVariables: {
    colorSchemeSelector: 'class'
  },

  // Fonts
  typography: {
    fontFamily: fonts.body,
    h1: {fontFamily: fonts.heading},
    h2: {fontFamily: fonts.heading},
    h3: {fontFamily: fonts.heading},
    h4: {fontFamily: fonts.heading},
    h5: {fontFamily: fonts.heading},
    h6: {fontFamily: fonts.heading},
  },

  // Components
  components: {

    // Button
    MuiButton: {
      styleOverrides: {
        root: {
          // Responsive button font sizes
          '@media (min-width:600px)': {
            fontSize: '0.75rem',
          },
          '@media (min-width:900px)': {
            fontSize: '0.875rem',
          },
        },
      },
    },

    // Typography
    MuiTypography: {
      styleOverrides: {
        // Responsive typography sizes
        h4: {
          '@media (min-width:600px)': {
            fontSize: '1.7rem',
          },
          '@media (min-width:900px)': {
            fontSize: '2.1rem',
          },
        },

        h3: {
          '@media (max-width:600px)': {
            fontSize: '2.1rem',
          },
          '@media (min-width:600px)': {
            fontSize: '2.1rem',
          },
          '@media (min-width:900px)': {
            fontSize: '3rem',
          },
        }
      }
    }
  },
});

export default theme;
