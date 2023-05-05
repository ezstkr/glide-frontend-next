import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  colors: {
    // Customize the colors of your application
    red: {
      500: '#D7000D'
    },
    green: {
      500: '#4CC92C'
    },
    blue: {
      500: '#3B82F6'
    },
  },

  components: { // not work
    Toast: {
      baseStyle: {
        container: {
          // Customize the borderRadius, boxShadow, etc., if needed
        },
      },
      variants: {
        success: {
          container: {
            bg: '#4CC92C',
            color: 'white',
          },
        },
        error: {
          container: {
            bg: '#D7000D',
            color: 'white',
          },
        },
        info: {
          container: {
            bg: '#3B82F6',
            color: 'white',
          },
        },
      },
    },
  },
  // Add other theme customizations here, such as fonts, breakpoints, etc.
});

export default theme;