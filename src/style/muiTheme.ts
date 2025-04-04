import { grey } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';

export const muiTheme = createTheme({
    palette: {
        background: {
            default: '#ffffff',
            paper: '#fff',
        },
        text: { primary: '#000000', secondary: grey[600], disabled: grey[800] },
        primary: {
            main: '#285F97',
            light: '#47CEEB',
            dark: '#1187A1',
            contrastText: '#ffffffde',
        },
        secondary: {
            light: '#F79B4C',
            main: '#F58220',
            dark: '#AB5B16',
            contrastText: '#ffffff',
        },
    },
});

