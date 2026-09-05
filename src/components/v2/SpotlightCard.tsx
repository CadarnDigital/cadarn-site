import { useRef, type ReactNode, type MouseEvent } from 'react';

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
}

/**
 * SpotlightCard — card com glow caramelo discreto que segue o cursor.
 * onMouseMove seta as CSS vars --x/--y direto no DOM via ref.style.setProperty
 * (SEM re-render do React, interação por-frame). O glow em si vem do
 * pseudo-elemento .spotlight-card::before (tokens-v2.css), que só ativa em
 * pointer:fine e desliga em prefers-reduced-motion.
 * Anti-CLS: o card reserva seu espaço normalmente; o glow é overlay absoluto.
 */
export const SpotlightCard = ({ children, className = '' }: SpotlightCardProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = (e: MouseEvent<HTMLDivElement>): void => {
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    node.style.setProperty('--x', `${x}%`);
    node.style.setProperty('--y', `${y}%`);
  };

  const classes = ['spotlight-card', className].filter(Boolean).join(' ');

  return (
    <div ref={ref} className={classes} onMouseMove={handleMove}>
      {children}
    </div>
  );
};

export default SpotlightCard;
