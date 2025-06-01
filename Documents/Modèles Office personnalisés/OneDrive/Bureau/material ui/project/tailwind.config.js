/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f5ff',
          100: '#e0eaff',
          200: '#c7d9ff',
          300: '#a3bdff',
          400: '#7a97ff',
          500: '#5352ED', // Primary color
          600: '#3f38e0',
          700: '#342ac2',
          800: '#2c259e',
          900: '#29237d',
        },
        secondary: {
          50: '#eefcf3',
          100: '#d7f9e5',
          200: '#b2f0cd',
          300: '#80e2ac',
          400: '#2ED573', // Secondary color
          500: '#22b964',
          600: '#1a9653',
          700: '#197544',
          800: '#195d39',
          900: '#174d32',
        },
        accent: {
          50: '#fff1f1',
          100: '#ffe1e1',
          200: '#ffc7c7',
          300: '#ffa0a0',
          400: '#ff6e6e',
          500: '#FF4757', // Accent color
          600: '#e92042',
          700: '#cf1534',
          800: '#a9152f',
          900: '#8c162c',
        },
        neutral: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Montserrat', 'sans-serif'],
      },
      animation: {
        'bounce-slow': 'bounce 3s infinite',
      },
    },
  },
  plugins: [],
};