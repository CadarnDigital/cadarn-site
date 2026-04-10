import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(['roi', 'amadorismo', 'branding', 'hibrida', 'radical']),
    author: z.enum(['Fabiano Cunha', 'Samira Cunha']),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    ogImage: z.string().optional(),
    featured: z.boolean().default(false),
  }),
});

const portfolio = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/portfolio' }),
  schema: z.object({
    title: z.string(),
    client: z.string(),
    segment: z.enum(['imobiliaria', 'estetica', 'advocacia', 'arquitetura', 'contabilidade', 'outro']),
    description: z.string(),
    publishedAt: z.coerce.date(),
    featured: z.boolean().default(false),
    heroImage: z.string().optional(),
    metrics: z.array(z.object({
      label: z.string(),
      value: z.string(),
    })).optional(),
  }),
});

export const collections = { blog, portfolio };
