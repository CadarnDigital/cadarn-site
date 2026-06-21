import { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { useSkipMotion } from './use-motion-gate';

interface IlluminateTextProps {
  /** Texto integral da citação/manifesto. */
  text: string;
  /** Palavras (lowercase, sem pontuação) que recebem destaque caramelo aceso. */
  highlights?: string[];
  className?: string;
}

/**
 * IlluminateText (v6 — item 1, EFEITO-ASSINATURA, prioridade máxima): texto que
 * ILUMINA ao rolar, PALAVRA A PALAVRA. "Ao subir é top."
 *
 * ELEVAÇÃO v6 vs v5: na v5 cada palavra só interpolava opacity 0.2->1. Na v6:
 *  - opacity parte de ~0.15 (mais apagado, contraste maior do "acender").
 *  - a COR migra de caramelo apagado (#9a7a5155) -> offwhite pleno (#f1e4d3),
 *    palavra a palavra, conforme sobe pela viewport (scroll-linked, não autoplay).
 *  - janelas por palavra escalonadas e levemente sobrepostas: a luz "varre" o
 *    texto em sequência, não tudo de uma vez.
 * [fonte: anatomia-navegacao-instituto-futuros-cadarn]
 *
 * Estratégia em camadas:
 *  1) CSS `animation-timeline: view()` (classe .v6-illuminate--css em v-shared)
 *     quando suportado — zero JS por palavra, melhor performance.
 *  2) Fallback Framer `useScroll` + `useTransform` por palavra quando a API CSS
 *     não existe — cada palavra mapeia seu progresso de scroll para opacity+cor.
 * Só opacity/color anima. Reduced-motion (produção): tudo aceso.
 */
const CARAMELO_DIM = '#9a7a5155';
const OFFWHITE_FULL = '#f1e4d3';
const CARAMELO_HI = '#b89766';

export const IlluminateText = ({ text, highlights = [], className = '' }: IlluminateTextProps) => {
  const skipMotion = useSkipMotion();
  const ref = useRef<HTMLParagraphElement>(null);
  const [cssTimeline, setCssTimeline] = useState(false);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.85', 'start 0.3'],
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
  // animação CSS via .v6-illuminate--css; reduced-motion força estado aceso.
  if (cssTimeline || skipMotion) {
    return (
      <p
        ref={ref}
        className={`v6-illuminate ${cssTimeline ? 'v6-illuminate--css' : ''} ${className}`}
      >
        {words.map((word, i) => (
          <span
            key={i}
            className={`v6-illuminate-word ${isHighlight(word) ? 'v6-illuminate-word--hl' : ''}`}
          >
            {word}{' '}
          </span>
        ))}
      </p>
    );
  }

  // Fallback Framer: cada palavra ilumina em sequência conforme o scroll avança.
  return (
    <p ref={ref} className={`v6-illuminate ${className}`}>
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
  // Janela de iluminação escalonada por palavra ao longo do progresso 0->1, com
  // leve sobreposição para a luz "varrer" o texto de forma contínua.
  const start = (index / total) * 0.85;
  const end = Math.min(1, start + 0.22);
  const opacity = useTransform(progress, [start, end], [0.15, 1]);
  const litColor = highlight ? CARAMELO_HI : OFFWHITE_FULL;
  const color = useTransform(progress, [start, end], [CARAMELO_DIM, litColor]);

  return (
    <motion.span style={{ opacity, color }}>
      {word}{' '}
    </motion.span>
  );
};

export default IlluminateText;
