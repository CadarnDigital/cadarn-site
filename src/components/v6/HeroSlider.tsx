import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSkipMotion } from './use-motion-gate';

/**
 * HeroSlider (v6 — item 2: hero slider com DUOTONE + KEN BURNS).
 *
 * ELEVAÇÃO v6 vs v5: na v5 o fundo só fazia crossfade de opacity entre 3 estados
 * de gradiente. Na v6 cada estado é uma FOTO-placeholder em DUOTONE na cor da
 * marca (vinho sombra -> caramelo luz) E ganha um leve KEN BURNS contínuo
 * (scale 1.06 -> 1 em 6s, linear) — o movimento imperceptível que dá "vida" sem
 * agitar. [fonte: anatomia-navegacao-instituto-futuros-cadarn]
 *
 * SEM FOTOS REAIS: cada slide é um gradiente duotone (placeholder). Quando
 * houver fotos reais, trocar `--v6-hero-photo-*` por url(...) em grayscale e
 * manter as overlays multiply(vinho)/lighten(caramelo) — o tratamento de marca
 * já fica pronto. Tratamento aplicado via .v6-duotone (v-shared).
 *
 * Timing: 5000ms/slide, crossfade 900ms easeInOut, Ken Burns 6s linear.
 * Só opacity + transform anima (GPU). Em modo avaliação cicla mesmo com
 * reduced-motion; senão fica no estado 1 sem Ken Burns.
 */

/** Slides — placeholders duotone na cor da marca (sem fotos reais). */
const SLIDES = [
  'var(--v6-hero-photo-1)',
  'var(--v6-hero-photo-2)',
  'var(--v6-hero-photo-3)',
] as const;

/** Intervalo entre trocas de slide (ms). */
const CYCLE_MS = 5000;

export const HeroSlider = () => {
  const skipMotion = useSkipMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (skipMotion) return;
    const id = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % SLIDES.length);
    }, CYCLE_MS);
    return () => window.clearInterval(id);
  }, [skipMotion]);

  // Reduced-motion (produção): mostra só o primeiro slide, sem ciclo nem Ken Burns.
  if (skipMotion) {
    return (
      <div className="absolute inset-0 z-0 v6-duotone" aria-hidden="true">
        <div className="absolute inset-0" style={{ background: SLIDES[0] }} />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 z-0 overflow-hidden v6-duotone" aria-hidden="true">
      <AnimatePresence>
        <motion.div
          key={index}
          className="absolute inset-0"
          style={{ background: SLIDES[index] }}
          // Crossfade (opacity) + Ken Burns (scale 1.06 -> 1).
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            opacity: { duration: 0.9, ease: 'easeInOut' },
            scale: { duration: 6, ease: 'linear' },
          }}
        />
      </AnimatePresence>
    </div>
  );
};

export default HeroSlider;
