import { useEffect, useRef, useState } from 'react';
import { motion, animate as motionAnimate, useMotionValue } from 'framer-motion';
import { EVALUATION_MODE, useSkipMotion } from './use-motion-gate';
import { lockScroll, unlockScroll } from './lenis-lock';

/**
 * IntroRitualV8 — ENGRENAGEM QUE CONSTRÓI A LOGO DA CADARN.
 *
 * A logo da Cadarn JÁ É uma bússola (anel dourado + rosa dos ventos + cardinais +
 * monograma CM + alvo leste). Então a engrenagem não constrói uma bússola genérica —
 * ela constrói a própria marca.
 *
 *   0.0s  Tela vinho. Engrenagem SÓLIDA metálica emerge (scale-in) e gira ~2.5 voltas.
 *   2.2s  Dentes/furos retraem. Giro desacelera e trava em 0°. O anel mestre permanece.
 *   2.9s  Anel duplo + rosa dos ventos floresce do centro (8 pontas, staggered).
 *   3.6s  Cardinais N/L/S/O.
 *   4.0s  Monograma C (dourado) + M (navy) monta com spring.
 *   4.4s  Alvo (bullseye) leste pulsa.
 *   4.9s  "Clique para entrar" + respiração idle.
 *   Click  Flecha sobe + overlay rasga (clip-path 0.6s).
 *   7.2s   Auto: fade cinematográfico 1.2s.
 *
 * Fix bug v6: overlay inicia visível (SSR via #v8-intro-cover), sem flash de conteúdo.
 */

// Engrenagem: 10 dentes PROFUNDOS — outer r=106, inner r=78. Centrada em (0,0).
const GEAR_PATH =
  'M0,-106 L24.07,-74.09 L62.28,-85.73 L70.62,-51.32 L100.78,-32.74 ' +
  'L78,0 L100.78,32.74 L70.62,51.32 L62.28,85.73 L24.07,74.09 ' +
  'L0,106 L-24.07,74.09 L-62.28,85.73 L-70.62,51.32 L-100.78,32.74 ' +
  'L-78,0 L-100.78,-32.74 L-70.62,-51.32 L-62.28,-85.73 L-24.07,-74.09 Z';

// 5 furos de parafuso ao redor do hub (raio 50, 72° entre cada).
const BOLT_HOLES = [0, 72, 144, 216, 288].map((deg) => {
  const r = (deg * Math.PI) / 180;
  return { x: Math.sin(r) * 50, y: -Math.cos(r) * 50 };
});

// Rosa dos ventos: 4 pontas longas (N/L/S/O) + 4 curtas (diagonais).
const ROSE_POINTS = [
  { angle: 0, long: true },
  { angle: 45, long: false },
  { angle: 90, long: true },
  { angle: 135, long: false },
  { angle: 180, long: true },
  { angle: 225, long: false },
  { angle: 270, long: true },
  { angle: 315, long: false },
];

const pointGeo = (long: boolean) => {
  const L = long ? 90 : 54;
  const S = long ? 22 : 15;
  const W = long ? 11 : 8;
  return {
    light: `M0,0 L${W},${-S} L0,${-L} Z`,
    dark: `M0,0 L${-W},${-S} L0,${-L} Z`,
  };
};

export const IntroRitualV8 = () => {
  const skipMotion = useSkipMotion();

  const [overlayVisible, setOverlayVisible] = useState(true);
  const [gearVisible, setGearVisible] = useState(true); // dentes/furos/hub da engrenagem
  const [doubleRingVisible, setDoubleRingVisible] = useState(false);
  const [roseVisible, setRoseVisible] = useState(false);
  const [cardinalsVisible, setCardinalsVisible] = useState(false);
  const [monogramVisible, setMonogramVisible] = useState(false);
  const [targetVisible, setTargetVisible] = useState(false);
  const [promptVisible, setPromptVisible] = useState(false);
  const [arrowDrawing, setArrowDrawing] = useState(false);
  const [exitMode, setExitMode] = useState<'click' | 'auto' | null>(null);

  const hasOpenedRef = useRef(false);
  const gearAudioRef = useRef<HTMLAudioElement | null>(null);
  const arrowAudioRef = useRef<HTMLAudioElement | null>(null);
  const gearUnlockedRef = useRef(false);

  const gearRotation = useMotionValue(0);

  useEffect(() => {
    document.getElementById('v8-intro-cover')?.remove();

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

    // Engrenagem gira ~2.5 voltas em 2.2s, DESACELERANDO (trackável a olho nu).
    const gearCtrl = motionAnimate(gearRotation, 900, {
      duration: 2.2,
      ease: [0.18, 0.62, 0.32, 1],
    });

    // 2.2s → fase logo: dentes/furos retraem, snap do giro para múltiplo de 360 (= 0° visual).
    const tDecel = setTimeout(() => {
      setGearVisible(false);
      gearCtrl.stop();
      const cur = gearRotation.get();
      const rem = cur % 360;
      const target = rem === 0 ? cur : cur + (360 - rem);
      motionAnimate(gearRotation, target, { duration: 0.6, ease: [0.25, 1, 0.5, 1] });
    }, 2200);

    const tRose = setTimeout(() => {
      setDoubleRingVisible(true);
      setRoseVisible(true);
    }, 2900);
    const tCardinals = setTimeout(() => setCardinalsVisible(true), 3600);
    const tMonogram = setTimeout(() => setMonogramVisible(true), 4000);
    const tTarget = setTimeout(() => setTargetVisible(true), 4400);
    const tPrompt = setTimeout(() => setPromptVisible(true), 4900);

    const tAuto = setTimeout(() => {
      if (hasOpenedRef.current) return;
      hasOpenedRef.current = true;
      setExitMode('auto');
      setTimeout(() => {
        setOverlayVisible(false);
        unlockScroll();
      }, 1200);
    }, 7200);

    return () => {
      gearCtrl.stop();
      clearTimeout(tDecel);
      clearTimeout(tRose);
      clearTimeout(tCardinals);
      clearTimeout(tMonogram);
      clearTimeout(tTarget);
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
      {/* ── ENGRENAGEM → LOGO ── */}
      <motion.div
        className="relative h-72 w-72 sm:h-80 sm:w-80"
        animate={promptVisible ? { scale: [1, 1.018, 1] } : { scale: 1 }}
        transition={promptVisible ? { duration: 3.2, ease: 'easeInOut', repeat: Infinity } : {}}
      >
        <svg viewBox="0 0 280 280" className="absolute inset-0 h-full w-full" fill="none">
          <defs>
            {/* Metal escovado — dá volume à engrenagem */}
            <radialGradient id="v8-metal" cx="0.36" cy="0.30" r="0.85">
              <stop offset="0%" stopColor="#e0bb80" />
              <stop offset="50%" stopColor="#b89766" />
              <stop offset="100%" stopColor="#6b4f30" />
            </radialGradient>
          </defs>

          <g transform="translate(140,140)">

            {/* ─ GRUPO QUE GIRA ─ */}
            <motion.g style={{ rotate: gearRotation }}>

              {/* Corpo da engrenagem (dentes + furos) — VISÍVEL no SSR (sem initial:0),
                  retrai por opacity quando vira logo. Não depende de animação de entrada. */}
              <motion.g
                animate={{ opacity: gearVisible ? 1 : 0, scale: gearVisible ? 1 : 1.06 }}
                transition={{ duration: 0.55, ease: 'easeOut' }}
              >
                {/* Dentes sólidos metálicos */}
                <path
                  d={GEAR_PATH}
                  fill="url(#v8-metal)"
                  stroke="var(--accent-metal-hi)"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
                {/* Disco interno recortado (cor do fundo) — cria o aro dentado */}
                <circle r="62" fill="#5e0f0b" />
                {/* Furos de parafuso */}
                {BOLT_HOLES.map((h, i) => (
                  <circle key={i} cx={h.x} cy={h.y} r="6.5" fill="#5e0f0b" stroke="var(--accent-metal)" strokeWidth="1.5" />
                ))}
                {/* Hub central */}
                <circle r="22" fill="url(#v8-metal)" stroke="var(--accent-metal-hi)" strokeWidth="1.5" />
                <circle r="9" fill="#5e0f0b" stroke="var(--accent-metal)" strokeWidth="1" />
              </motion.g>

              {/* Anel mestre — vira o anel externo da logo (permanece após a engrenagem retrair) */}
              <circle r="106" stroke="var(--accent-metal)" strokeWidth="1.6" />
            </motion.g>

            {/* ─ ANEL DUPLO (estático) ─ */}
            {doubleRingVisible && (
              <motion.circle
                r="97"
                stroke="var(--accent-metal-hi)"
                strokeWidth="0.9"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 0.9, scale: 1 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              />
            )}

            {/* ─ ROSA DOS VENTOS (floresce do centro, staggered) ─ */}
            {roseVisible && ROSE_POINTS.map((p, i) => {
              const geo = pointGeo(p.long);
              return (
                <g key={p.angle} transform={`rotate(${p.angle})`}>
                  <motion.g
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.55, delay: i * 0.07, ease: [0.34, 1.4, 0.64, 1] }}
                  >
                    <path d={geo.dark} fill="#6b4f30" />
                    <path d={geo.light} fill="var(--accent-metal-hi)" />
                  </motion.g>
                </g>
              );
            })}

            {/* ─ CARDINAIS N / L / S / O ─ */}
            {cardinalsVisible && (
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                fontFamily="Georgia, serif"
                fontWeight="700"
                fontSize="11"
                letterSpacing="0.5"
              >
                <text x="0" y="-112" textAnchor="middle" fill="var(--on-dark-strong)">N</text>
                <text x="0" y="126" textAnchor="middle" fill="var(--accent-metal)">S</text>
                <text x="118" y="4" textAnchor="middle" fill="var(--accent-metal)">L</text>
                <text x="-118" y="4" textAnchor="middle" fill="var(--accent-metal)">O</text>
              </motion.g>
            )}

            {/* ─ MONOGRAMA CM ─ */}
            {monogramVisible && (
              <motion.g
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 140, damping: 16 }}
                fontFamily="Georgia, serif"
                fontWeight="700"
                textAnchor="middle"
              >
                {/* C — dourado (vinho real some no fundo vinho) */}
                <text x="-18" y="34" fontSize="104" fill="none" stroke="var(--accent-metal-hi)" strokeWidth="2.5">C</text>
                {/* M — navy com borda dourada */}
                <text x="14" y="30" fontSize="88" fill="var(--surface-navy)" stroke="var(--accent-metal)" strokeWidth="1.5">M</text>
              </motion.g>
            )}

            {/* ─ ALVO (bullseye) leste ─ */}
            {targetVisible && (
              <motion.g
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 180, damping: 14 }}
                transform="translate(124,0)"
              >
                <circle r="11" stroke="var(--accent-metal)" strokeWidth="1.4" />
                <circle r="6.5" stroke="var(--accent-metal-hi)" strokeWidth="1" />
                <circle r="2.5" fill="var(--surface-navy)" />
              </motion.g>
            )}
          </g>
        </svg>
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

export default IntroRitualV8;
