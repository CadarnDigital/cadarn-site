import { motion, animate as motionAnimate, useMotionValue } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { EVALUATION_MODE, useSkipMotion } from './use-motion-gate';
import { lockScroll, unlockScroll } from './lenis-lock';

/**
 * IntroRitualV10 — VÍDEO REAL, SAÍDA AUTOMÁTICA.
 *
 * Vídeo: /intro-v10.mp4 (3.09s, 1080p — engrenagens + bússola + logo Cadarn)
 * Ao terminar: aguarda 1s → fade out → site abre. Sem logo extra, sem CTA.
 */

export const IntroRitualV10 = () => {
  const skipMotion = useSkipMotion();
  const [isVisible, setIsVisible] = useState(true);
  const isExiting = useRef(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayOpacity = useMotionValue(1);

  const close = () => {
    if (isExiting.current) return;
    isExiting.current = true;
    motionAnimate(overlayOpacity, 0, { duration: 0.8, ease: 'easeInOut' }).then(() => {
      setIsVisible(false);
      unlockScroll();
    });
  };

  useEffect(() => {
    document.getElementById('v10-intro-cover')?.remove();

    if (skipMotion && !EVALUATION_MODE) {
      setIsVisible(false);
      return;
    }

    lockScroll();

    const video = videoRef.current;
    if (!video) return;

    // Evento nativo — mais confiável que onEnded do React
    const onEnded = () => setTimeout(close, 1000);
    video.addEventListener('ended', onEnded);

    // Fallback baseado na duração: fecha 1.5s após o fim esperado
    const durationFallback = setTimeout(() => {
      if (!isExiting.current) close();
    }, (video.duration || 3.09) * 1000 + 1500);

    // Fallback absoluto: 12s
    const absoluteFallback = setTimeout(() => {
      if (!isExiting.current) close();
    }, 12000);

    return () => {
      video.removeEventListener('ended', onEnded);
      clearTimeout(durationFallback);
      clearTimeout(absoluteFallback);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isVisible) return null;

  return (
    <motion.div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: '#5e0f0b',
        opacity: overlayOpacity,
        overflow: 'hidden',
      }}
    >
      <video
        ref={videoRef}
        src="/intro-v10.mp4"
        autoPlay
        muted
        playsInline
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          pointerEvents: 'none',
        }}
      />

      <button
        type="button"
        onClick={close}
        style={{
          position: 'absolute',
          bottom: '2rem',
          right: '2rem',
          background: 'none',
          border: 'none',
          color: 'rgba(241,228,211,0.45)',
          fontSize: 11,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          textDecoration: 'underline',
          cursor: 'pointer',
          fontFamily: 'inherit',
          zIndex: 2,
        }}
      >
        Pular intro
      </button>
    </motion.div>
  );
};

export default IntroRitualV10;
