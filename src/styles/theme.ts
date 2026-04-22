import { createTheme, CSSVariablesResolver, MantineThemeOverride } from '@mantine/core';

export const mantineTheme: MantineThemeOverride = createTheme({
  fontFamily: 'Inter, sans-serif',
  colors: {
    dark: [
      '#d0d0d0',
      '#b6b6b6',
      '#9b9b9b',
      '#818181',
      '#676767',
      '#4d4d4dff',
      '#383838ff',
      '#1f1f1fff',
      '#080808',
      '#000000',
    ],
    custom: [
      '#e4fefb',
      '#d5f7f3',
      '#aeede5',
      '#83e3d7',
      '#60daca',
      '#4ad5c3',
      '#3bd2bf',
      '#29baa8',
      '#17a695',
      '#009081',
    ],
    red: ['#FFDCE1', '#FFB3B7', '#FF8990', '#FF6068', '#FF3641', '#FF0C1A', '#E6001B', '#CC001C', '#BA0024', '#9A001F'],
  },
  other: {
    bpPaperDark: '#dee2e6',
    bpPaperLight: '#dee2e6',
  },
  shadows: {
    md: '0px 2px 5px rgba(0, 0, 0, .10)',
    lg: '0px 2px 5px rgba(0, 0, 0, .10)',
    xl: '0px 2px 5px rgba(0, 0, 0, .10)',
  },
  primaryColor: 'custom',
  defaultRadius: 'md',
  components: {
    Drawer: {
      defaultProps: {
        padding: 0,
        position: 'right',
        overlayProps: { backgroundOpacity: 0.5, blur: 4 },
        withCloseButton: false,
        offset: 10,
        radius: 'md',
      },
    },
    Paper: {
      defaultProps: {
        shadow: '',
        p: 'md',
      },
    },
    Title: {
      defaultProps: {
        mb: 'xl',
      },
    },
    Text: {
      defaultProps: {
        size: 'sm',
      },
    },
    Anchor: {
      defaultProps: {
        size: 'sm',
      },
    },
    TextInput: {
      defaultProps: {
        size: 'sm',
      },
    },
    PasswordInput: {
      defaultProps: {
        size: 'sm',
      },
    },
    NumberInput: {
      defaultProps: {
        size: 'sm',
        stepHoldDelay: 500,
        stepHoldInterval: (t: number) => Math.max(1000 / t ** 2, 25),
      },
    },
    Tooltip: {
      defaultProps: {
        fz: 'xs',
      },
    },
    Textarea: {
      defaultProps: {
        size: 'sm',
      },
    },
    ThemeIcon: {
      defaultProps: {
        variant: 'gradient',
        gradient: { from: 'cyan', to: 'teal', deg: 70 },
      },
    },
    Button: {
      defaultProps: {
        size: 'sm',
        variant: 'gradient',
        gradient: { from: 'cyan', to: 'teal', deg: 70 },
      },
      styles: () => ({
        root: {
          userSelect: 'none',
          WebkitUserSelect: 'none',
          WebkitTouchCallout: 'none',
        },
      }),
    },
    Affix: {
      defaultProps: {
        w: {
          base: '100vw',
          xs: 'calc(100vw - 250px)',
          sm: 'calc(100vw - 300px)',
        },
        ml: {
          base: 0,
          xs: 250,
          sm: 300,
        },
      },
    },
    Modal: {
      defaultProps: {
        p: 0,
        zIndex: 302,
        withCloseButton: true,
        overlayProps: { backgroundOpacity: 0.3, blur: 4, zIndex: 301 },
      },
    },
    ModalContent: {
      defaultProps: {
        p: 0,
      },
    },
    ModalBody: {
      defaultProps: {
        p: 'md',
      },
    },
    ModalHeader: {
      defaultProps: {
        p: 'md',
        h: 60,
        bg: 'linear-gradient(120deg, var(--mantine-color-cyan-filled) 0%, var(--mantine-color-teal-filled) 100%)',
        c: 'var(--mantine-color-white)',
      },
    },
    ModalCloseButton: {
      defaultProps: {
        c: 'var(--mantine-color-white)',
      },
    },
    ModalTitle: {
      defaultProps: {
        fz: 20,
        fw: 600,
      },
    },
    Alert: {
      defaultProps: {
        p: 'sm',
        variant: 'filled',
        bg: 'linear-gradient(90deg, var(--mantine-color-red-filled) 0%, var(--mantine-color-orange-filled) 100%)',
      },
    },
    SegmentedControl: {
      defaultProps: {
        size: 'sm',
      },
      styles: () => ({
        root: {
          backgroundColor: 'var(--mantine-color-white)',
          border: '1px solid var(--mantine-primary-color-6)',
        },
        indicator: {
          background:
            'linear-gradient(90deg, var(--mantine-color-cyan-filled) 0%, var(--mantine-color-teal-filled) 100%)',
        },
      }),
    },

    Pagination: {
      defaultProps: {
        size: 'sm',
      },
    },
    Stepper: {
      defaultProps: {
        size: 'md',
      },
    },
    Fieldset: {
      styles: () => ({
        root: {
          overflow: 'hidden',
        },
      }),
    },
  },
});

export const cssVariablesResolver: CSSVariablesResolver = (theme) => ({
  variables: {},
  light: {
    '--aimm-svg-color': 'var(--mantine-primary-color-7)',
    '--aimm-bg-paper': theme.other.bpPaperLight,
  },
  dark: {
    '--aimm-svg-color': 'var(--mantine-primary-color-7)',
    '--aimm-bg-paper': theme.other.bpPaperDark,
  },
});
