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
