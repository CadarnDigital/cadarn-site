import { useEffect, type ReactNode } from 'react';
import Lenis from 'lenis';
import { EVALUATION_MODE } from './use-motion-gate';
import { subscribeLenisLock } from './lenis-lock';
import { setScrollVelocity } from './scroll-velocity';

interface SmoothScrollProviderProps {
  children?: ReactNode;
}

/**
 * SmoothScrollProvider (v6) — inicializa Lenis (scroll com inércia) no mount.
 *
 * ELEVAÇÃO v6 (item 8 — Lenis calibrado, a FUNDAÇÃO do "ao subir é top"):
 *  - easing trocado para easeOutCubic explícito: `1 - (1-t)^3` (a recomendação
 *    do Atlas para a sensação premium). [fonte: anatomia-navegacao-instituto-futuros-cadarn]
 *  - duration 1.1s (faixa 1.0-1.2 recomendada) — amortecimento longo e suave.
 *  - publica a velocidade instantânea do scroll (lenis.on('scroll')) no canal
 *    scroll-velocity, para o Ticker reagir ao gesto (item 4).
 *
 * Respeita o EVALUATION_MODE: em modo avaliação, Lenis roda MESMO com
 * prefers-reduced-motion ligado. Em produção (EVALUATION_MODE=false) volta a
 * desligar quando o usuário pede redução de movimento.
 *
 * Começa TRAVADO (lenis.stop) e escuta os eventos de lock/unlock do IntroRitual
 * via lenis-lock.ts — o scroll só libera quando a abertura termina.
 * Não combinar com <ClientRouter> do Astro (conflito documentado #12725).
 */
export const SmoothScrollProvider = ({ children }: SmoothScrollProviderProps) => {
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced && !EVALUATION_MODE) return;

    const lenis = new Lenis({
      duration: 1.1,
      // easeOutCubic — a base do "ao subir é top" (item 8).
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
    });

    // Publica a velocidade do scroll para os consumidores (Ticker, etc.).
    // O callback de 'scroll' recebe a própria instância do Lenis.
    lenis.on('scroll', (instance: Lenis) => {
      setScrollVelocity(instance.velocity);
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
      setScrollVelocity(0);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
};

export default SmoothScrollProvider;
