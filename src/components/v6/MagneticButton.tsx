import { useRef, type ReactNode, type MouseEvent } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useSkipMotion } from './use-motion-gate';

interface MagneticButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  /** Intensidade do deslocamento magnético em px (raio máximo). */
  strength?: number;
}

/**
 * MagneticButton (v4) — botão caramelo metálico sobre dark que segue o cursor.
 * Movimento por-frame via useMotionValue + useTransform (NUNCA useState).
 * Usa useSkipMotion(): em modo avaliação roda mesmo com reduced-motion.
 * Magnetismo só em pointer:fine (cursor real).
 */
export const MagneticButton = ({
  children,
  href,
  onClick,
  className = '',
  strength = 10,
}: MagneticButtonProps) => {
  const ref = useRef<HTMLAnchorElement & HTMLButtonElement>(null);
  const skipMotion = useSkipMotion();

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 170, damping: 22, mass: 0.5 });
  const y = useSpring(my, { stiffness: 170, damping: 22, mass: 0.5 });
  const contentX = useTransform(x, (v) => v * 0.35);
  const contentY = useTransform(y, (v) => v * 0.35);

  const isFinePointer = (): boolean =>
    typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches;

  const handleMove = (e: MouseEvent): void => {
    if (skipMotion || !isFinePointer() || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    const clamp = (n: number): number => Math.max(-strength, Math.min(strength, n * 0.3));
    mx.set(clamp(relX));
    my.set(clamp(relY));
  };

  const handleLeave = (): void => {
    mx.set(0);
    my.set(0);
  };

  const classes = [
    'group relative inline-flex items-center justify-center overflow-hidden',
    'rounded-none px-8 py-4 font-headline text-base font-semibold uppercase tracking-wider',
    'text-surface-abyss shadow-glow transition-shadow duration-300 hover:shadow-[0_0_56px_rgba(154,122,81,0.5)]',
    'bg-gradient-to-br from-accent-metal-hi to-accent-metal',
    className,
  ].join(' ');

  const inner = (
    <motion.span
      className="relative z-10 flex items-center gap-2"
      style={{ x: contentX, y: contentY }}
    >
      {children}
    </motion.span>
  );

  const motionStyle = { x, y };

  if (href) {
    return (
      <motion.a
        ref={ref}
        href={href}
        className={classes}
        style={motionStyle}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
      >
        {inner}
      </motion.a>
    );
  }

  return (
    <motion.button
      ref={ref}
      type="button"
      onClick={onClick}
      className={classes}
      style={motionStyle}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {inner}
    </motion.button>
  );
};

export default MagneticButton;
