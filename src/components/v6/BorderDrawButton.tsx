import { type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { motion as motionTokens } from '../../lib/design-tokens';
import { useSkipMotion } from './use-motion-gate';

interface BorderDrawButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
}

/**
 * BorderDrawButton (v4) — CTA secundário/ghost com borda caramelo que se
 * "desenha" no hover (motion.rect, pathLength 0 -> 1). Usa useSkipMotion():
 * em modo avaliação anima mesmo com reduced-motion; senão borda estática.
 * strokeDasharray="0 1" evita flicker de borda completa antes da hidratação.
 */
export const BorderDrawButton = ({
  children,
  href,
  onClick,
  className = '',
}: BorderDrawButtonProps) => {
  const skipMotion = useSkipMotion();

  const classes = [
    'group relative inline-flex items-center justify-center',
    'rounded-none px-8 py-4 font-headline text-sm font-semibold uppercase tracking-wider',
    'text-on-dark-strong transition-colors duration-300 hover:text-accent-metal-hi',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const border = (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      <rect
        x="1"
        y="1"
        width="calc(100% - 2px)"
        height="calc(100% - 2px)"
        fill="none"
        stroke="rgba(154, 122, 81, 0.25)"
        strokeWidth="1"
      />
      {skipMotion ? (
        <rect
          x="1"
          y="1"
          width="calc(100% - 2px)"
          height="calc(100% - 2px)"
          fill="none"
          stroke="var(--accent-metal)"
          strokeWidth="1"
        />
      ) : (
        <motion.rect
          x="1"
          y="1"
          width="calc(100% - 2px)"
          height="calc(100% - 2px)"
          fill="none"
          stroke="var(--accent-metal)"
          strokeWidth="1"
          strokeDasharray="0 1"
          variants={{ rest: { pathLength: 0 }, hover: { pathLength: 1 } }}
          transition={{
            duration: motionTokens.duration.slow,
            ease: motionTokens.ease.inOutCinematic,
          }}
        />
      )}
    </svg>
  );

  const inner = <span className="relative z-10 flex items-center gap-2">{children}</span>;

  if (href) {
    return (
      <motion.a href={href} className={classes} initial="rest" whileHover="hover">
        {border}
        {inner}
      </motion.a>
    );
  }

  return (
    <motion.button
      type="button"
      onClick={onClick}
      className={classes}
      initial="rest"
      whileHover="hover"
    >
      {border}
      {inner}
    </motion.button>
  );
};

export default BorderDrawButton;
