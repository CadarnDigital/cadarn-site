import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: '#0e2a4a',
        vinho: '#5e0f0b',
        caramelo: '#9a7a51',
        offwhite: '#f1e4d3',

        'section-dark': '#0e2a4a',
        'section-light': '#f1e4d3',
        'bg-cover': '#081520',
        'border-light': '#d9cfc3',

        'status-green': '#2d6a4f',
        'status-yellow': '#b08d20',
        'status-red': '#9b2226',

        'bandeira-roi': '#5e0f0b',
        'bandeira-amador': '#0e2a4a',
        'bandeira-branding': '#9a7a51',
        'bandeira-hibrida': '#2d6a4f',
        'bandeira-radical': '#6b2fa0',
      },
      fontFamily: {
        headline: ['"Helvetica Now Display"', 'Helvetica', 'Arial', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        accent: ['"Canela Italic"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      maxWidth: {
        content: '75rem',
        article: '45rem',
      },
      boxShadow: {
        card: '0 1px 3px rgba(14, 42, 74, 0.08)',
        'card-hover': '0 4px 12px rgba(14, 42, 74, 0.12)',
        hero: '0 8px 32px rgba(14, 42, 74, 0.15)',
      },
    },
  },
  plugins: [],
} satisfies Config;
