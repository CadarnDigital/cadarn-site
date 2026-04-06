import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';

interface TextRevealProps {
  lines: Array<{ text: string; accent?: boolean }>;
  className?: string;
}

export const TextReveal = ({ lines, className }: TextRevealProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    let i = 0;
    const timer = setInterval(() => {
      i++;
      setVisibleCount(i);
      if (i >= lines.length) clearInterval(timer);
    }, 800);

    return () => clearInterval(timer);
  }, [isInView, lines.length]);

  return (
    <div ref={ref} className={className}>
      {lines.map((line, i) => (
        <motion.p
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={i < visibleCount ? { opacity: 1, y: 0 } : {}}
          transition={{
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1],
          }}
          className={`${
            line.accent
              ? 'font-headline text-2xl font-bold text-caramelo sm:text-3xl lg:text-4xl'
              : 'font-headline text-2xl font-bold text-offwhite/90 sm:text-3xl lg:text-4xl'
          } ${i === visibleCount - 1 ? 'typing-cursor' : ''}`}
        >
          {line.text}
        </motion.p>
      ))}
    </div>
  );
};
