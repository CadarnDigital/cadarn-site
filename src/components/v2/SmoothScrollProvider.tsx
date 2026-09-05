import { useEffect, type ReactNode } from 'react';
import Lenis from 'lenis';

interface SmoothScrollProviderProps {
  children?: ReactNode;
}

/**
 * SmoothScrollProvider — inicializa Lenis (scroll com inércia) no mount.
 * Respeita prefers-reduced-motion: se reduzido, NÃO inicializa Lenis
 * e mantém o scroll nativo do navegador.
 * Não combinar com <ClientRouter> do Astro (conflito documentado #12725).
 */
export const SmoothScrollProvider = ({ children }: SmoothScrollProviderProps) => {
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

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
