import { useState, useEffect, useRef, CSSProperties } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Splash — Tela de abertura premium configurável.
 *
 * Componente standalone, zero dependências de design system do projeto.
 * Usa inline styles pra funcionar em qualquer stack (Astro, Next, Vite, CRA).
 *
 * Dependências: react 18+, framer-motion 11+
 *
 * Como usar:
 * ```tsx
 * <Splash
 *   logo="/logo-cliente.png"
 *   brandName="Nome do Cliente"
 *   taglines={["Serviço 1", "Serviço 2", "Serviço 3"]}
 *   backgroundColor="#0e2a4a"
 *   accentColor="#9a7a51"
 *   textColor="#f1e4d3"
 *   storageKey="cliente_splash_shown"
 * />
 * ```
 */

export interface SplashProps {
  /** Caminho do logo (ex: /logo-cliente.png) */
  logo: string;
  /** Alt text do logo (default: brandName) */
  logoAlt?: string;
  /** Nome da marca exibido abaixo do logo */
  brandName: string;
  /** Taglines exibidas palavra por palavra (ex: ["Marketing", "Gestão", "Growth"]) */
  taglines?: string[];

  /** Cor de fundo (qualquer valor CSS válido) */
  backgroundColor?: string;
  /** Cor de destaque (grid, linhas, tagline) */
  accentColor?: string;
  /** Cor do texto principal */
  textColor?: string;

  /** CSS font-family para o nome da marca */
  headlineFont?: string;
  /** CSS font-family para as taglines */
  taglineFont?: string;

  /** Chave do sessionStorage (use algo único por projeto) */
  storageKey?: string;
  /** Mostrar só uma vez por sessão (default: true) */
  showOncePerSession?: boolean;

  /** Duração da fase intro em ms (default: 1300) */
  introDuration?: number;
  /** Duração da fase reveal em ms (default: 700) */
  revealDuration?: number;

  /** Tamanho do logo em pixels */
  logoSize?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };

  /** Mostrar grid técnico de fundo (default: true) */
  showGrid?: boolean;
  /** Mostrar scan line animada (default: true) */
  showScanLine?: boolean;
  /** Mostrar partículas nos cantos (default: true) */
  showCornerParticles?: boolean;
  /** Mostrar linha divisória com glow (default: true) */
  showDivider?: boolean;

  /** Callback executado quando a splash termina */
  onComplete?: () => void;
}

export const Splash = ({
  logo,
  logoAlt,
  brandName,
  taglines = [],
  backgroundColor = '#0e2a4a',
  accentColor = '#9a7a51',
  textColor = '#f1e4d3',
  headlineFont = 'Georgia, "Times New Roman", serif',
  taglineFont = 'Inter, system-ui, sans-serif',
  storageKey = 'splash_shown',
  showOncePerSession = true,
  introDuration = 1300,
  revealDuration = 700,
  logoSize = { mobile: 280, tablet: 360, desktop: 440 },
  showGrid = true,
  showScanLine = true,
  showCornerParticles = true,
  showDivider = true,
  onComplete,
}: SplashProps) => {
  const [visible, setVisible] = useState(() => {
    if (typeof window === 'undefined') return false;
    if (!showOncePerSession) return true;
    return !sessionStorage.getItem(storageKey);
  });
  const [phase, setPhase] = useState<'intro' | 'reveal'>('intro');
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  // Remove cover anti-flash se existir (compatibilidade com setup que usa cover CSS puro)
  useEffect(() => {
    const cover = document.getElementById('splash-cover');
    if (cover) cover.remove();
  }, []);

  useEffect(() => {
    if (!visible) return;
    timerRef.current = setTimeout(() => {
      setPhase('reveal');
    }, introDuration);
    return () => clearTimeout(timerRef.current);
  }, [visible, introDuration]);

  useEffect(() => {
    if (phase !== 'reveal') return;
    const timer = setTimeout(() => {
      setVisible(false);
      if (showOncePerSession) {
        sessionStorage.setItem(storageKey, '1');
      }
      onComplete?.();
    }, revealDuration);
    return () => clearTimeout(timer);
  }, [phase, revealDuration, showOncePerSession, storageKey, onComplete]);

  // Converte hex para rgba pra usar nos gradientes e efeitos
  const accentRgba = (alpha: number) => hexToRgba(accentColor, alpha);

  // Estilos inline (não dependem de Tailwind)
  const wrapperStyle: CSSProperties = {
    position: 'fixed',
    inset: 0,
    zIndex: 9999,
    overflow: 'hidden',
  };

  const innerStyle: CSSProperties = {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor,
  };

  const gridStyle: CSSProperties = {
    position: 'absolute',
    inset: 0,
    opacity: 0.06,
    backgroundImage: `
      linear-gradient(${accentRgba(0.4)} 1px, transparent 1px),
      linear-gradient(90deg, ${accentRgba(0.4)} 1px, transparent 1px)
    `,
    backgroundSize: '60px 60px',
  };

  const scanLineStyle: CSSProperties = {
    position: 'absolute',
    left: 0,
    right: 0,
    height: '1px',
    background: `linear-gradient(90deg, transparent, ${accentRgba(0.6)}, transparent)`,
  };

  const contentStyle: CSSProperties = {
    position: 'relative',
    zIndex: 10,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };

  const logoStyle: CSSProperties = {
    height: `${logoSize.mobile}px`,
    width: `${logoSize.mobile}px`,
    objectFit: 'contain',
  };

  const brandNameStyle: CSSProperties = {
    marginTop: '-0.5rem',
    fontSize: '1.25rem',
    textTransform: 'uppercase',
    letterSpacing: '0.35em',
    color: accentColor,
    fontFamily: headlineFont,
    fontWeight: 500,
  };

  const dividerStyle: CSSProperties = {
    marginTop: '0.75rem',
    height: '1px',
    width: '10rem',
    transformOrigin: 'center',
    background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
    boxShadow: `0 0 12px ${accentRgba(0.4)}`,
  };

  const taglinesContainerStyle: CSSProperties = {
    marginTop: '0.75rem',
    display: 'flex',
    gap: '0.5rem',
  };

  const taglineStyle: CSSProperties = {
    fontFamily: taglineFont,
    fontSize: '1rem',
    textTransform: 'uppercase',
    letterSpacing: '0.2em',
    color: accentRgba(0.7),
  };

  const separatorStyle: CSSProperties = {
    marginRight: '0.5rem',
    color: accentRgba(0.3),
  };

  const particleBaseStyle: CSSProperties = {
    position: 'absolute',
    height: '4px',
    width: '4px',
    backgroundColor: accentRgba(0.3),
  };

  // Responsive logo via media queries em <style>
  const responsiveCss = `
    @media (min-width: 640px) {
      .splash-logo { height: ${logoSize.tablet}px !important; width: ${logoSize.tablet}px !important; }
      .splash-brand { font-size: 1.5rem !important; }
      .splash-divider { width: 14rem !important; }
      .splash-tagline { font-size: 1.125rem !important; }
    }
    @media (min-width: 1024px) {
      .splash-logo { height: ${logoSize.desktop}px !important; width: ${logoSize.desktop}px !important; }
      .splash-brand { font-size: 1.875rem !important; }
      .splash-divider { width: 18rem !important; }
      .splash-tagline { font-size: 1.25rem !important; }
    }
  `;

  return (
    <AnimatePresence>
      {visible && (
        <>
          <style>{responsiveCss}</style>
          <motion.div
            key="splash"
            style={wrapperStyle}
            aria-hidden="true"
            animate={phase === 'reveal' ? { y: '-100%' } : { y: '0%' }}
            transition={
              phase === 'reveal'
                ? { duration: revealDuration / 1000, ease: [0.76, 0, 0.24, 1] }
                : {}
            }
          >
            <div style={innerStyle}>
              {showGrid && <div style={gridStyle} />}

              {showScanLine && (
                <motion.div
                  style={scanLineStyle}
                  initial={{ top: '-2%' }}
                  animate={{ top: '102%' }}
                  transition={{ duration: 1.0, ease: 'linear' }}
                />
              )}

              <div style={contentStyle}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.7, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                >
                  <img
                    src={logo}
                    alt={logoAlt ?? brandName}
                    className="splash-logo"
                    style={logoStyle}
                  />
                </motion.div>

                <motion.h1
                  className="splash-brand"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  style={brandNameStyle}
                >
                  {brandName}
                </motion.h1>

                {showDivider && (
                  <motion.div
                    className="splash-divider"
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={{ scaleX: 1, opacity: 1 }}
                    transition={{ duration: 0.2, delay: 0.7, ease: 'easeOut' }}
                    style={dividerStyle}
                  />
                )}

                {taglines.length > 0 && (
                  <div style={taglinesContainerStyle}>
                    {taglines.map((word, i) => (
                      <motion.span
                        key={word}
                        className="splash-tagline"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.85 + i * 0.08, duration: 0.15 }}
                        style={taglineStyle}
                      >
                        {i > 0 && <span style={separatorStyle}>·</span>}
                        {word}
                      </motion.span>
                    ))}
                  </div>
                )}
              </div>

              {showCornerParticles && (
                <>
                  {[
                    { top: '1.5rem', left: '1.5rem', delay: 0.15 },
                    { top: '1.5rem', right: '1.5rem', delay: 0.25 },
                    { bottom: '1.5rem', left: '1.5rem', delay: 0.35 },
                    { bottom: '1.5rem', right: '1.5rem', delay: 0.45 },
                  ].map((p, i) => (
                    <motion.div
                      key={i}
                      style={{ ...particleBaseStyle, ...p }}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: p.delay, duration: 0.4 }}
                    />
                  ))}
                </>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

/**
 * Converte cor hex (#rrggbb ou #rgb) para rgba string.
 * Aceita também valores rgb()/rgba() e retorna sem conversão.
 */
function hexToRgba(color: string, alpha: number): string {
  if (color.startsWith('rgb')) {
    // Já é rgb/rgba, aplica alpha
    const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (match) {
      return `rgba(${match[1]}, ${match[2]}, ${match[3]}, ${alpha})`;
    }
    return color;
  }
  const hex = color.replace('#', '');
  const expanded = hex.length === 3
    ? hex.split('').map((c) => c + c).join('')
    : hex;
  const r = parseInt(expanded.substring(0, 2), 16);
  const g = parseInt(expanded.substring(2, 4), 16);
  const b = parseInt(expanded.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
