import { useState } from 'react';

interface BlogPost {
  title: string;
  description: string;
  category: string;
  author: string;
  publishedAt: string;
  slug: string;
}

interface CategoryDef {
  id: string;
  label: string;
  colorClass: string;
}

interface BlogFilterProps {
  categories: CategoryDef[];
  posts: BlogPost[];
}

const POSTS_PER_PAGE = 12;

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const categoryBadgeClasses: Record<string, string> = {
  roi: 'bg-bandeira-roi text-offwhite',
  amadorismo: 'bg-bandeira-amador text-offwhite',
  branding: 'bg-navy text-offwhite border-l-2 border-caramelo',
  hibrida: 'bg-bandeira-hibrida text-offwhite',
  radical: 'bg-bandeira-radical text-offwhite',
};

const categoryLabels: Record<string, string> = {
  roi: 'ROI Real',
  amadorismo: 'Fim do Amadorismo',
  branding: 'Branding como Escudo',
  hibrida: 'Inteligência Híbrida',
  radical: 'Protagonismo Radical',
};

export const BlogFilter = ({ categories, posts }: BlogFilterProps) => {
  const [activeCategory, setActiveCategory] = useState<string>('todos');
  const [page, setPage] = useState(1);

  const filtered = activeCategory === 'todos'
    ? posts
    : posts.filter((p) => p.category === activeCategory);

  const totalPages = Math.ceil(filtered.length / POSTS_PER_PAGE);
  const paginated = filtered.slice(0, page * POSTS_PER_PAGE);
  const hasMore = page < totalPages;

  const handleCategoryChange = (id: string) => {
    setActiveCategory(id);
    setPage(1);
  };

  return (
    <div>
      {/* Filter buttons */}
      <div className="mb-10 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => handleCategoryChange('todos')}
          className={[
            'px-4 py-2 text-sm font-headline font-semibold uppercase tracking-wider transition-all duration-200',
            activeCategory === 'todos'
              ? 'bg-vinho text-offwhite'
              : 'bg-transparent text-vinho border border-vinho/20 hover:bg-vinho/5',
          ].join(' ')}
        >
          Todos
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => handleCategoryChange(cat.id)}
            className={[
              'px-4 py-2 text-sm font-headline font-semibold uppercase tracking-wider transition-all duration-200',
              activeCategory === cat.id
                ? categoryBadgeClasses[cat.id] ?? 'bg-vinho text-offwhite'
                : 'bg-transparent text-vinho border border-vinho/20 hover:bg-vinho/5',
            ].join(' ')}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Post grid or empty state */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-lg text-vinho/70 mb-6">
            Ainda não há artigos nesta bandeira. Estamos preparando conteúdo de verdade.
          </p>
          <a
            href="/scan"
            className="inline-flex items-center justify-center font-headline font-semibold uppercase tracking-wider bg-caramelo text-offwhite hover:bg-caramelo/85 border border-caramelo px-6 py-3 text-base transition-all duration-200"
          >
            Faça seu Scan de Autoridade
          </a>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {paginated.map((post) => (
              <a
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group block rounded-none bg-offwhite shadow-card transition-all duration-200 hover:shadow-card-hover"
              >
                <div className="aspect-[16/9] bg-navy/10" />
                <div className="p-5">
                  <span
                    className={[
                      'inline-block rounded-none px-3 py-1 text-xs font-headline font-semibold uppercase tracking-wider mb-3',
                      categoryBadgeClasses[post.category] ?? 'bg-vinho text-offwhite',
                    ].join(' ')}
                  >
                    {categoryLabels[post.category] ?? post.category}
                  </span>
                  <h3 className="font-headline text-lg font-bold text-vinho group-hover:text-caramelo transition-colors duration-200 mb-2">
                    {post.title}
                  </h3>
                  <p className="font-body text-sm text-vinho/70 line-clamp-3 mb-4">
                    {post.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-vinho/50 font-body">
                    <span>{post.author}</span>
                    <time dateTime={post.publishedAt}>
                      {formatDate(post.publishedAt)}
                    </time>
                  </div>
                </div>
              </a>
            ))}
          </div>

          {/* Pagination */}
          {hasMore && (
            <div className="mt-12 text-center">
              <button
                type="button"
                onClick={() => setPage((p) => p + 1)}
                className="inline-flex items-center justify-center font-headline font-semibold uppercase tracking-wider bg-transparent text-vinho hover:bg-vinho/5 border border-vinho/20 px-6 py-3 text-base transition-all duration-200"
              >
                Carregar mais artigos
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};
