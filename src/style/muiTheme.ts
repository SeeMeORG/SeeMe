import { grey } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";

export const muiTheme = createTheme({
  palette: {
    background: {
      default: "#ffffff",
      paper: "#fff",
    },
    text: { primary: "#000000", secondary: "#ffffff", disabled: grey[800] },
    primary: {
      main: "#a832a4",
      light: "#a36fa1",
      dark: "#f007e7",
      contrastText: "#ffffffde",
    },
    secondary: {
      light: "#F79B4C",
      main: "#F58220",
      dark: "#AB5B16",
      contrastText: "#ffffff",
    },
  },
  typography:{
    fontFamily: 'lato'
  },
  components: {
    MuiToolbar: {
      styleOverrides: {
        root: {
          paddingLeft: '0px !important',
          minHeight: '40px !important',
        },
      },
    },
  },
});
