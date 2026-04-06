import { useRef, useEffect, useState } from 'react';
import { useInView } from 'framer-motion';

interface AnimatedCounterProps {
  value: string;
  label: string;
  suffix?: string;
  prefix?: string;
}

export const AnimatedCounter = ({ value, label, suffix = '', prefix = '' }: AnimatedCounterProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const [display, setDisplay] = useState('0');

  const numericValue = parseInt(value.replace(/\D/g, ''), 10);

  useEffect(() => {
    if (!isInView) return;

    const duration = 1200;
    const steps = 30;
    const stepDuration = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(numericValue * eased);
      setDisplay(String(current));

      if (step >= steps) {
        clearInterval(timer);
        setDisplay(String(numericValue));
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [isInView, numericValue]);

  return (
    <div ref={ref} className="text-center">
      <span className="font-headline text-5xl font-bold text-caramelo lg:text-7xl">
        {prefix}{isInView ? display : '0'}{suffix}
      </span>
      <p className="mt-2 font-body text-xs uppercase tracking-widest text-offwhite/50">{label}</p>
    </div>
  );
};
