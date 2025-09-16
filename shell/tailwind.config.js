/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          100: 'var(--primary-100)',
          200: 'var(--primary-200)',
          300: 'var(--primary-300)',
          700: 'var(--primary-700)',
        },
        secondary: {
          700: 'var(--secondary-700)',
        },
        tertiary: {
          600: 'var(--tertiary-600)',
          700: 'var(--tertiary-700)',
        },
        error: {
          700: 'var(--error-700)',
        },
        success: {
          700: 'var(--success-700)',
        },
        neutral: {
          50: 'var(--white-50)',
          700: 'var(--white-700)',
          800: 'var(--white-800)',
          900: 'var(--black-400)',
        },
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        accent: 'var(--accent)',
        'background-muted': 'var(--background-muted)',
        'foreground-muted': 'var(--foreground-muted)',
      },
      fontFamily: {
        sans: ['var(--font-family-primary)'],
        heading: ['var(--font-family-secondary)'],
      },
      borderRadius: {
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        DEFAULT: 'var(--shadow-base)',
        lg: 'var(--shadow-lg)',
        focus: 'var(--shadow-focus) var(--accent)',
      },
    },
  },
  plugins: [],
}
