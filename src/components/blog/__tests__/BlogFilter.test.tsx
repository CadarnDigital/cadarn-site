import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { BlogFilter } from '../BlogFilter';

expect.extend(toHaveNoViolations);

const categories = [
  { id: 'roi', label: 'ROI Real', colorClass: 'bg-bandeira-roi' },
  { id: 'branding', label: 'Branding como Escudo', colorClass: 'bg-navy' },
];

const makePosts = (n: number, category = 'roi') =>
  Array.from({ length: n }, (_, i) => ({
    title: `Post ${i + 1}`,
    description: `Descrição ${i + 1}`,
    category,
    author: 'Cadarn',
    publishedAt: '2026-01-01',
    slug: `post-${i + 1}`,
  }));

describe('BlogFilter', () => {
  it('renders all posts when "Todos" is active', () => {
    const posts = [...makePosts(2, 'roi'), ...makePosts(2, 'branding')];
    render(<BlogFilter categories={categories} posts={posts} />);
    expect(screen.getAllByRole('link')).toHaveLength(4);
  });

  it('filters posts by category', async () => {
    const user = userEvent.setup();
    const posts = [...makePosts(3, 'roi'), ...makePosts(2, 'branding')];
    render(<BlogFilter categories={categories} posts={posts} />);

    await user.click(screen.getByRole('button', { name: /branding/i }));
    expect(screen.getAllByRole('link')).toHaveLength(2);
  });

  it('shows empty state when category has no posts', async () => {
    const user = userEvent.setup();
    render(<BlogFilter categories={categories} posts={makePosts(2, 'roi')} />);

    await user.click(screen.getByRole('button', { name: /branding/i }));
    expect(screen.getByText(/ainda não há artigos/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /scan/i })).toBeInTheDocument();
  });

  it('resets to page 1 on category change', async () => {
    const user = userEvent.setup();
    // 14 posts in roi — enough to trigger load-more
    const posts = makePosts(14, 'roi');
    render(<BlogFilter categories={categories} posts={posts} />);

    await user.click(screen.getByRole('button', { name: /carregar mais/i }));
    expect(screen.queryByRole('button', { name: /carregar mais/i })).not.toBeInTheDocument();

    // Switch to branding (empty) and back to todos — pagination must reset
    await user.click(screen.getByRole('button', { name: /branding/i }));
    await user.click(screen.getByRole('button', { name: /todos/i }));
    expect(screen.getByRole('button', { name: /carregar mais/i })).toBeInTheDocument();
  });

  it('loads more posts on button click', async () => {
    const user = userEvent.setup();
    const posts = makePosts(14, 'roi');
    render(<BlogFilter categories={categories} posts={posts} />);

    expect(screen.getAllByRole('link')).toHaveLength(12);
    await user.click(screen.getByRole('button', { name: /carregar mais/i }));
    expect(screen.getAllByRole('link')).toHaveLength(14);
    expect(screen.queryByRole('button', { name: /carregar mais/i })).not.toBeInTheDocument();
  });

  it('"Todos" button is active by default', () => {
    render(<BlogFilter categories={categories} posts={makePosts(1)} />);
    const todosBtn = screen.getByRole('button', { name: /todos/i });
    expect(todosBtn.className).toContain('bg-vinho');
  });

  describe('Accessibility (axe)', () => {
    it('has no axe violations with posts', async () => {
      const posts = [...makePosts(3, 'roi'), ...makePosts(2, 'branding')];
      const { container } = render(<BlogFilter categories={categories} posts={posts} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no axe violations on empty state', async () => {
      const user = userEvent.setup();
      const { container } = render(<BlogFilter categories={categories} posts={makePosts(2, 'roi')} />);
      await user.click(screen.getByRole('button', { name: /branding/i }));
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
