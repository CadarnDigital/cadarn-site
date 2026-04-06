import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SPLASH_KEY = 'cadarn_splash_shown';
// Logo 1s + nome 0.6s + linha 0.4s + 3 palavras (0.15 gap) + 0.5s respiro + fade 0.8s
const SPLASH_DURATION = 3800;
const FADE_OUT_DURATION = 800;

export const SplashScreen = () => {
  const [visible, setVisible] = useState(() => {
    if (typeof window === 'undefined') return false;
    return !sessionStorage.getItem(SPLASH_KEY);
  });

  useEffect(() => {
    if (!visible) return;

    const timer = setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem(SPLASH_KEY, '1');
    }, SPLASH_DURATION);

    return () => clearTimeout(timer);
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: FADE_OUT_DURATION / 1000, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-navy"
          aria-hidden="true"
        >
          {/* Grid tech de fundo */}
          <div className="absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(154,122,81,0.4) 1px, transparent 1px),
                linear-gradient(90deg, rgba(154,122,81,0.4) 1px, transparent 1px)
              `,
              backgroundSize: '60px 60px',
            }}
          />

          {/* Scan line horizontal */}
          <motion.div
            className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-caramelo/60 to-transparent"
            initial={{ top: '-2%' }}
            animate={{ top: '102%' }}
            transition={{ duration: 2.4, ease: 'linear', repeat: 1 }}
          />

          {/* Conteúdo central */}
          <div className="relative z-10 flex flex-col items-center">
            {/* Logo bússola (sem texto) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.7, filter: 'blur(8px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <img
                src="/logo-splash.png"
                alt="Cadarn Martech"
                className="h-[280px] w-[280px] object-contain sm:h-[360px] sm:w-[360px] lg:h-[440px] lg:w-[440px]"
              />
            </motion.div>

            {/* CADARN MARTECH — nome na cor da logo, serif estilizado */}
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.4, ease: [0.22, 1, 0.36, 1] }}
              className="-mt-2 text-xl uppercase tracking-[0.35em] text-caramelo sm:text-2xl lg:text-3xl"
              style={{ fontFamily: 'Georgia, "Canela", "Times New Roman", serif', fontWeight: 500 }}
            >
              Cadarn Martech
            </motion.h1>

            {/* Linha tech com glow */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.4, delay: 2.1, ease: 'easeOut' }}
              className="mt-3 h-px w-40 origin-center sm:w-56 lg:w-72"
              style={{
                background: 'linear-gradient(90deg, transparent, #9a7a51, transparent)',
                boxShadow: '0 0 12px rgba(154,122,81,0.4)',
              }}
            />

            {/* Marketing · Gestão · Growth — rápido, sequencial */}
            <motion.div className="mt-3 flex gap-2">
              {['Marketing', 'Gestão', 'Growth'].map((word, i) => (
                <motion.span
                  key={word}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.6 + i * 0.15, duration: 0.25 }}
                  className="font-body text-base uppercase tracking-[0.2em] text-caramelo/70 sm:text-lg lg:text-xl"
                >
                  {i > 0 && <span className="mr-2 text-caramelo/30">·</span>}
                  {word}
                </motion.span>
              ))}
            </motion.div>
          </div>

          {/* Partículas nos cantos */}
          {[
            { pos: 'top-6 left-6', delay: 0.5 },
            { pos: 'top-6 right-6', delay: 0.7 },
            { pos: 'bottom-6 left-6', delay: 0.9 },
            { pos: 'bottom-6 right-6', delay: 1.1 },
          ].map(({ pos, delay }) => (
            <motion.div
              key={pos}
              className={`absolute ${pos} h-1 w-1 bg-caramelo/30`}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay, duration: 0.4 }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
