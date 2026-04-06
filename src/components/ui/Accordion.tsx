import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AccordionItem {
  trigger: string;
  label: string;
  content: string;
  sublabel?: string;
}

interface AccordionProps {
  items: AccordionItem[];
  className?: string;
}

export const Accordion = ({ items, className }: AccordionProps) => {
  const [active, setActive] = useState(0);

  return (
    <div className={`grid grid-cols-1 gap-8 lg:grid-cols-5 lg:gap-12 ${className ?? ''}`}>
      {/* Triggers — coluna esquerda */}
      <div className="lg:col-span-2 space-y-2">
        {items.map((item, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`group flex w-full items-baseline gap-3 py-3 text-left transition-all duration-300 ${
              i === active
                ? 'opacity-100'
                : 'opacity-30 hover:opacity-60'
            }`}
          >
            <span
              className={`font-headline text-4xl font-bold transition-all duration-300 lg:text-5xl ${
                i === active
                  ? i % 2 === 0 ? 'text-caramelo glow-caramelo-text' : 'text-offwhite'
                  : 'text-offwhite/50'
              }`}
            >
              {item.trigger}
            </span>
            <span className="font-body text-sm text-offwhite/60 lg:text-base">
              — {item.label}
            </span>
          </button>
        ))}
      </div>

      {/* Content — coluna direita */}
      <div className="lg:col-span-3 flex items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="w-full"
          >
            <div className="border-l-2 border-caramelo/40 pl-6 lg:pl-8">
              <h3 className="font-headline text-2xl font-bold lg:text-3xl">
                {items[active].label}
              </h3>
              {items[active].sublabel && (
                <p className="mt-1 font-mono text-xs uppercase tracking-wider text-caramelo/70">
                  {items[active].sublabel}
                </p>
              )}
              <p className="mt-4 font-body text-lg leading-relaxed text-offwhite/70">
                {items[active].content}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
