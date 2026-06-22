import { motion, animate as motionAnimate, useMotionValue } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { EVALUATION_MODE, useSkipMotion } from './use-motion-gate';
import { lockScroll, unlockScroll } from './lenis-lock';

export const IntroRitualV10 = () => {
  const skipMotion = useSkipMotion();
  const [isVisible, setIsVisible] = useState(true);
  const [videoSrc, setVideoSrc] = useState('');
  const isExiting = useRef(false);
  const blobUrlRef = useRef('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayOpacity = useMotionValue(1);

  const close = () => {
    if (isExiting.current) return;
    isExiting.current = true;
    motionAnimate(overlayOpacity, 0, { duration: 0.8, ease: 'easeInOut' }).then(() => {
      setIsVisible(false);
      unlockScroll();
      if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
    });
  };

  useEffect(() => {
    document.getElementById('v10-intro-cover')?.remove();

    if (skipMotion && !EVALUATION_MODE) {
      setIsVisible(false);
      return;
    }

    lockScroll();

    // Carrega o vídeo completo em memória antes de tocar.
    // Elimina stutter causado por Range Requests no dev server (Vite).
    const controller = new AbortController();
    fetch('/intro-v10.mp4?v=2', { signal: controller.signal })
      .then(r => r.blob())
      .then(blob => {
        const url = URL.createObjectURL(blob);
        blobUrlRef.current = url;
        setVideoSrc(url);
      })
      .catch(() => { if (!isExiting.current) close(); });

    const absoluteFallback = setTimeout(() => {
      if (!isExiting.current) close();
    }, 15000);

    return () => {
      controller.abort();
      clearTimeout(absoluteFallback);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Wire ended listener após blob estar pronto e vídeo montado
  useEffect(() => {
    if (!videoSrc) return;
    const video = videoRef.current;
    if (!video) return;

    const onEnded = () => setTimeout(close, 1000);
    video.addEventListener('ended', onEnded);
    return () => video.removeEventListener('ended', onEnded);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoSrc]);

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
      {videoSrc && (
        <video
          ref={videoRef}
          src={videoSrc}
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
      )}

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
