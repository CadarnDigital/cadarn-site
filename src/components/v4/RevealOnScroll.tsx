import { motion, type HTMLMotionProps } from 'framer-motion';
import { type ElementType, type ReactNode } from 'react';
import { motion as motionTokens } from '../../lib/design-tokens';
import { useSkipMotion } from './use-motion-gate';

interface RevealOnScrollProps {
  children: ReactNode;
  delay?: number;
  as?: ElementType;
  className?: string;
}

/**
 * RevealOnScroll (v4) — wrapper de orquestração fina (Framer Motion whileInView).
 * Anima apenas opacity + y. Usa useSkipMotion(): em modo avaliação roda mesmo
 * com reduced-motion; em produção respeita a preferência.
 */
export const RevealOnScroll = ({
  children,
  delay = 0,
  as = 'div',
  className = '',
}: RevealOnScrollProps) => {
  const skipMotion = useSkipMotion();
  const MotionTag = motion(as as ElementType) as React.ComponentType<HTMLMotionProps<'div'>>;

  if (skipMotion) {
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
