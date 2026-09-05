import { useEffect, useRef, useState } from 'react';
import { motion, animate as motionAnimate, useMotionValue } from 'framer-motion';
import { EVALUATION_MODE, useSkipMotion } from './use-motion-gate';
import { lockScroll, unlockScroll } from './lenis-lock';

/**
 * IntroRitualV9 — ENGRENAGEM QUE SE TORNA A LOGO REAL DA CADARN.
 *
 * Em vez de reconstruir o logo à mão (v8 ficou tosca), a engrenagem (SVG mecânico)
 * se forma e DISSOLVE cruzando para o asset real /logo-splash.png — a marca em
 * fidelidade total (letras 3D, rosa dos ventos detalhada, alvo, sombreamento).
 *
 *   0.0s  Tela vinho. Engrenagem metálica sólida emerge e gira ~2.5 voltas (desacelera).
 *   2.0s  Engrenagem dissolve (fade + scale). Logo REAL surge no mesmo lugar (fade + scale).
 *         Brilho dourado pulsa no handoff — a peça mecânica "vira" a marca.
 *   3.0s  Logo respira (idle). "Clique para entrar".
 *   Click  Flecha sobe + overlay rasga (clip-path 0.6s).
 *   6.5s   Auto: fade cinematográfico 1.2s.
 *
 * Lição da v8: engrenagem VISÍVEL no SSR (sem initial opacity:0), não depende de
 * animação de entrada para aparecer.
 */

// Engrenagem: 10 dentes profundos — outer r=106, inner r=78. Centrada em (0,0).
const GEAR_PATH =
  'M0,-106 L24.07,-74.09 L62.28,-85.73 L70.62,-51.32 L100.78,-32.74 ' +
  'L78,0 L100.78,32.74 L70.62,51.32 L62.28,85.73 L24.07,74.09 ' +
  'L0,106 L-24.07,74.09 L-62.28,85.73 L-70.62,51.32 L-100.78,32.74 ' +
  'L-78,0 L-100.78,-32.74 L-70.62,-51.32 L-62.28,-85.73 L-24.07,-74.09 Z';

const BOLT_HOLES = [0, 72, 144, 216, 288].map((deg) => {
  const r = (deg * Math.PI) / 180;
  return { x: Math.sin(r) * 50, y: -Math.cos(r) * 50 };
});

export const IntroRitualV9 = () => {
  const skipMotion = useSkipMotion();

  const [overlayVisible, setOverlayVisible] = useState(true);
  const [gearVisible, setGearVisible] = useState(true);
  const [logoVisible, setLogoVisible] = useState(false);
  const [promptVisible, setPromptVisible] = useState(false);
  const [arrowDrawing, setArrowDrawing] = useState(false);
  const [exitMode, setExitMode] = useState<'click' | 'auto' | null>(null);

  const hasOpenedRef = useRef(false);
  const gearAudioRef = useRef<HTMLAudioElement | null>(null);
  const arrowAudioRef = useRef<HTMLAudioElement | null>(null);
  const gearUnlockedRef = useRef(false);

  const gearRotation = useMotionValue(0);

  useEffect(() => {
    document.getElementById('v9-intro-cover')?.remove();

    if (skipMotion && !EVALUATION_MODE) {
      setOverlayVisible(false);
      return;
    }

    lockScroll();

    try {
      gearAudioRef.current = new Audio('/sounds/gear.mp3');
      gearAudioRef.current.volume = 0.35;
      gearAudioRef.current.preload = 'auto';
      arrowAudioRef.current = new Audio('/sounds/arrow.mp3');
      arrowAudioRef.current.volume = 0.55;
      arrowAudioRef.current.preload = 'auto';
    } catch {
      // Audio indisponível — segue sem som.
    }

    // Engrenagem gira ~2.5 voltas em 2.0s, desacelerando (trackável a olho nu).
    motionAnimate(gearRotation, 900, { duration: 2.0, ease: [0.18, 0.62, 0.32, 1] });

    // 2.0s → handoff: engrenagem dissolve, logo real surge.
    const tHandoff = setTimeout(() => {
      setGearVisible(false);
      setLogoVisible(true);
    }, 2000);

    // 3.0s → prompt + respiração.
    const tPrompt = setTimeout(() => setPromptVisible(true), 3000);

    // 6.5s → abertura automática (fade 1.2s).
    const tAuto = setTimeout(() => {
      if (hasOpenedRef.current) return;
      hasOpenedRef.current = true;
      setExitMode('auto');
      setTimeout(() => {
        setOverlayVisible(false);
        unlockScroll();
      }, 1200);
    }, 6500);

    return () => {
      clearTimeout(tHandoff);
      clearTimeout(tPrompt);
      clearTimeout(tAuto);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleHover = () => {
    if (gearUnlockedRef.current || !gearAudioRef.current) return;
    gearAudioRef.current.play().then(() => { gearUnlockedRef.current = true; }).catch(() => {});
  };

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
      {/* ── PALCO (engrenagem + logo no mesmo box) ── */}
      <motion.div
        className="relative h-72 w-72 sm:h-80 sm:w-80"
        animate={promptVisible ? { scale: [1, 1.02, 1] } : { scale: 1 }}
        transition={promptVisible ? { duration: 3.2, ease: 'easeInOut', repeat: Infinity } : {}}
      >
        {/* Brilho dourado de fundo — pulsa no handoff */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(184,151,102,0.35) 0%, rgba(184,151,102,0) 65%)' }}
          animate={{ opacity: logoVisible ? [0, 0.9, 0.5] : 0, scale: logoVisible ? [0.7, 1.15, 1] : 0.7 }}
          transition={{ duration: 1.0, ease: 'easeOut' }}
        />

        {/* ── ENGRENAGEM (SVG mecânico) — visível no SSR, dissolve no handoff ── */}
        <motion.svg
          viewBox="0 0 280 280"
          className="absolute inset-0 h-full w-full"
          fill="none"
          animate={{ opacity: gearVisible ? 1 : 0, scale: gearVisible ? 1 : 1.12 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        >
          <defs>
            <radialGradient id="v9-metal" cx="0.36" cy="0.30" r="0.85">
              <stop offset="0%" stopColor="#e0bb80" />
              <stop offset="50%" stopColor="#b89766" />
              <stop offset="100%" stopColor="#6b4f30" />
            </radialGradient>
          </defs>
          <g transform="translate(140,140)">
            <motion.g style={{ rotate: gearRotation }}>
              <path
                d={GEAR_PATH}
                fill="url(#v9-metal)"
                stroke="var(--accent-metal-hi)"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <circle r="62" fill="#5e0f0b" />
              {BOLT_HOLES.map((h, i) => (
                <circle key={i} cx={h.x} cy={h.y} r="6.5" fill="#5e0f0b" stroke="var(--accent-metal)" strokeWidth="1.5" />
              ))}
              <circle r="22" fill="url(#v9-metal)" stroke="var(--accent-metal-hi)" strokeWidth="1.5" />
              <circle r="9" fill="#5e0f0b" stroke="var(--accent-metal)" strokeWidth="1" />
            </motion.g>
          </g>
        </motion.svg>

        {/* ── LOGO REAL (asset transparente) — surge no handoff ── */}
        <motion.img
          src="/logo-splash.png"
          alt="Cadarn Martech"
          className="absolute inset-0 h-full w-full object-contain"
          draggable={false}
          initial={false}
          animate={{ opacity: logoVisible ? 1 : 0, scale: logoVisible ? 1 : 0.82 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        />
      </motion.div>

      {/* ── PROMPT "CLIQUE PARA ENTRAR" ── */}
      {promptVisible && (
        <motion.div
          className="mt-8 flex flex-col items-center gap-2"
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
            stroke="var(--accent-metal-hi)"
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

export default IntroRitualV9;
