import { motion, useReducedMotion, type HTMLMotionProps } from 'framer-motion';
import { type ElementType, type ReactNode } from 'react';
import { motion as motionTokens } from '../../lib/design-tokens';

interface RevealOnScrollProps {
  children: ReactNode;
  delay?: number;
  as?: ElementType;
  className?: string;
}

/**
 * RevealOnScroll — wrapper de orquestração fina (Framer Motion whileInView).
 * Para a maioria das seções, prefira a classe CSS `.reveal-on-scroll` (zero JS);
 * use este componente só nos 2-3 momentos que pedem stagger/delay controlado.
 * Anima apenas opacity + y. Respeita prefers-reduced-motion.
 */
export const RevealOnScroll = ({
  children,
  delay = 0,
  as = 'div',
  className = '',
}: RevealOnScrollProps) => {
  const prefersReduced = useReducedMotion();
  const MotionTag = motion(as as ElementType) as React.ComponentType<HTMLMotionProps<'div'>>;

  if (prefersReduced) {
    const StaticTag = as;
    return <StaticTag className={className}>{children}</StaticTag>;
  }

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{
        duration: motionTokens.duration.slow,
        ease: motionTokens.ease.outExpo,
        delay,
      }}
    >
      {children}
    </MotionTag>
  );
};

export default RevealOnScroll;
