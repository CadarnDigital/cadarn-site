import { useEffect, useRef, useState } from 'react';
import { motion, animate as motionAnimate, useMotionValue, useAnimationControls } from 'framer-motion';
import { EVALUATION_MODE, useSkipMotion } from './use-motion-gate';
import { lockScroll, unlockScroll } from './lenis-lock';

/**
 * IntroRitualV7 — ENGRENAGEM QUE CONSTRÓI A BÚSSOLA.
 *
 * Storyboard aprovado (2026-06-21):
 *   0.0s  Tela vinho. Silêncio.
 *   0.2s  Gear sound (desbloqueado por hover). Engrenagem emerge girando.
 *   1.8s  Dentes somem (opacity→0), traços cardinais desenham (pathLength 0→1)
 *         enquanto a rotação desacelera até parar em 0°.
 *   3.0s  Bússola formada. Agulha oscila e trava Norte.
 *   3.4s  "Clique para entrar" surge em caramelo com underline animado.
 *   Click  Arrow sound. Flecha sobe (pathLength). Overlay some por clip-path 0.6s.
 *   5s     Auto: fade cinematográfico 1.2s.
 *
 * Fix do bug v6: overlay inicia com overlayVisible=true (renderizado no SSR),
 * eliminando o flash "site aparece antes da abertura". O div #v7-intro-cover
 * no Astro layout é o fallback pré-hidratação — este componente o remove no mount.
 */

// Gear polygon (10 dentes, outer r=85, inner r=70) centrado em (0,0).
// Renderizado dentro de <g transform="translate(100,100)"> no SVG 200×200.
const GEAR_PATH =
  'M0,-85 L21.63,-66.57 L49.98,-68.77 L56.63,-41.16 L80.84,-26.27 ' +
  'L70,0 L80.84,26.27 L56.63,41.16 L49.98,68.77 L21.63,66.57 ' +
  'L0,85 L-21.63,66.57 L-49.98,68.77 L-56.63,41.16 L-80.84,26.27 ' +
  'L-70,0 L-80.84,-26.27 L-56.63,-41.16 L-49.98,-68.77 L-21.63,-66.57 Z';

export const IntroRitualV7 = () => {
  const skipMotion = useSkipMotion();

  // Iniciar visível para evitar flash de conteúdo antes da hidratação.
  const [overlayVisible, setOverlayVisible] = useState(true);
  const [teethVisible, setTeethVisible] = useState(true);
  const [cardinalsVisible, setCardinalsVisible] = useState(false);
  const [promptVisible, setPromptVisible] = useState(false);
  const [arrowDrawing, setArrowDrawing] = useState(false);
  const [exitMode, setExitMode] = useState<'click' | 'auto' | null>(null);

  const hasOpenedRef = useRef(false);
  const gearAudioRef = useRef<HTMLAudioElement | null>(null);
  const arrowAudioRef = useRef<HTMLAudioElement | null>(null);
  const gearUnlockedRef = useRef(false);

  const gearRotation = useMotionValue(0);
  const needleControls = useAnimationControls();

  useEffect(() => {
    // Remove o cover estático do Astro — React assume o controle agora.
    document.getElementById('v7-intro-cover')?.remove();

    if (skipMotion && !EVALUATION_MODE) {
      setOverlayVisible(false);
      return;
    }

    lockScroll();

    // Carregar sons (falha silenciosa — arquivos podem não existir ainda).
    try {
      gearAudioRef.current = new Audio('/sounds/gear.mp3');
      gearAudioRef.current.volume = 0.35;
      gearAudioRef.current.preload = 'auto';
      arrowAudioRef.current = new Audio('/sounds/arrow.mp3');
      arrowAudioRef.current.volume = 0.55;
      arrowAudioRef.current.preload = 'auto';
    } catch {
      // Audio não disponível
    }

    // Engrenagem gira 5 voltas em 1.8s (linear, velocidade constante).
    const gearCtrl = motionAnimate(gearRotation, 360 * 5, {
      duration: 1.8,
      ease: 'linear',
    });

    // 1.8s → fase bússola: dentes somem, cardinais aparecem, giro desacelera.
    const tCompass = setTimeout(() => {
      setTeethVisible(false);
      setCardinalsVisible(true);

      gearCtrl.stop();
      const cur = gearRotation.get();
      const rem = cur % 360;
      const target = rem === 0 ? cur : cur + (360 - rem);
      motionAnimate(gearRotation, target, {
        duration: 1.2,
        ease: [0.25, 1, 0.5, 1],
      });
    }, 1800);

    // 3.0s → agulha oscila e trava no Norte.
    const tNeedle = setTimeout(async () => {
      await needleControls.start({
        rotate: [0, 22, -16, 11, -6, 3, -1, 0.5, 0],
        transition: {
          duration: 0.85,
          ease: 'easeInOut',
          times: [0, 0.15, 0.3, 0.45, 0.6, 0.72, 0.83, 0.93, 1],
        },
      });
      await needleControls.start({
        rotate: 0,
        transition: { duration: 0.15, ease: 'linear' },
      });
    }, 3000);

    // 3.4s → prompt "Clique para entrar".
    const tPrompt = setTimeout(() => setPromptVisible(true), 3400);

    // 5.0s → abertura automática (fade 1.2s).
    const tAuto = setTimeout(() => {
      if (hasOpenedRef.current) return;
      hasOpenedRef.current = true;
      setExitMode('auto');
      setTimeout(() => {
        setOverlayVisible(false);
        unlockScroll();
      }, 1200);
    }, 5000);

    return () => {
      gearCtrl.stop();
      clearTimeout(tCompass);
      clearTimeout(tNeedle);
      clearTimeout(tPrompt);
      clearTimeout(tAuto);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Hover desbloqueado → gear sound toca desde o início do ritual.
  const handleHover = () => {
    if (gearUnlockedRef.current || !gearAudioRef.current) return;
    gearAudioRef.current
      .play()
      .then(() => { gearUnlockedRef.current = true; })
      .catch(() => {});
  };

  // Click → arrow sound + flecha sobe + clip-path revela site.
  const handleClick = () => {
    if (hasOpenedRef.current || !promptVisible) return;
    hasOpenedRef.current = true;
    arrowAudioRef.current?.play().catch(() => {});
    setArrowDrawing(true);
    setExitMode('click');
    setTimeout(() => {
      setOverlayVisible(false);
      unlockScroll();
    }, 700);
  };

  const handleSkip = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasOpenedRef.current) return;
    hasOpenedRef.current = true;
    setOverlayVisible(false);
    unlockScroll();
  };

  if (!overlayVisible) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex cursor-pointer flex-col items-center justify-center overflow-hidden"
      style={{ backgroundColor: '#5e0f0b' }}
      animate={
        exitMode === 'click'
          ? { clipPath: 'inset(0 0 100% 0)' }
          : exitMode === 'auto'
            ? { opacity: 0 }
            : { opacity: 1, clipPath: 'inset(0 0 0% 0)' }
      }
      transition={
        exitMode === 'click'
          ? { clipPath: { duration: 0.6, ease: 'easeInOut' } }
          : { opacity: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } }
      }
      onClick={handleClick}
      onHoverStart={handleHover}
      role="presentation"
      aria-hidden="true"
    >
      {/* ── ENGRENAGEM / BÚSSOLA ── */}
      <motion.div
        className="relative h-56 w-56"
        animate={promptVisible ? { scale: [1, 1.018, 1] } : { scale: 1 }}
        transition={promptVisible ? { duration: 3, ease: 'easeInOut', repeat: Infinity } : {}}
      >
        <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full" fill="none">

          {/* Grupo centrado no (100,100) do viewBox */}
          <g transform="translate(100,100)">

            {/* ─ GRUPO QUE GIRA (engrenagem) ─ */}
            <motion.g style={{ rotate: gearRotation }}>
              {/* Dentes — somem na fase bússola */}
              <motion.path
                d={GEAR_PATH}
                stroke="var(--accent-metal)"
                strokeWidth="1.5"
                fill="rgba(154,122,81,0.07)"
                animate={{ opacity: teethVisible ? 1 : 0 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
              />
              {/* Anel externo — fica como anel da bússola */}
              <circle r="85" stroke="var(--accent-metal)" strokeWidth="1.2" />
              {/* Hub central */}
              <circle r="20" stroke="var(--accent-metal)" strokeWidth="0.8" fill="rgba(154,122,81,0.04)" />
            </motion.g>

            {/* ─ FRAME FIXO: cardinais + agulha (não giram com a engrenagem) ─ */}
            {cardinalsVisible && (
              <>
                {/* Norte — linha mais grossa e clara */}
                <motion.path
                  d="M0,-83 L0,-22"
                  stroke="var(--on-dark-strong)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray="0 1"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{
                    pathLength: { duration: 0.65, ease: [0.65, 0, 0.35, 1] },
                    opacity: { duration: 0.2 },
                  }}
                />
                {/* Sul */}
                <motion.path
                  d="M0,83 L0,22"
                  stroke="var(--accent-metal)"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeDasharray="0 1"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{
                    pathLength: { duration: 0.65, ease: [0.65, 0, 0.35, 1], delay: 0.08 },
                    opacity: { duration: 0.2, delay: 0.08 },
                  }}
                />
                {/* Leste */}
                <motion.path
                  d="M83,0 L22,0"
                  stroke="var(--accent-metal)"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeDasharray="0 1"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{
                    pathLength: { duration: 0.65, ease: [0.65, 0, 0.35, 1], delay: 0.16 },
                    opacity: { duration: 0.2, delay: 0.16 },
                  }}
                />
                {/* Oeste */}
                <motion.path
                  d="M-83,0 L-22,0"
                  stroke="var(--accent-metal)"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeDasharray="0 1"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{
                    pathLength: { duration: 0.65, ease: [0.65, 0, 0.35, 1], delay: 0.12 },
                    opacity: { duration: 0.2, delay: 0.12 },
                  }}
                />
                {/* N label */}
                <motion.text
                  x="0" y="-89"
                  textAnchor="middle"
                  fontSize="7"
                  fontWeight="700"
                  fill="var(--on-dark-strong)"
                  fontFamily="system-ui, sans-serif"
                  letterSpacing="1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.35, delay: 0.6 }}
                >
                  N
                </motion.text>

                {/* ─ AGULHA DA BÚSSOLA ─ */}
                <motion.g animate={needleControls} initial={{ rotate: 0 }}>
                  {/* Ponta Norte (offwhite — aponta para cima = Norte) */}
                  <path
                    d="M0,-70 L8,0 L0,0 L-8,0 Z"
                    fill="var(--on-dark-strong)"
                  />
                  {/* Ponta Sul (caramelo escuro) */}
                  <path
                    d="M0,70 L8,0 L0,0 L-8,0 Z"
                    fill="var(--accent-metal)"
                    opacity="0.75"
                  />
                  {/* Pivô central */}
                  <circle r="5" fill="#5e0f0b" stroke="var(--accent-metal)" strokeWidth="1.5" />
                </motion.g>
              </>
            )}
          </g>
        </svg>
      </motion.div>

      {/* ── PROMPT "CLIQUE PARA ENTRAR" ── */}
      {promptVisible && (
        <motion.div
          className="mt-10 flex flex-col items-center gap-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="font-body text-xs uppercase tracking-[0.4em] text-accent-metal">
            Clique para entrar
          </span>
          <motion.div
            className="h-px origin-left bg-accent-metal"
            style={{ width: '9rem' }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          />
        </motion.div>
      )}

      {/* ── FLECHA (rasgo de saída no click) ── */}
      {arrowDrawing && (
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <motion.line
            x1="50" y1="102"
            x2="51" y2="-2"
            stroke="var(--accent-metal)"
            strokeWidth="0.4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.22, ease: 'easeIn' }}
          />
        </svg>
      )}

      {/* Pular intro */}
      <button
        type="button"
        onClick={handleSkip}
        className="absolute bottom-8 right-8 font-body text-xs uppercase tracking-widest text-on-dark-muted underline underline-offset-4 transition-colors hover:text-on-dark-strong focus:outline-none focus-visible:text-on-dark-strong"
      >
        Pular intro
      </button>
    </motion.div>
  );
};

export default IntroRitualV7;
