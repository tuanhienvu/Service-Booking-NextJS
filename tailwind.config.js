/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb', // Modern tech blue
        secondary: '#475569', // Blue-gray
        accent: '#059669', // Tech green
        neutral: '#1a0a0f',
        'base-100': '#26262b',
        info: '#00e0ff',
        success: '#00ffbc',
        warning: '#b44600',
        error: '#ff5175',
      },
    },
  },
  daisyui: {
    themes: [
      {
        light: {
          ...require('daisyui/src/theming/themes')['light'],
          primary: '#2563eb',
          secondary: '#475569',
        },
        dark: {
          ...require('daisyui/src/theming/themes')['dark'],
          primary: '#2563eb',
          secondary: '#475569',
        },
      },
    ],
  },
  plugins: [require('daisyui')],
};
