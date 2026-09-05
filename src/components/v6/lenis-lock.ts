/**
 * lenis-lock (v5) — canal mínimo de coordenação entre islands isolados.
 *
 * O Lenis vive no SmoothScrollProvider (um island). O IntroRitual (outro island)
 * precisa TRAVAR o scroll durante a abertura e DESTRAVAR ao final. Como islands
 * Astro são árvores React independentes, usamos eventos de janela tipados como
 * ponte: o ritual dispara lock/unlock e o provider escuta e chama stop()/start().
 *
 * Robustez: também travamos o <html> via overflow para o caso de o provider ainda
 * não ter montado o Lenis (ou ele estar desligado em produção com reduced-motion).
 */

const LOCK_EVENT = 'cadarn:lenis-lock';
const UNLOCK_EVENT = 'cadarn:lenis-unlock';

/** Trava o scroll (ritual de abertura em andamento). */
export const lockScroll = (): void => {
  if (typeof window === 'undefined') return;
  document.documentElement.style.overflow = 'hidden';
  window.dispatchEvent(new Event(LOCK_EVENT));
};

/** Destrava o scroll (ritual concluído). */
export const unlockScroll = (): void => {
  if (typeof window === 'undefined') return;
  document.documentElement.style.overflow = '';
  window.dispatchEvent(new Event(UNLOCK_EVENT));
};

/**
 * Registra os handlers de lock/unlock no provider do Lenis.
 * Retorna a função de cleanup para remover os listeners no unmount.
 */
export const subscribeLenisLock = (onLock: () => void, onUnlock: () => void): (() => void) => {
  window.addEventListener(LOCK_EVENT, onLock);
  window.addEventListener(UNLOCK_EVENT, onUnlock);
  return () => {
    window.removeEventListener(LOCK_EVENT, onLock);
    window.removeEventListener(UNLOCK_EVENT, onUnlock);
  };
};
