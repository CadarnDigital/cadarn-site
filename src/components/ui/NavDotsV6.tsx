import { useState, useEffect } from 'react';

const sections = [
  { id: 'video', label: 'Cadarn', icon: '▶' },
  { id: 'metodo', label: 'Método', icon: '⬡' },
  { id: 'triade', label: 'Tríade', icon: '△' },
  { id: 'cta', label: 'Scan', icon: '◎' },
];

export const NavDotsV6 = () => {
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { threshold: 0.4 }
    );

    for (const s of sections) {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav
      className="fixed right-4 top-1/2 z-50 hidden -translate-y-1/2 flex-col gap-5 lg:flex"
      aria-label="Navegação por dobras"
    >
      {sections.map((s) => (
        <button
          key={s.id}
          onClick={() => scrollTo(s.id)}
          className={`group relative flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300 ${
            activeId === s.id
              ? 'border-caramelo bg-caramelo/20 text-caramelo glow-caramelo'
              : 'border-offwhite/20 text-offwhite/40 hover:border-caramelo/50 hover:text-caramelo/70'
          }`}
          aria-label={s.label}
        >
          <span className="text-xs">{s.icon}</span>
          <span className="pointer-events-none absolute right-14 whitespace-nowrap rounded bg-navy/90 px-3 py-1 font-mono text-xs text-offwhite opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            {s.label}
          </span>
        </button>
      ))}
    </nav>
  );
};
