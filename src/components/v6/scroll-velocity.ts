/**
 * scroll-velocity (v6) — canal mínimo entre islands para a velocidade do scroll.
 *
 * O Lenis vive no SmoothScrollProvider (um island). O Ticker scroll-reactive
 * (outro island) precisa LER a velocidade instantânea do scroll para acelerar a
 * faixa ao rolar (item 4 da elevação). Como islands Astro são árvores React
 * independentes, publicamos a velocidade num objeto-módulo singleton — leitura
 * por-frame via requestAnimationFrame, sem eventos nem re-render.
 *
 * `value` é a velocidade reportada pelo Lenis (px/frame aproximado); 0 quando
 * parado. Quem consome decide como mapear isso para boost de animação.
 */
const store = { value: 0 };

/** Publica a velocidade instantânea do scroll (chamado pelo provider Lenis). */
export const setScrollVelocity = (v: number): void => {
  store.value = v;
};

/** Lê a velocidade instantânea do scroll (chamado por-frame pelos consumidores). */
export const getScrollVelocity = (): number => store.value;
