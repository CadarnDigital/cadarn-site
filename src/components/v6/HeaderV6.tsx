import { useEffect, useState } from 'react';

interface SpyLink {
  /** id da seção alvo na home (sem #). */
  id: string;
  label: string;
}

/**
 * HeaderV6 (item 6 — nav scroll-spy com item ativo TACHADO).
 *
 * ELEVAÇÃO v6 vs v5: na v5 o item ativo ganhava um underline animado (scaleX).
 * Na v6 o item da seção atual é TACHADO (line-through caramelo) — o estilo
 * editorial "índice" do Instituto Futuros: o ponto onde você está aparece
 * riscado, como num sumário. [fonte: anatomia-navegacao-instituto-futuros-cadarn]
 *
 * Mecânica: IntersectionObserver com rootMargin que ativa quando a seção cruza
 * o MEIO da tela (não a borda) — sincronia precisa com o que o olho vê.
 *
 * Anti-CLS: header fixed, altura estável. O tachado é só text-decoration (não
 * altera layout). Reduced-motion: troca de estado via CSS, segura.
 */

const SPY_LINKS: SpyLink[] = [
  { id: 'dor', label: 'Diagnóstico' },
  { id: 'triade', label: 'Método' },
  { id: 'prova', label: 'Prova' },
  { id: 'blog', label: 'Blog' },
];

export const HeaderV6 = () => {
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
      // -45%/-45%: ativa quando a seção cruza o centro vertical da tela.
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.5, 1] },
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-accent-metal/15 bg-surface-abyss/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-content items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <a href="/v6" className="flex items-center gap-2">
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
                className="font-headline text-xs uppercase tracking-widest transition-colors duration-200"
                style={{
                  color: isActive ? 'var(--accent-metal-hi)' : 'var(--on-dark-muted)',
                  // Item ativo TACHADO — estilo "índice" editorial.
                  textDecoration: isActive ? 'line-through' : 'none',
                  textDecorationColor: 'var(--accent-metal)',
                  textDecorationThickness: '1px',
                  textUnderlineOffset: '2px',
                }}
              >
                {link.label}
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

export default HeaderV6;
