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

        // ── v2/v3 (aditivo) — superfícies dark DERIVADAS DE TOKENS POR PÁGINA ──
        // Os valores vêm de CSS vars (tokens-v2.css = navy / tokens-v3.css = vinho),
        // carregadas pelo layout de cada página. Componentes são compartilhados;
        // a cor dominante é decidida pelo token file que a página importa.
        // v1 (navy/vinho/caramelo/offwhite acima) permanece estática e intacta.
        'surface-base': 'var(--surface-base)',
        'surface-abyss': 'var(--surface-abyss)',
        'surface-raised': 'var(--surface-raised)',
        'surface-vinho': 'var(--surface-vinho)',
        // ── superfícies de APOIO (acento de apoio — vinho no v2, navy no v3) ──
        'surface-navy': 'var(--surface-navy)',
        'surface-navy-deep': 'var(--surface-navy-deep)',
        'surface-navy-raised': 'var(--surface-navy-raised)',
        'accent-metal': 'var(--accent-metal)',
        'accent-metal-hi': 'var(--accent-metal-hi)',
        // ── texto sobre dark (comum às duas versões) ──
        'on-dark-strong': 'var(--on-dark-strong)',
        'on-dark-body': 'var(--on-dark-body)',
        'on-dark-muted': 'var(--on-dark-muted)',
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

        // ── v2 (aditivo) — shadows dark + glow caramelo ──
        'dark-sm': '0 1px 3px rgba(0, 0, 0, 0.4)',
        'dark-md': '0 8px 24px rgba(0, 0, 0, 0.45)',
        'dark-lg': '0 24px 64px rgba(0, 0, 0, 0.55)',
        glow: '0 0 40px rgba(154, 122, 81, 0.35)',
      },
    },
  },
  plugins: [],
} satisfies Config;
