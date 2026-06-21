import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { motion as motionTokens } from '../../lib/design-tokens';
import { useSkipMotion } from './use-motion-gate';

interface HeadlineRevealProps {
  /** Linhas da headline como texto real (cada item vira uma linha). */
  lines: string[];
  className?: string;
}

/**
 * HeadlineReveal (v4) — reveal escalonado da headline POR LINHA.
 * Anti-CLS / LCP-safe: as linhas nascem VISÍVEIS no HTML do servidor; a animação
 * só é armada APÓS o mount, rodando translateY + opacity por cima do texto já
 * pintado. Usa useSkipMotion() (modo avaliação ignora reduced-motion).
 * Tipografia v4: letter-spacing mais negativo (estilo Resn) via .v-tighter.
 */
export const HeadlineReveal = ({ lines, className = '' }: HeadlineRevealProps) => {
  const skipMotion = useSkipMotion();
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    if (!skipMotion) setArmed(true);
  }, [skipMotion]);

  const base =
    'v-tighter font-accent italic text-on-dark-strong text-[clamp(2.75rem,7.5vw,6rem)] leading-[0.98]';

  if (skipMotion) {
    return (
      <h1 className={`${base} ${className}`}>
        {lines.map((line, i) => (
          <span key={i} className="block">
            {line}
          </span>
        ))}
      </h1>
    );
  }

  return (
    <h1 className={`${base} ${className}`}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.06em]">
          <motion.span
            className="block"
            initial={armed ? { opacity: 0, y: '100%' } : false}
            animate={{ opacity: 1, y: '0%' }}
            transition={{
              duration: motionTokens.duration.slow,
              ease: motionTokens.ease.outExpo,
              delay: i * motionTokens.staggerStep * 2,
            }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </h1>
  );
};

export default HeadlineReveal;
