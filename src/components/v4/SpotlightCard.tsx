import { useRef, type ReactNode, type MouseEvent } from 'react';

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
}

/**
 * SpotlightCard (v4) — card com glow caramelo discreto que segue o cursor.
 * onMouseMove seta CSS vars --x/--y direto no DOM via ref.style.setProperty
 * (SEM re-render). O glow vem do pseudo-elemento .spotlight-card::before
 * (v-shared.css), ativo só em pointer:fine. Idêntico à v2/v3 — sem motion
 * gate React porque o gating é puramente CSS (pointer:fine / reduced-motion),
 * e o glow de hover não é central à avaliação cinematográfica.
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
