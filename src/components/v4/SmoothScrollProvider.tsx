import { useEffect, type ReactNode } from 'react';
import Lenis from 'lenis';
import { EVALUATION_MODE } from './use-motion-gate';

interface SmoothScrollProviderProps {
  children?: ReactNode;
}

/**
 * SmoothScrollProvider (v4) — inicializa Lenis (scroll com inércia) no mount.
 * Diferença para a v2/v3: respeita o EVALUATION_MODE. Em modo avaliação, Lenis
 * roda MESMO com prefers-reduced-motion ligado, para Fabiano sentir o scroll
 * cinematográfico completo. Em produção (EVALUATION_MODE=false), volta a
 * desligar Lenis quando o usuário pede redução de movimento.
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

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
};

export default SmoothScrollProvider;
