import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SPLASH_KEY = 'cadarn_splash_shown';

export const SplashScreenV2 = () => {
  const [visible, setVisible] = useState(() => {
    if (typeof window === 'undefined') return false;
    return !sessionStorage.getItem(SPLASH_KEY);
  });
  const [phase, setPhase] = useState<'intro' | 'reveal'>('intro');
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  // Remove a tela navy estática assim que o React monta
  useEffect(() => {
    const cover = document.getElementById('splash-cover');
    if (cover) cover.remove();
  }, []);

  useEffect(() => {
    if (!visible) return;

    timerRef.current = setTimeout(() => {
      setPhase('reveal');
    }, 3600);

    return () => clearTimeout(timerRef.current);
  }, [visible]);

  useEffect(() => {
    if (phase !== 'reveal') return;

    const timer = setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem(SPLASH_KEY, '1');
      document.documentElement.classList.remove('splash-active');
    }, 1400);

    return () => clearTimeout(timer);
  }, [phase]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="splash"
          className="fixed inset-0 z-[9999] overflow-hidden"
          aria-hidden="true"
          // Degradê de baixo pra cima: translateY para -100%
          animate={
            phase === 'reveal'
              ? { y: '-100%' }
              : { y: '0%' }
          }
          transition={
            phase === 'reveal'
              ? { duration: 1.2, ease: [0.76, 0, 0.24, 1] }
              : {}
          }
        >
          <div className="absolute inset-0 flex items-center justify-center bg-navy">
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
              {/* Logo bússola */}
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

              {/* CADARN MARTECH */}
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

              {/* Marketing · Gestão · Growth */}
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
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
