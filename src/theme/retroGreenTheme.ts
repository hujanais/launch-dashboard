import { createTheme, alpha } from '@mui/material/styles'

const phosphor = '#39ff14'
const phosphorDim = '#2dd40f'
const mint = '#b8ffc8'
const forest = '#0a160d'
const voidGreen = '#030b06'

export const retroGreenTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: phosphor,
            light: '#6bff47',
            dark: phosphorDim,
            contrastText: voidGreen,
        },
        secondary: {
            main: '#14b866',
            light: '#3dd68c',
            dark: '#0d8f4f',
        },
        background: {
            default: voidGreen,
            paper: forest,
        },
        text: {
            primary: mint,
            secondary: '#6b9f78',
            disabled: '#4a7a58',
        },
        divider: alpha(phosphor, 0.14),
        success: {
            main: phosphor,
        },
        error: {
            main: '#ff6b8a',
        },
        warning: {
            main: '#ffb347',
        },
        info: {
            main: '#5eead4',
        },
    },
    typography: {
        fontFamily: '"IBM Plex Sans", "Segoe UI", system-ui, sans-serif',
        h6: {
            fontFamily: '"Share Tech Mono", "IBM Plex Mono", monospace',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
        },
        button: {
            fontFamily: '"Share Tech Mono", "IBM Plex Mono", monospace',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            fontSize: '0.78rem',
        },
    },
    shape: {
        borderRadius: 10,
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    backgroundColor: voidGreen,
                    backgroundImage: `
                        radial-gradient(ellipse 120% 70% at 50% -15%, ${alpha(phosphor, 0.07)} 0%, transparent 55%),
                        radial-gradient(ellipse 80% 50% at 100% 100%, ${alpha('#14b866', 0.05)} 0%, transparent 45%)
                    `,
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    background: `linear-gradient(180deg, ${alpha('#0d1f12', 0.98)} 0%, ${alpha(voidGreen, 0.95)} 100%)`,
                    borderBottom: `1px solid ${alpha(phosphor, 0.22)}`,
                    boxShadow: `0 1px 0 ${alpha(phosphor, 0.08)}, 0 8px 32px ${alpha(voidGreen, 0.8)}`,
                },
            },
        },
        MuiToolbar: {
            styleOverrides: {
                root: {
                    minHeight: 52,
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    color: mint,
                    '&:hover': {
                        backgroundColor: alpha(phosphor, 0.08),
                        color: phosphor,
                    },
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    border: `1px solid ${alpha(phosphor, 0.1)}`,
                },
            },
        },
        MuiAccordion: {
            styleOverrides: {
                root: {
                    backgroundColor: alpha(forest, 0.85),
                    border: `1px solid ${alpha(phosphor, 0.12)}`,
                    '&:before': {
                        display: 'none',
                    },
                },
            },
        },
        MuiAlert: {
            styleOverrides: {
                standardError: {
                    backgroundColor: alpha('#ff6b8a', 0.12),
                    color: '#ffc8d4',
                },
                standardInfo: {
                    backgroundColor: alpha(phosphor, 0.08),
                    color: mint,
                },
            },
        },
    },
})
