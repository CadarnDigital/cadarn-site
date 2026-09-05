// Tokens do Design System Cadarn — fonte de verdade para uso em JS/TSX.
// Para classes Tailwind, usar os tokens do tailwind.config.ts diretamente.
export const colors = {
  navy:     '#0e2a4a',
  vinho:    '#5e0f0b',
  caramelo: '#9a7a51',
  offwhite: '#f1e4d3',
} as const;

// rgba helpers — usados em inline styles e animações CSS-in-JS
export const rgba = {
  caramelo: (a: number) => `rgba(154, 122, 81, ${a})`,
  navy:     (a: number) => `rgba(14, 42, 74, ${a})`,
  vinho:    (a: number) => `rgba(94, 15, 11, ${a})`,
} as const;

// ─── v2 (aditivo) ───────────────────────────────────────────────────
// Espelha durations/easings de tokens-v2.css para uso em Framer Motion.
// Durations em segundos; easings como arrays de bezier.
export const motion = {
  duration: {
    instant: 0.12,
    fast:    0.22,
    base:    0.4,
    slow:    0.65,
    curtain: 0.7,
  },
  ease: {
    outSoft:       [0.22, 1, 0.36, 1],
    outExpo:       [0.16, 1, 0.3, 1],
    inOutCinematic:[0.65, 0, 0.35, 1],
    springUi:      [0.34, 1.56, 0.64, 1],
  },
  staggerStep: 0.06,
} as const;
