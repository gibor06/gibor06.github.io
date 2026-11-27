import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const projectsCollection = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    titleVi: z.string().optional(),
    summary: z.string(),
    summaryVi: z.string().optional(),
    year: z.string(),
    role: z.string(),
    roleVi: z.string().optional(),
    domain: z.string().optional(),
    domainVi: z.string().optional(),
    category: z.string().optional(),
    categoryVi: z.string().optional(),
    stack: z.array(z.string()),
    metrics: z
      .array(
        z.object({
          label: z.string(),
          labelVi: z.string().optional(),
          value: z.string(),
        })
      )
      .optional(),
    coverImage: z.string().optional(),
    image: z.string().optional(),
    featured: z.boolean().default(false),
    order: z.number().default(99),
    githubUrl: z.string().optional(),
    liveUrl: z.string().optional(),
    evidenceUrl: z.string().optional(),
    paperAward: z.string().optional(),
  }),
});

export const collections = {
  projects: projectsCollection,
};
