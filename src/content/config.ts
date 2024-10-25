import { createMarkdownProcessor } from '@astrojs/markdown-remark';
import { defineCollection, getCollection, z } from 'astro:content';
import { file, glob } from 'astro/loaders';

const postsSchema = z.object({
  title: z.string(),
  date: z.coerce.date(),
  draft: z.boolean().optional(),
  toc: z.boolean().optional(),
  comments: z.boolean().or(z.string()).optional(),
  description: z.string(),
  tags: z.array(z.string()).optional(),
  image: z.string().optional(),
});

const gsoc = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './content/gsoc' }),
  schema: postsSchema,
});

const posts = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './content/posts' }),
  schema: postsSchema,
});

const thoughts = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './content/thoughts' }),
  schema: postsSchema,
});

// Logs

export const parseLogSlug = (slug: string) => {
  const [year, week] = slug.split('w');
  return { year: +`20${year}`, week: +week };
};

export const humanizeLogSlug = (slug: string) => {
  const { year, week } = parseLogSlug(slug);
  return `${year} Week ${week}`;
};

const logs = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './content/logs' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
  }),
});

export const getGroupedLogs = async () =>
  Object.entries(
    Object.groupBy(
      (await getCollection('logs'))
        .map((log) => ({
          ...log,
          data: { ...log.data, ...parseLogSlug(log.id) },
        }))
        .sort((a, b) => b.data.year - a.data.year || b.data.week - a.data.week),
      ({ data: { year } }) => year,
    ),
  ).sort(([a], [b]) => +b - +a);

const timelineYearSchema = z.object({
  id: z.number(),
  items: z.array(
    z.object({
      emoji: z.string(),
      title: z.string(),
      description: z.string(),
    }),
  ),
});

export type TimelineYear = z.infer<typeof timelineYearSchema>;

const about = defineCollection({
  loader: file('./src/content/data/about.json'),
  schema: timelineYearSchema,
});

const projectSchema = z.object({
  id: z.number(),
  shown: z.boolean(),
  image: z.object({
    src: z.string(),
    lowContrast: z.boolean().optional(),
  }),
  title: z.string(),
  url: z.string(),
  description: z.string(),
  details: z.array(z.string()),
});

const projectGroupSchema = z.object({
  id: z.number(),
  shown: z.boolean(),
  type: z.string(),
  anchor: z.string(),
  data: z.array(projectSchema),
});

const projects = defineCollection({
  loader: file('./src/content/data/projects.json'),
  schema: projectGroupSchema,
});

const markdownProcessor = createMarkdownProcessor();

export const md = async (content: string) =>
  (await (await markdownProcessor).render(content)).code;

export const collections = { gsoc, logs, posts, thoughts, about, projects };
