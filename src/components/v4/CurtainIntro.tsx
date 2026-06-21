import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { motion as motionTokens } from '../../lib/design-tokens';
import { EVALUATION_MODE, useSkipMotion } from './use-motion-gate';

/**
 * CurtainIntro (v4) — RITUAL DE ABERTURA em 3 beats (referência Resn).
 * Cortina sólida na cor da marca (--curtain-color = vinho) cobre a viewport e
 * encena a entrada antes de revelar o hero já montado por baixo.
 *
 * Beat 1 — SILÊNCIO/PRELOADER (~840ms): fundo vinho, bússola (logo-splash)
 *   pequena centralizada + barra de progresso fina (2px) preenchendo da
 *   esquerda (caramelo sobre trilho escuro, via scaleX).
 * Beat 2 — REVELAÇÃO: "Cadarn" em serifa grande peso leve (tracking levemente
 *   negativo) + "Engenharia de Lucro" em caramelo uppercase tracking largo,
 *   com fade + translateY.
 * Beat 3 — SAÍDA: a cortina sobe (translateY 0 -> -100%, easing cinematográfico)
 *   revelando o hero.
 *
 * Total ~1,8s. Só transform/opacity. Zero CLS (overlay fixed z alto; o hero/LCP
 * nasce visível por baixo). Skip acessível visível. Em modo avaliação toca a
 * CADA refresh e ignora prefers-reduced-motion.
 */

/** Duração do beat 1 (preloader + barra de progresso) em ms. */
const PRELOADER_MS = 840;
/** Tempo total da cortina visível antes do slide-up (beats 1+2) em ms. */
const HOLD_MS = 1640;

export const CurtainIntro = () => {
  const skipMotion = useSkipMotion();
  const [visible, setVisible] = useState(false);
  /** beat 1 = preloader; beat 2 = marca revelada. */
  const [beat, setBeat] = useState<1 | 2>(1);

  useEffect(() => {
    if (skipMotion) return;
    if (EVALUATION_MODE) {
      setVisible(true);
      return;
    }
    // Produção: só na primeira visita da sessão.
    // const alreadyShown = sessionStorage.getItem('cadarn_v4_intro');
    // if (!alreadyShown) setVisible(true);
  }, [skipMotion]);

  useEffect(() => {
    if (!visible) return;
    const toBeat2 = setTimeout(() => setBeat(2), PRELOADER_MS);
    const close = setTimeout(() => dismiss(), HOLD_MS);
    return () => {
      clearTimeout(toBeat2);
      clearTimeout(close);
    };
  }, [visible]);

  const dismiss = (): void => {
    // Produção: gravar flag de sessão.
    // sessionStorage.setItem('cadarn_v4_intro', '1');
    setVisible(false);
  };

  if (skipMotion) return null;

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
          {/* ── Bússola/logo pequena centralizada (presente nos 2 beats) ── */}
          <motion.img
            src="/logo-splash.png"
            alt=""
            aria-hidden="true"
            className="h-20 w-20"
            initial={{ opacity: 0, scale: 0.86 }}
            animate={{ opacity: 0.92, scale: 1 }}
            transition={{
              duration: motionTokens.duration.slow,
              ease: motionTokens.ease.outExpo,
            }}
          />

          {/* ── BEAT 1: barra de progresso fina (caramelo sobre trilho) ── */}
          {beat === 1 && (
            <div
              className="mt-10 h-[2px] w-40 overflow-hidden rounded-full"
              style={{ backgroundColor: 'var(--curtain-track)' }}
            >
              <motion.div
                className="h-full w-full origin-left"
                style={{ backgroundColor: 'var(--curtain-progress)' }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{
                  duration: PRELOADER_MS / 1000,
                  ease: motionTokens.ease.outSoft,
                }}
              />
            </div>
          )}

          {/* ── BEAT 2: revelação da marca ── */}
          {beat === 2 && (
            <>
              <motion.span
                className="v-tight mt-8 font-accent text-5xl font-light italic text-on-dark-strong sm:text-6xl"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: motionTokens.duration.base,
                  ease: motionTokens.ease.outSoft,
                }}
              >
                Cadarn
              </motion.span>
              <motion.span
                className="mt-4 font-body text-[0.65rem] uppercase tracking-[0.55em] text-accent-metal"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: motionTokens.duration.base,
                  ease: motionTokens.ease.outSoft,
                  delay: 0.12,
                }}
              >
                Engenharia de Lucro
              </motion.span>
            </>
          )}

          <button
            type="button"
            onClick={dismiss}
            className="absolute bottom-8 right-8 z-10 font-body text-xs uppercase tracking-widest text-on-dark-muted underline underline-offset-4 transition-colors hover:text-on-dark-strong focus:outline-none focus-visible:text-on-dark-strong"
          >
            Pular intro
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CurtainIntro;
