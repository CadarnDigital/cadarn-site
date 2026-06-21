import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useSkipMotion } from './use-motion-gate';

interface WatermarkParallaxProps {
  /** Texto gigante de fundo (ex.: "CADARN", "MÉTODO", "LUCRO"). */
  text: string;
  /** Alinhamento horizontal do watermark dentro da seção. */
  align?: 'left' | 'center';
  /** Âncora vertical aproximada (top em %) — o parallax oscila em torno disso. */
  topPercent?: number;
  /** Tamanho via clamp (font-size). */
  sizeClass?: string;
  /** Deslocamento vertical total do parallax ao longo da seção (px). */
  driftPx?: number;
}

/**
 * WatermarkParallax (v6 — item 5: watermark tipográfica com PARALLAX).
 *
 * ELEVAÇÃO v6 vs v5: na v5 o watermark "CADARN" era estático (.v-watermark puro
 * CSS). Na v6 ele faz PARALLAX scroll-linked: desliza ao longo da seção (move
 * mais devagar que o scroll = profundidade editorial). Movimento atrelado ao
 * gesto. [fonte: anatomia-navegacao-instituto-futuros-cadarn]
 *
 * useScroll + useTransform (MotionValue, nunca useState por-frame). Só transform
 * (y) anima. Reduced-motion (sem modo avaliação): fica estático.
 *
 * O posicionamento horizontal/vertical é feito por inline style (não por
 * translate Tailwind) porque o transform fica reservado para o parallax `y`.
 */
export const WatermarkParallax = ({
  text,
  align = 'left',
  topPercent = 50,
  sizeClass = 'text-[clamp(7rem,22vw,18rem)]',
  driftPx = -90,
}: WatermarkParallaxProps) => {
  const skipMotion = useSkipMotion();
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  // Parallax centrado em torno da âncora: começa abaixo, termina acima.
  const y = useTransform(scrollYProgress, [0, 1], [-driftPx / 2, driftPx / 2]);

  const horizontal =
    align === 'center'
      ? { left: '50%', marginLeft: '-50vw', width: '100vw', textAlign: 'center' as const }
      : { left: '-0.04em' };

  const baseStyle = {
    position: 'absolute' as const,
    top: `${topPercent}%`,
    ...horizontal,
  };

  const className = `v-watermark v6-watermark font-headline ${sizeClass}`;

  if (skipMotion) {
    return (
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
        <span className={className} style={baseStyle}>
          {text}
        </span>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      <motion.span className={className} style={{ ...baseStyle, y }}>
        {text}
      </motion.span>
    </div>
  );
};

export default WatermarkParallax;
