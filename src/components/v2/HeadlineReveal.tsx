import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { motion as motionTokens } from '../../lib/design-tokens';

interface HeadlineRevealProps {
  /** Linhas da headline como texto real (cada item vira uma linha). */
  lines: string[];
  className?: string;
}

/**
 * HeadlineReveal — reveal escalonado da headline POR LINHA.
 * Anti-CLS / LCP-safe: as linhas existem como texto real e nascem VISIVEIS no
 * HTML do servidor (sem opacity:0 no SSR). A animacao so e armada APOS o mount,
 * rodando translateY + opacity POR CIMA do texto ja pintado.
 * Reduced-motion: texto estatico, sem animacao.
 * Serifa oversize (font-accent — Canela Italic).
 */
export const HeadlineReveal = ({ lines, className = '' }: HeadlineRevealProps) => {
  const prefersReduced = useReducedMotion();
  const [armed, setArmed] = useState(false);

  // So arma a animacao depois do mount no cliente. No SSR e no primeiro paint,
  // o texto fica visivel (animate = estado final), preservando o LCP.
  useEffect(() => {
    if (!prefersReduced) setArmed(true);
  }, [prefersReduced]);

  const base =
    'font-accent italic text-on-dark-strong text-[clamp(2.5rem,7vw,5.5rem)] leading-[1.0] tracking-tight';

  if (prefersReduced) {
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
        // Wrapper com overflow-hidden reserva a altura (sem CLS); a linha sobe por dentro.
        <span key={i} className="block overflow-hidden pb-[0.06em]">
          <motion.span
            className="block"
            // initial só passa a valer quando armamos no cliente; no SSR
            // initial={false} faz o nó nascer no estado final (visivel).
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
