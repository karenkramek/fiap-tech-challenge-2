/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "../dashboard-mfe/src/**/*.{js,ts,jsx,tsx}",
    "../transactions-mfe/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary palette (blues/teals)
        primary: {
          50: '#F8FDFF',
          100: '#E2F6FF',
          200: '#CDF1FF',
          300: '#B1E2F6',
          400: '#86B9CD',
          500: '#6191A5',
          600: '#416B7C',
          700: '#264653', // Main primary
          800: '#1F3D48',
          900: '#1A333D',
        },
        // Secondary palette (oranges)
        secondary: {
          50: '#FFF6EF',
          100: '#FFDDC1',
          200: '#FFC393',
          300: '#F4A261', // Main secondary
          400: '#CB8147',
          500: '#A26331',
          600: '#7A471E',
          700: '#512D10',
          800: '#3D2008',
          900: '#2A1305',
        },
        // Tertiary palette (greens)
        tertiary: {
          50: '#F0FFFD',
          100: '#C3FFF7',
          200: '#96FFF2',
          300: '#62EFDE',
          400: '#43C6B6',
          500: '#2A9D8F',
          600: '#177469',
          700: '#094B43', // Main tertiary
          800: '#073A34',
          900: '#052925',
        },
        // Semantic colors
        success: {
          50: '#E6F4EA',
          500: '#4CAF50',
          700: '#388E3C',
          800: '#2E7D32',
          900: '#1B5E20',
        },
        warning: {
          50: '#FFF8E1',
          500: '#FF9800',
          700: '#F57F17',
          800: '#F9A825',
          900: '#FF6F00',
        },
        error: {
          50: '#FDECEA',
          500: '#F44336',
          700: '#D32F2F',
          800: '#B71C1C',
          900: '#B00020',
        },
        info: {
          50: '#E3F2FD',
          500: '#2196F3',
          700: '#1976D2',
          800: '#1565C0',
          900: '#0D47A1',
        },
        // Neutral colors (whites and blacks)
        white: {
          50: '#FFFFFF',
          100: '#FFFFFF',
          200: '#FFFFFF',
          300: '#FFFFFF',
          400: '#FFFFFF',
          500: '#FFFFFF',
          600: '#E8E8E8',
          700: '#B5B5B5',
          800: '#8C8C8C',
          900: '#6B6B6B',
        },
        black: {
          50: '#E6E6E6',
          100: '#B0B0B0',
          200: '#8A8A8A',
          300: '#545454',
          400: '#333333',
          500: '#000000',
          600: '#000000',
          700: '#000000',
          800: '#000000',
          900: '#000000',
        },
        // Convenience aliases
        background: '#F4F9FB',
        foreground: '#333333',
        'text-neutral-on-neutral': '#F3F3F3',
      },
    },
  },
  plugins: [],
}
