import type { Config } from "tailwindcss";

const svgToDataUri = require("mini-svg-data-uri");
const colors = require("tailwindcss/colors");
const {
  default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");

const config: Config = {
  darkMode: 'class',
  lightMode: 'class',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#162CF1",
        secondary: "#FF6347",
        success: "#10b981",
        warning: "#f59e0b",
        error: "#ef4444",
        inputColor: " #EFEFEF",
        confirmation: "#34D399",
        background: "#F3F3F3",
        sidebar: "#FFFFFF",
        foreground: "#000000",
        input: "#F1F1F1",
        dropdown: "#FFFFFF",
        switch: "#E5E7EB",
        toggle: "#D1D5DB",
        modal: "#FFFFFF",

        ...getCustomColors(),


      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    addVariablesForColors,
    function ({ addComponents, theme }: any) {
      const colors = theme('colors');

      const buttons = {
        '.btn': {
          padding: '.5rem 1rem',
          borderRadius: '.375rem',
          fontWeight: '600',
          fontSize: '0.855rem', // reduced text size
          transition: 'background-color 0.3s ease, opacity 0.3s ease', // added transition
          '&.btn-primary': {
            backgroundColor: colors.primary,
            color: colors.white,
            '&:hover': {
              opacity: 0.6, // reduced opacity on hover
            },
          },
          '&.btn-secondary': {
            backgroundColor: colors.secondary,
            color: colors.white,
            '&:hover': {
              opacity: 0.8,
            },
          },
          '&.btn-warning': {
            backgroundColor: colors.warning,
            color: colors.white,
            '&:hover': {
              opacity: 0.8,
            },
          },
          '&.btn-confirmation': {
            backgroundColor: colors.confirmation,
            color: colors.white,
            '&:hover': {
              opacity: 0.8,
            },
          },
          '&.btn-outlined': {
            backgroundColor: 'transparent',
            border: `1px solid ${colors.primary}`,
            color: colors.primary,
            '&:hover': {
              backgroundColor: colors.primary,
              color: colors.white,
            },
          },
          '&.btn-outlined-warning': {
            backgroundColor: 'transparent',
            border: `1px solid ${colors.warning}`,
            color: colors.warning,
            '&:hover': {
              backgroundColor: colors.warning,
              color: colors.white,
            },
          },
          '&.btn-outlined-secondary': {
            backgroundColor: 'transparent',
            border: `1px solid ${colors.secondary}`,
            color: colors.secondary,
            '&:hover': {
              backgroundColor: colors.secondary,
              color: colors.white,
            },
          },
          '&.btn-outlined-confirmation': {
            backgroundColor: 'transparent',
            border: `1px solid ${colors.confirmation}`,
            color: colors.confirmation,
            '&:hover': {
              backgroundColor: colors.confirmation,
              color: colors.white,
            },
          },
        },
      };

      const inputs = {
        '.input': {
          padding: '.5rem 1rem',
          borderRadius: '.375rem',
          border: 'none', // removed border
          color: colors.black, // text color
          '&::placeholder': {
            color: colors.inputColor, // placeholder color
            opacity: '1', // ensured opacity is full
            transition: 'color 0.3s ease', // added transition for focus
          },
          '&:focus::placeholder': {
            color: colors.black, // black on focus
          },
          '&:focus': {
            outline: 'none', // removed default outline
          },
          '&.input-primary': {
            backgroundColor: `${colors.inputColor}`, // low opacity primary color
            '&:focus': {
              backgroundColor: `${colors.inputColor}`, // slightly higher opacity on focus
            },
            '&::placeholder': {
              color: colors.black, // placeholder color
              opacity: '0.5', // ensured opacity is full
              transition: 'color 0.3s ease', // added transition for focus
            },
          },


          '&.input-secondary': {
            backgroundColor: `${colors.secondary}1A`,
            '&:focus': {
              backgroundColor: `${colors.secondary}33`,
            },
          },
          '&.input-warning': {
            backgroundColor: `${colors.warning}1A`,
            '&:focus': {
              backgroundColor: `${colors.warning}33`,
            },
          },
        },
      };

      const switches = {
        '.switch': {
          width: '3rem',
          height: '1.5rem',
          borderRadius: '9999px',
          backgroundColor: colors.gray[300],
          position: 'relative',
          transition: 'background-color 0.3s ease', // added transition
          '&.switch-primary': {
            backgroundColor: colors.primary,
          },
          '&.switch-secondary': {
            backgroundColor: colors.secondary,
          },
          '&.switch-warning': {
            backgroundColor: colors.warning,
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: '0.125rem',
            left: '0.125rem',
            width: '1.25rem',
            height: '1.25rem',
            borderRadius: '9999px',
            backgroundColor: colors.white,
            transition: 'transform 0.2s ease-in-out',
          },
          '&.checked::after': {
            transform: 'translateX(1.5rem)',
          },
        },
      };

      const checkboxes = {
        '.checkbox': {
          width: '1rem',
          height: '1rem',
          borderRadius: '.25rem',
          border: '1px solid',
          transition: 'background-color 0.3s ease', // added transition
          '&.checkbox-primary': {
            borderColor: colors.primary,
            '&:checked': {
              backgroundColor: colors.primary,
            },
          },
          '&.checkbox-secondary': {
            borderColor: colors.secondary,
            '&:checked': {
              backgroundColor: colors.secondary,
            },
          },
          '&.checkbox-warning': {
            borderColor: colors.warning,
            '&:checked': {
              backgroundColor: colors.warning,
            },
          },
        },
      };

      addComponents(buttons);
      addComponents(inputs);
      addComponents(switches);
      addComponents(checkboxes);
    },
  ],
  colors: colors,

};

function addVariablesForColors({ addBase, theme }: any) {
  let allColors = flattenColorPalette(theme("colors"));
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );

  addBase({
    ":root": newVars,
  });
}

function getCustomColors() {
  return {

    "gray-2": "#F7F9FC",
    "gray-3": "#FAFAFA",
    whiten: "#F1F5F9",
    whiter: "#F5F7FD",
    boxdark: "#24303F",
    "boxdark-2": "#1A222C",
    strokedark: "#2E3A47",
    "form-strokedark": "#3d4d60",
    "form-input": "#1d2a39",
    "meta-1": "#DC3545",
    "meta-2": "#EFF2F7",
    "meta-3": "#10B981",
    "meta-4": "#313D4A",
    "meta-5": "#259AE6",
    "meta-6": "#FFBA00",
    "meta-7": "#FF6766",
    "meta-8": "#F0950C",
    "meta-9": "#E5E7EB",
    "meta-10": "#0FADCF",
  };
}

export default config;
