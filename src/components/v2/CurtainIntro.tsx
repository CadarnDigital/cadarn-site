import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { motion as motionTokens } from '../../lib/design-tokens';

/**
 * MODO AVALIAÇÃO: a cortina toca a CADA carregamento (sem gating de sessão),
 * para Fabiano revisar a abertura em todo refresh, em qualquer versão.
 * Para produção, restaurar o gating de 1x/sessão (sessionStorage) — ver
 * bloco comentado em useEffect/dismiss.
 */
const EVALUATION_MODE = true;

/** Tempo de leitura da marca antes da cortina subir (ms). Teto total ~1,2s. */
const BRAND_HOLD_MS = 720;

/**
 * CurtainIntro — abertura de marca das versões dark (Correção 2).
 * Cortina sólida cobre a viewport. A cor vem do token --curtain-color
 * (navy no /v2, vinho no /v3) — componente compartilhado pelas duas versões.
 * A marca se apresenta:
 * a bússola (logo-splash) entra com fade+scale e o nome CADARN surge logo
 * abaixo. Após um beat de leitura, a cortina DESLIZA pra cima
 * (translateY 0 -> -100%), revelando o hero já montado por baixo.
 * - Só na primeira visita da sessão (sessionStorage).
 * - prefers-reduced-motion: não mostra cortina (pula tudo).
 * - SKIP acessível visível.
 * - Roda por cima via transform (fixed inset-0, z alto) — zero impacto em CLS.
 *   A headline (LCP) nasce visível por baixo; a cortina é puramente decorativa.
 */
export const CurtainIntro = () => {
  const prefersReduced = useReducedMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (prefersReduced) return;
    if (EVALUATION_MODE) {
      setVisible(true);
      return;
    }
    // Produção: só na primeira visita da sessão.
    // const alreadyShown = sessionStorage.getItem('cadarn_v2_intro');
    // if (!alreadyShown) setVisible(true);
  }, [prefersReduced]);

  const dismiss = (): void => {
    // Produção: gravar flag de sessão.
    // sessionStorage.setItem('cadarn_v2_intro', '1');
    setVisible(false);
  };

  if (prefersReduced) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
          style={{ backgroundColor: 'var(--curtain-color)' }}
          initial={{ y: '0%' }}
          animate={{ y: '0%' }}
          exit={{ y: '-100%' }}
          transition={{
            duration: motionTokens.duration.curtain,
            ease: motionTokens.ease.inOutCinematic,
          }}
          role="presentation"
          aria-hidden="true"
        >
          <motion.img
            src="/logo-splash.png"
            alt=""
            aria-hidden="true"
            className="h-24 w-24"
            initial={{ opacity: 0, scale: 0.86 }}
            animate={{ opacity: 0.92, scale: 1 }}
            transition={{
              duration: motionTokens.duration.slow,
              ease: motionTokens.ease.outExpo,
            }}
          />
          <motion.span
            className="mt-6 font-accent text-4xl italic tracking-tight text-on-dark-strong sm:text-5xl"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: motionTokens.duration.base,
              ease: motionTokens.ease.outSoft,
              delay: 0.18,
            }}
          >
            Cadarn
          </motion.span>
          <motion.span
            className="mt-3 font-body text-[0.65rem] uppercase tracking-[0.5em] text-accent-metal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: motionTokens.duration.base,
              ease: motionTokens.ease.outSoft,
              delay: 0.3,
            }}
          >
            Engenharia de Lucro
          </motion.span>

          <button
            type="button"
            onClick={dismiss}
            className="absolute bottom-8 right-8 z-10 font-body text-xs uppercase tracking-widest text-on-dark-muted underline underline-offset-4 transition-colors hover:text-on-dark-strong focus:outline-none focus-visible:text-on-dark-strong"
          >
            Pular intro
          </button>

          <CurtainAutoDismiss onDone={dismiss} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

interface CurtainAutoDismissProps {
  onDone: () => void;
}

/** Dispara o slide-up automático após um beat de leitura da marca. */
const CurtainAutoDismiss = ({ onDone }: CurtainAutoDismissProps) => {
  useEffect(() => {
    const t = setTimeout(onDone, BRAND_HOLD_MS);
    return () => clearTimeout(t);
  }, [onDone]);
  return null;
};

export default CurtainIntro;
