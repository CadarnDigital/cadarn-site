import { useEffect, useState } from 'react';

interface SpyLink {
  /** id da seção alvo na home (sem #). */
  id: string;
  label: string;
}

/**
 * HeaderV4 (v4 — Passo 4.6) — header próprio da v4 com NAV SCROLL-SPY.
 * Observa as seções da home via IntersectionObserver; o item da seção atual
 * ganha um indicador caramelo (underline animado) conforme rola. Mantém o
 * visual da marca (vinho/caramelo/offwhite) e os links externos do site v1.
 *
 * Anti-CLS: header fixed, altura estável. O indicador é um span absoluto
 * (scaleX), não altera layout. Reduced-motion: o indicador aparece sem animar
 * (transição via CSS, segura).
 */

const SPY_LINKS: SpyLink[] = [
  { id: 'dor', label: 'Diagnóstico' },
  { id: 'triade', label: 'Método' },
  { id: 'prova', label: 'Prova' },
  { id: 'blog', label: 'Blog' },
];

export const HeaderV4 = () => {
  const [active, setActive] = useState<string>('');

  useEffect(() => {
    const sections = SPY_LINKS.map((l) => document.getElementById(l.id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: [0, 0.25, 0.5, 1] },
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-accent-metal/15 bg-surface-abyss/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-content items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <a href="/v4" className="flex items-center gap-2">
          <img src="/logo-splash.png" alt="" style={{ height: '40px', width: 'auto' }} />
          <span className="font-headline text-xl font-bold uppercase tracking-[0.2em] text-on-dark-strong">
            Cadarn
          </span>
          <span className="font-headline text-xs font-medium uppercase tracking-[0.2em] text-accent-metal/80">
            Martech
          </span>
        </a>

        <nav className="hidden items-center gap-5 lg:flex" aria-label="Navegação da página">
          {SPY_LINKS.map((link) => {
            const isActive = active === link.id;
            return (
              <a
                key={link.id}
                href={`#${link.id}`}
                className="relative font-headline text-xs uppercase tracking-widest transition-colors duration-200"
                style={{ color: isActive ? 'var(--accent-metal-hi)' : 'var(--on-dark-muted)' }}
              >
                {link.label}
                <span
                  aria-hidden="true"
                  className="absolute -bottom-1 left-0 h-px w-full origin-left bg-accent-metal transition-transform duration-300"
                  style={{ transform: isActive ? 'scaleX(1)' : 'scaleX(0)' }}
                />
              </a>
            );
          })}
          <a
            href="/scan"
            className="bg-gradient-to-br from-accent-metal-hi to-accent-metal px-5 py-1.5 font-headline text-xs font-bold uppercase tracking-widest text-surface-abyss transition-shadow duration-300 hover:shadow-glow"
          >
            Scan de Autoridade
          </a>
        </nav>
      </div>
    </header>
  );
};

export default HeaderV4;
