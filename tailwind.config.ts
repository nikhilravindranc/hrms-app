import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      colors: {
        hrms: {
          depth: '#003D2E',
          primary: '#004D43',
          action: '#00755A',
          hover: '#27EAA6',
          soft: '#ABE6D1',
          surface: '#E8EFF6',
          purple: '#5E93FF',
          lime: '#D0FF71',
        },
      },
    },
  },
  plugins: [],
}

export default config
