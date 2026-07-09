import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        hrms: {
          depth: '#003D2E',
          primary: '#0B5B47',
          action: '#0F7C63',
          hover: '#24A576',
          soft: '#A8E6C9',
          tint: '#D4F4EA',
          surface: '#F0FBF7',
        },
      },
    },
  },
  plugins: [],
}

export default config
