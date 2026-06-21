import { useEffect, type ReactNode } from 'react';
import Lenis from 'lenis';
import { EVALUATION_MODE } from './use-motion-gate';
import { subscribeLenisLock } from './lenis-lock';

interface SmoothScrollProviderProps {
  children?: ReactNode;
}

/**
 * SmoothScrollProvider (v5) — inicializa Lenis (scroll com inércia) no mount.
 * Respeita o EVALUATION_MODE: em modo avaliação, Lenis roda MESMO com
 * prefers-reduced-motion ligado, para Fabiano sentir o scroll cinematográfico
 * completo. Em produção (EVALUATION_MODE=false), volta a desligar Lenis quando
 * o usuário pede redução de movimento.
 *
 * DIFERENÇA v5: começa TRAVADO (lenis.stop) e escuta os eventos de lock/unlock
 * do IntroRitual via lenis-lock.ts. O scroll só libera quando a abertura termina.
 * Não combinar com <ClientRouter> do Astro (conflito documentado #12725).
 */
export const SmoothScrollProvider = ({ children }: SmoothScrollProviderProps) => {
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced && !EVALUATION_MODE) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    // Começa travado: a abertura (IntroRitual) controla o destravamento.
    lenis.stop();

    const unsubscribe = subscribeLenisLock(
      () => lenis.stop(),
      () => lenis.start(),
    );

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      unsubscribe();
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
};

export default SmoothScrollProvider;
