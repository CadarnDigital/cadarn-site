import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'cadarn-navy': '#0e2a4a',
        'cadarn-vinho': '#5e0f0b',
        'cadarn-caramelo': '#9a7a51',
        'cadarn-offwhite': '#f1e4d3',
        'cadarn-bgcover': '#081520',
        'cadarn-border-light': '#d9cfc3',
      },
      fontFamily: {
        headline: ['Inter', 'Arial', 'sans-serif'],
        body: ['Inter', 'Arial', 'sans-serif'],
        accent: ['Georgia', 'Garamond', 'serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(14, 42, 74, 0.08)',
        'card-hover': '0 4px 12px rgba(14, 42, 74, 0.12)',
        'hero': '0 8px 32px rgba(14, 42, 74, 0.15)',
      },
    },
  },
  plugins: [],
} satisfies Config;
