import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { useSkipMotion } from './use-motion-gate';

interface IlluminateTextProps {
  /** Texto integral da citação/manifesto. */
  text: string;
  /** Palavras (lowercase, sem pontuação) que recebem destaque caramelo. */
  highlights?: string[];
  className?: string;
}

/**
 * IlluminateText (v4 — Passo 4.2) — texto que ILUMINA ao rolar.
 * Cada palavra nasce esmaecida (opacity ~0.2) e ilumina para 1 conforme a seção
 * sobe pela viewport. Palavras-chave em caramelo (sempre, com brilho próprio).
 *
 * Estratégia em camadas:
 *  1) CSS `animation-timeline: view()` (classe .text-illuminate--css em v-shared)
 *     quando suportado — zero JS por palavra.
 *  2) Fallback Framer `useScroll` + `useTransform` por palavra quando a API CSS
 *     não existe — cada palavra mapeia seu progresso de scroll para opacity.
 * Só opacity anima. Reduced-motion (produção): tudo visível.
 */
export const IlluminateText = ({ text, highlights = [], className = '' }: IlluminateTextProps) => {
  const skipMotion = useSkipMotion();
  const ref = useRef<HTMLParagraphElement>(null);
  const [cssTimeline, setCssTimeline] = useState(false);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.85', 'start 0.35'],
  });

  useEffect(() => {
    const supported =
      typeof CSS !== 'undefined' &&
      typeof CSS.supports === 'function' &&
      CSS.supports('animation-timeline: view()');
    setCssTimeline(supported && !skipMotion);
  }, [skipMotion]);

  const words = text.split(' ');
  const isHighlight = (raw: string): boolean => {
    const clean = raw.toLowerCase().replace(/[.,;:!?"']/g, '');
    return highlights.includes(clean);
  };

  // Caminho CSS (ou reduced-motion): sem JS por palavra. As palavras herdam a
  // animação CSS via .text-illuminate--css; reduced-motion força opacity 1.
  if (cssTimeline || skipMotion) {
    return (
      <p
        ref={ref}
        className={`text-illuminate ${cssTimeline ? 'text-illuminate--css' : ''} ${className}`}
      >
        {words.map((word, i) => (
          <span
            key={i}
            className={`text-illuminate-word ${isHighlight(word) ? 'text-accent-metal-hi' : ''}`}
            style={{ opacity: skipMotion ? 1 : undefined }}
          >
            {word}{' '}
          </span>
        ))}
      </p>
    );
  }

  // Fallback Framer: cada palavra ilumina em sequência conforme o scroll avança.
  return (
    <p ref={ref} className={`text-illuminate ${className}`}>
      {words.map((word, i) => (
        <IlluminateWord
          key={i}
          word={word}
          index={i}
          total={words.length}
          progress={scrollYProgress}
          highlight={isHighlight(word)}
        />
      ))}
    </p>
  );
};

interface IlluminateWordProps {
  word: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
  highlight: boolean;
}

const IlluminateWord = ({ word, index, total, progress, highlight }: IlluminateWordProps) => {
  // Janela de iluminação escalonada por palavra ao longo do progresso 0->1.
  const start = (index / total) * 0.8;
  const end = start + 0.25;
  const opacity = useTransform(progress, [start, end], [0.2, 1]);

  return (
    <motion.span
      className={highlight ? 'text-accent-metal-hi' : ''}
      style={{ opacity }}
    >
      {word}{' '}
    </motion.span>
  );
};

export default IlluminateText;
