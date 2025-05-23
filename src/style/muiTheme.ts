import { grey } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";

export const muiTheme = createTheme({
  palette: {
    background: {
      default: "linear-gradient( #993996, #fa69f5, #91068d)",
      paper: "#fff",
    },
    text: { primary: "#000000", secondary: "#ffffff", disabled: grey[600] },
    action: {
      disabled: "#ffffff",
      disabledBackground: grey[600]
    },
    primary: {
      main: "#993996",
      light: "#fa69f5",
      dark: "#91068d",
      contrastText: "#ffffffde",
    },
    secondary: {
      light: "#F79B4C",
      main: "#F58220",
      dark: "#AB5B16",
      contrastText: "#ffffff",
    },
    info: {
      light: "#151b23",
      main: "#121213",
      dark: "#282828",
      contrastText: "#000000",
    },
  },
  typography: {
    fontFamily: "lato",
  },
  components: {
    MuiToolbar: {
      styleOverrides: {
        root: {
          paddingLeft: "0px !important",
          minHeight: "50px !important",
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        subtitle1: {
          fontSize: 10,
          fontWeight: 500,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', 
        },
      },
    },
  },
});
