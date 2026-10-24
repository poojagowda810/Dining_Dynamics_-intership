// src/theme.js
import { createTheme } from '@mui/material/styles';
import '@fontsource/poppins/300.css'; // Light
import '@fontsource/poppins/400.css'; // Regular
import '@fontsource/poppins/500.css'; // Medium
import '@fontsource/poppins/600.css'; // Semi-Bold
import '@fontsource/poppins/700.css'; // Bold
import '@fontsource/poppins/800.css'; // Extra-Bold
import '@fontsource/poppins/900.css'; // Black

const theme = createTheme({
  typography: {
    fontFamily: 'Poppins, Arial',
    h6: {
      fontFamily: 'Poppins, sans-serif',
      fontWeight: 500, // Medium
    },
    h4: {
      fontFamily: 'Poppins, sans-serif',
      fontWeight: 500, // Medium
    },
    h3: {
      fontFamily: 'Poppins, sans-serif',
      fontWeight: 100, // Medium
      fontSize: '1.2rem', // Increased font size
    },
    h1: {
      fontFamily: 'Poppins, sans-serif',
      fontWeight: 500, // Medium
      color:"white"
    },
    button: {
      fontFamily: 'Poppins, sans-serif',
      fontWeight: 500, // Medium
    },
  },
  palette: {
    primary: {
      main: '#635bff', // Example primary color
    },
    secondary: {
      main: '#dc004e', // Example secondary color
    },
    text: {
      main: '#635bff', // Default primary text color
      secondary: '#666', // Default secondary text color
      customColor: '#ff5722', // Custom text color
      lightColor: '#635bff4d',
      grey: 'grey',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          color: 'inherit', // Default text color for buttons
          borderRadius:'10px',
          '&:hover': {
            color: 'black', // Text color for buttons on hover
            backgroundColor: 'rgba(255, 255, 255, 0.5)', // Background color for buttons on hover
            borderRadius:'10px'
          },
        },
        contained: {
          color: 'white', // Text color for contained buttons
          // backgroundColor: '#635bff', // Background color for contained buttons
          '&:hover': {
            // backgroundColor: '#635bff', // Background color for contained buttons on hover
            // color: 'white', // Text color for contained buttons

          },
        },
        outlined: {
          color: 'inherit', // Text color for outlined buttons
          borderColor:'transparent', // Text border color
          boxShadow: '0 0 1px #1f1f1f',
          '&:hover': {
            
            // No background color for outlined buttons on hover
          },
        },
        text: {
          '&:hover': {
            color: 'white', // Text color for text buttons on hover
            backgroundColor: '#1976d2', // Background color for text buttons on hover
          },
        },
        errorButton: {
          color: 'white',
          backgroundColor: '#ec9898',
          '&:hover': {
            backgroundColor: '#fb7373',
          },
        },
      },
    },
  },
});

export default theme;
