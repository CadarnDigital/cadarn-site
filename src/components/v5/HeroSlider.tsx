import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { motion as motionTokens } from '../../lib/design-tokens';
import { useSkipMotion } from './use-motion-gate';

/**
 * HeroSlider (v4 — Passo 4.1) — fundo do hero que cicla entre estados visuais
 * com crossfade automático (só opacity), enquanto a headline fica FIXA por cima.
 *
 * NÃO usa fotos reais: cada estado é um gradiente/textura DUOTONE na cor da
 * marca (vinho sombra / caramelo luz), via tokens --hero-state-* de tokens-v4.css.
 * Quando houver fotos reais, basta trocar o `background` de cada estado por uma
 * imagem com o mesmo tratamento duotone (filtro/overlay na cor da marca).
 *
 * Renderiza como camada de fundo absoluta (z-0); o conteúdo do hero vai por cima.
 * Em modo avaliação cicla mesmo com reduced-motion; senão fica no estado 1.
 */

/** Estados de fundo — placeholders duotone na cor da marca (sem fotos reais). */
const STATES = [
  'var(--hero-state-1)',
  'var(--hero-state-2)',
  'var(--hero-state-3)',
] as const;

/** Intervalo entre trocas de estado (ms). */
const CYCLE_MS = 5000;

export const HeroSlider = () => {
  const skipMotion = useSkipMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (skipMotion) return;
    const id = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % STATES.length);
    }, CYCLE_MS);
    return () => window.clearInterval(id);
  }, [skipMotion]);

  // Reduced-motion (produção): mostra só o primeiro estado, sem ciclo.
  if (skipMotion) {
    return (
      <div
        className="absolute inset-0 z-0"
        style={{ background: STATES[0] }}
        aria-hidden="true"
      />
    );
  }

  return (
    <div className="absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      <AnimatePresence>
        <motion.div
          key={index}
          className="absolute inset-0"
          style={{ background: STATES[index] }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: motionTokens.duration.slow * 2.4,
            ease: motionTokens.ease.outSoft,
          }}
        />
      </AnimatePresence>
    </div>
  );
};

export default HeroSlider;
