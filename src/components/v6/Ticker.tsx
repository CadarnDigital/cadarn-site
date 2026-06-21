import { useRef } from 'react';
import { motion, useAnimationFrame, useMotionValue, useMotionTemplate } from 'framer-motion';
import { useSkipMotion } from './use-motion-gate';
import { getScrollVelocity } from './scroll-velocity';

interface TickerProps {
  /** Itens da faixa. Repetidos em 2 grupos para o loop contínuo. */
  items?: string[];
}

/**
 * Ticker (v6 — item 4: marquee SCROLL-REACTIVE).
 *
 * ELEVAÇÃO v6 vs v5: na v5 o ticker era CSS puro (translateX em loop fixo de
 * 28s). Na v6 a faixa é dirigida por-frame (useAnimationFrame + useMotionValue):
 * velocidade BASE (~32s/volta) + BOOST proporcional à velocidade do scroll lida
 * do Lenis (scroll-velocity). Ao rolar, a faixa acelera levemente — "reage a mim".
 * [fonte: anatomia-navegacao-instituto-futuros-cadarn]
 *
 * Loop perfeito: dois grupos idênticos lado a lado; o offset envolve em [-50%,0]
 * (translateX -50% = exatamente um grupo). Só transform (x %) anima;
 * useMotionValue evita re-render por-frame.
 * Reduced-motion (sem modo avaliação): faixa estática.
 */

const DEFAULT_ITEMS = ['CADARN', 'ENGENHARIA DE LUCRO', 'MARKETING', 'GESTÃO', 'GROWTH'];

/** Velocidade base em % por segundo. -100% (=2 grupos) em ~64s => -50% em ~32s. */
const BASE_PCT_PER_SEC = -100 / 64;
/** Quanto a velocidade do scroll empurra a faixa (ganho). */
const SCROLL_BOOST = 0.06;

/** Envolve um valor no intervalo [-50, 0] para loop contínuo de 2 grupos. */
const wrapHalf = (v: number): number => {
  const range = 50;
  return ((v % range) + range) % range - range;
};

export const Ticker = ({ items = DEFAULT_ITEMS }: TickerProps) => {
  const skipMotion = useSkipMotion();
  const xPct = useMotionValue(0);
  const transform = useMotionTemplate`translateX(${xPct}%)`;
  const lastTime = useRef<number | null>(null);

  // Repete o conjunto algumas vezes dentro de cada grupo para preencher telas largas.
  const group = [...items, ...items, ...items];

  useAnimationFrame((time) => {
    if (skipMotion) return;
    const prev = lastTime.current;
    lastTime.current = time;
    if (prev === null) return;
    const deltaSec = (time - prev) / 1000;
    const boost = getScrollVelocity() * SCROLL_BOOST;
    const next = xPct.get() + (BASE_PCT_PER_SEC - boost) * deltaSec;
    xPct.set(wrapHalf(next));
  });

  const Item = ({ label }: { label: string }) => (
    <span className="flex items-center">
      <span className="px-6 font-headline text-sm uppercase tracking-[0.25em] text-on-dark-strong">
        {label}
      </span>
      <span className="text-accent-metal">·</span>
    </span>
  );

  return (
    <div
      className="v-ticker border-y border-accent-metal/15 bg-surface-abyss py-4"
      aria-hidden="true"
    >
      <motion.div className="flex w-max" style={skipMotion ? undefined : { transform }}>
        {[0, 1].map((groupIndex) => (
          <div className="flex shrink-0 items-center" key={groupIndex}>
            {group.map((item, i) => (
              <Item key={`${groupIndex}-${i}`} label={item} />
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default Ticker;
