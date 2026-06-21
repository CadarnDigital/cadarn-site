import { useRef, type ReactNode, type MouseEvent } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from 'framer-motion';

interface MagneticButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  /** Intensidade do deslocamento magnético em px (raio maximo). */
  strength?: number;
}

/**
 * MagneticButton — botao caramelo metalico sobre dark que segue o cursor.
 * Movimento por-frame via useMotionValue + useTransform (NUNCA useState).
 * Desativado em pointer:coarse e em prefers-reduced-motion (vira botao estatico).
 * Compativel com link (href) e acao (onClick).
 */
export const MagneticButton = ({
  children,
  href,
  onClick,
  className = '',
  strength = 10,
}: MagneticButtonProps) => {
  const ref = useRef<HTMLAnchorElement & HTMLButtonElement>(null);
  const prefersReduced = useReducedMotion();

  // Tom sóbrio Hermès: amplitude baixa + damping alto (zero re-render).
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 170, damping: 22, mass: 0.5 });
  const y = useSpring(my, { stiffness: 170, damping: 22, mass: 0.5 });
  const contentX = useTransform(x, (v) => v * 0.35);
  const contentY = useTransform(y, (v) => v * 0.35);

  const isFinePointer = (): boolean =>
    typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches;

  const handleMove = (e: MouseEvent): void => {
    if (prefersReduced || !isFinePointer() || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    // amplitude baixa (~0.3) — atração discreta, nunca exagerada
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
