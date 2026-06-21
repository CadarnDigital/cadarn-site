import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, type Variants } from 'framer-motion';
import { motion as motionTokens } from '../../lib/design-tokens';
import { EVALUATION_MODE, useSkipMotion } from './use-motion-gate';
import { lockScroll, unlockScroll } from './lenis-lock';

/**
 * IntroRitual (v5) — RITUAL DE ABERTURA contemplativo (~4.4s) em torno da BÚSSOLA
 * da Cadarn (/logo-splash.png). Substitui o CurtainIntro (cortina lisa e rápida).
 * Referência de anatomia: abertura do Resn (gem giratória contemplativa),
 * traduzida 100% para a paleta Cadarn (VINHO dominante, CARAMELO acento, OFFWHITE).
 *
 * SEQUÊNCIA (6 fases, sobrepostas):
 *   0. Fundo        0–400ms     Tela VINHO (--curtain-color) preenche. Lenis travado.
 *   1. Linhas       400–1600ms  Arcos/marcas da bússola em SVG desenham (pathLength
 *                               0→1, caramelo), stagger ~120ms, easing pesado.
 *   2. Corpo        1300–2800ms Logo fade-in + scale 0.92→1.0. Inicia rotação lenta
 *                               CONTÍNUA: 360° em 24s, linear, repeat infinito.
 *   3. Glow/part.   2200–3600ms Halo caramelo pulsando (drop-shadow mirror ~2.5s) +
 *                               8 partículas offwhite/caramelo em drift lento.
 *   4. Barra        1600–3200ms Linha fina 2px caramelo enchendo via scaleX (origin
 *                               left), com piso mínimo de tempo.
 *   5. Transição    3600–4400ms A bússola NÃO some por cortina: via layoutId
 *                               compartilhado, ela viaja/escala até o slot da
 *                               bússola decorativa do hero. Fundo vinho faz fade-out,
 *                               o hero aparece atrás. Rotação continua. Lenis destrava.
 *
 * Só anima transform/opacity/pathLength/filter(drop-shadow). Anti-CLS: overlay
 * fixed z alto; a headline do hero nasce visível por baixo. Sem WebGL.
 *
 * MODO AVALIAÇÃO (EVALUATION_MODE=true): toca a CADA refresh (sem gating de sessão)
 * e roda MESMO com prefers-reduced-motion, para Fabiano avaliar a experiência.
 * Em produção (EVALUATION_MODE=false), respeitaria reduced-motion e tocaria
 * 1x/sessão (ver blocos comentados).
 */

/** layoutId compartilhado entre a bússola do ritual e a bússola do hero. */
const COMPASS_LAYOUT_ID = 'cadarn-compass';

/** Marcos temporais (ms) — fim de cada janela relevante. */
const T = {
  bg: 400,
  linesStart: 400,
  body: 1300,
  glow: 2200,
  bar: 1600,
  handoff: 3600, // início da transição p/ hero
  done: 4400, // fim total: overlay sai, scroll destrava
} as const;

const EASE_OUT_EXPO = motionTokens.ease.outExpo; // cubic-bezier(0.16,1,0.3,1)
const EASE_HEAVY = motionTokens.ease.inOutCinematic; // [0.65,0,0.35,1] — easing pesado

/** Variants do grupo de linhas SVG (stagger ~120ms entre arcos/marcas). */
const linesGroup: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
};

/** Cada arco/marca desenha o traço de 0→1. */
const linePath: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: { pathLength: { duration: 1.1, ease: EASE_HEAVY }, opacity: { duration: 0.3 } },
  },
};

interface Particle {
  id: number;
  left: string;
  top: string;
  driftX: number;
  driftY: number;
  size: number;
  duration: number;
  delay: number;
  color: string;
}

/** Gera partículas determinísticas (offwhite/caramelo) em drift lento. */
const buildParticles = (): Particle[] => {
  const seeds = [
    { left: '32%', top: '40%', dx: -26, dy: -34, s: 3, d: 6.5, delay: 0 },
    { left: '64%', top: '36%', dx: 30, dy: -28, s: 2, d: 7.2, delay: 0.4 },
    { left: '44%', top: '62%', dx: -18, dy: 32, s: 2.5, d: 6.8, delay: 0.8 },
    { left: '58%', top: '58%', dx: 22, dy: 26, s: 2, d: 7.6, delay: 0.2 },
    { left: '38%', top: '52%', dx: -32, dy: 8, s: 1.5, d: 8.0, delay: 1.0 },
    { left: '62%', top: '48%', dx: 28, dy: -10, s: 2, d: 6.9, delay: 0.6 },
    { left: '48%', top: '34%', dx: 6, dy: -36, s: 1.5, d: 7.4, delay: 1.2 },
    { left: '52%', top: '66%', dx: -8, dy: 34, s: 2.5, d: 6.4, delay: 0.3 },
  ];
  return seeds.map((p, i) => ({
    id: i,
    left: p.left,
    top: p.top,
    driftX: p.dx,
    driftY: p.dy,
    size: p.s,
    duration: p.d,
    delay: p.delay,
    color: i % 2 === 0 ? 'var(--accent-metal)' : 'var(--on-dark-strong)',
  }));
};

/** Fases do ciclo de vida do ritual. */
type Stage = 'ritual' | 'handoff' | 'done';

export const IntroRitual = () => {
  const skipMotion = useSkipMotion();
  const [active, setActive] = useState(false);
  const [stage, setStage] = useState<Stage>('ritual');
  const particles = useMemo(buildParticles, []);

  useEffect(() => {
    if (skipMotion) return;
    if (EVALUATION_MODE) {
      setActive(true);
      lockScroll();
      return;
    }
    // Produção: só na primeira visita da sessão.
    // const alreadyShown = sessionStorage.getItem('cadarn_v5_intro');
    // if (!alreadyShown) {
    //   setActive(true);
    //   lockScroll();
    // }
  }, [skipMotion]);

  useEffect(() => {
    if (!active) return;
    const toHandoff = window.setTimeout(() => setStage('handoff'), T.handoff);
    const toDone = window.setTimeout(() => {
      // Produção: gravar flag de sessão.
      // sessionStorage.setItem('cadarn_v5_intro', '1');
      setStage('done');
      unlockScroll();
    }, T.done);
    return () => {
      window.clearTimeout(toHandoff);
      window.clearTimeout(toDone);
    };
  }, [active]);

  // Se o usuário pular: limpa overlay e destrava o scroll.
  const skip = (): void => {
    setStage('done');
    unlockScroll();
  };

  // Em produção com reduced-motion: nada (bússola estática viria do hero).
  if (skipMotion) return null;
  if (!active) return null;

  const overlayVisible = stage !== 'done';
  // Enquanto 'ritual': bússola CENTRADA e grande, com glow/partículas (elemento
  // herói do ritual). A partir de 'handoff': ela viaja/escala (layoutId) até o
  // slot direito do hero (espelha o HeroV4 original v4) e perde glow/partículas.
  const inRitual = stage === 'ritual';

  return (
    <>
      {/* ── FASE 0 — FUNDO VINHO + overlay do ritual (sai por fade no fim) ── */}
      <AnimatePresence>
        {overlayVisible && (
          <motion.div
            className="fixed inset-0 z-[9990] flex flex-col items-center justify-center overflow-hidden"
            style={{ backgroundColor: 'var(--curtain-color)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              opacity: { duration: stage === 'handoff' ? 0.8 : T.bg / 1000, ease: EASE_OUT_EXPO },
            }}
            role="presentation"
            aria-hidden="true"
          >
            {/* ── FASE 1 — ARCOS/MARCAS DA BÚSSOLA (SVG pathLength) ── */}
            <motion.svg
              className="pointer-events-none absolute h-[260px] w-[260px]"
              viewBox="0 0 200 200"
              fill="none"
              variants={linesGroup}
              initial="hidden"
              animate="visible"
            >
              {/* Anel externo */}
              <motion.circle
                cx="100"
                cy="100"
                r="92"
                stroke="var(--accent-metal)"
                strokeWidth="1"
                strokeDasharray="0 1"
                variants={linePath}
              />
              {/* Anel interno */}
              <motion.circle
                cx="100"
                cy="100"
                r="70"
                stroke="var(--accent-metal)"
                strokeWidth="0.75"
                strokeDasharray="0 1"
                variants={linePath}
              />
              {/* Eixos cardeais N-S / L-O */}
              <motion.path
                d="M100 8 L100 36 M100 164 L100 192"
                stroke="var(--accent-metal)"
                strokeWidth="1.25"
                strokeDasharray="0 1"
                variants={linePath}
              />
              <motion.path
                d="M8 100 L36 100 M164 100 L192 100"
                stroke="var(--accent-metal)"
                strokeWidth="1.25"
                strokeDasharray="0 1"
                variants={linePath}
              />
              {/* Arcos diagonais (marcas intermediárias) */}
              <motion.path
                d="M44 44 A 79 79 0 0 1 156 44"
                stroke="var(--accent-metal)"
                strokeWidth="0.75"
                strokeDasharray="0 1"
                variants={linePath}
              />
              <motion.path
                d="M156 156 A 79 79 0 0 1 44 156"
                stroke="var(--accent-metal)"
                strokeWidth="0.75"
                strokeDasharray="0 1"
                variants={linePath}
              />
            </motion.svg>

            {/* ── FASE 4 — BARRA DE PROGRESSO (caramelo, scaleX origin-left) ── */}
            <div
              className="absolute top-[calc(50%+150px)] h-[2px] w-44 overflow-hidden rounded-full"
              style={{ backgroundColor: 'var(--curtain-track)' }}
            >
              <motion.div
                className="h-full w-full origin-left"
                style={{ backgroundColor: 'var(--curtain-progress)' }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{
                  duration: (T.handoff - T.bar) / 1000,
                  delay: T.bar / 1000,
                  ease: EASE_OUT_EXPO,
                }}
              />
            </div>

            <button
              type="button"
              onClick={skip}
              className="absolute bottom-8 right-8 z-10 font-body text-xs uppercase tracking-widest text-on-dark-muted underline underline-offset-4 transition-colors hover:text-on-dark-strong focus:outline-none focus-visible:text-on-dark-strong"
            >
              Pular intro
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── BÚSSOLA — elemento herói persistente. layoutId compartilhado faz a
           transição (fase 5): do centro do ritual ao slot do hero. A rotação
           contínua vive no <motion.img> interno para nunca resetar no layout. ── */}
      <motion.div
        layoutId={COMPASS_LAYOUT_ID}
        layout
        aria-hidden="true"
        className={
          inRitual
            ? 'pointer-events-none fixed left-1/2 top-1/2 z-[9991] h-48 w-48 -translate-x-1/2 -translate-y-1/2'
            : 'pointer-events-none fixed right-0 top-1/2 z-[1] h-[520px] w-[520px] -translate-y-1/2 translate-x-1/4'
        }
        transition={{ layout: { duration: 0.8, ease: EASE_OUT_EXPO } }}
      >
        {/* ── FASE 3 — HALO CARAMELO pulsando (drop-shadow mirror) ── */}
        <motion.div
          className="relative h-full w-full"
          initial={{ opacity: 0 }}
          animate={{
            opacity: inRitual ? 1 : 0.05,
            filter: [
              'drop-shadow(0 0 18px var(--accent-metal-glow))',
              'drop-shadow(0 0 48px var(--accent-metal-glow))',
            ],
          }}
          transition={{
            opacity: { duration: 0.9, ease: EASE_OUT_EXPO },
            filter: {
              duration: 2.5,
              ease: 'easeInOut',
              repeat: Infinity,
              repeatType: 'mirror',
              delay: T.glow / 1000,
            },
          }}
        >
          {/* ── FASE 2 — CORPO da bússola + ROTAÇÃO CONTÍNUA (360°/24s linear) ── */}
          <motion.img
            src="/logo-splash.png"
            alt=""
            aria-hidden="true"
            className="h-full w-full object-contain"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1, rotate: 360 }}
            transition={{
              opacity: { duration: 1.5, ease: EASE_OUT_EXPO, delay: T.body / 1000 },
              scale: { duration: 1.5, ease: EASE_OUT_EXPO, delay: T.body / 1000 },
              rotate: { duration: 24, ease: 'linear', repeat: Infinity, delay: T.body / 1000 },
            }}
          />
        </motion.div>

        {/* ── FASE 3 — PARTÍCULAS (offwhite/caramelo, drift lento) — só no ritual ── */}
        {inRitual && (
          <div className="pointer-events-none absolute inset-0">
            {particles.map((p) => (
              <motion.span
                key={p.id}
                className="absolute rounded-full"
                style={{
                  left: p.left,
                  top: p.top,
                  width: p.size,
                  height: p.size,
                  backgroundColor: p.color,
                }}
                initial={{ opacity: 0, x: 0, y: 0 }}
                animate={{ opacity: [0, 0.7, 0], x: p.driftX, y: p.driftY }}
                transition={{
                  duration: p.duration,
                  ease: 'easeInOut',
                  repeat: Infinity,
                  delay: T.glow / 1000 + p.delay,
                }}
              />
            ))}
          </div>
        )}
      </motion.div>
    </>
  );
};

export default IntroRitual;
