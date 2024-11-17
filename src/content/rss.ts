import type { APIContext } from 'astro';
import AstroRSS from '@astrojs/rss';
import { getRssItems, sortFeedItems } from './config';

export const posts = {
  title: "laymonage's blog posts",
  description: 'Blog posts from laymonage (Sage Abdullah).',
  items: await getRssItems('posts'),
};

export const thoughts = {
  title: "laymonage's thoughts",
  description:
    'A collection of irregularly published, freeform writings from laymonage (Sage Abdullah).',
  items: await getRssItems('thoughts'),
};

export const all = {
  title: 'laymonage',
  description: 'All content from laymonage (Sage Abdullah).',
  items: sortFeedItems([...posts.items, ...thoughts.items]),
};

const feeds = { posts, thoughts, '': all };

export const rss = (feed: keyof typeof feeds, context: APIContext) =>
  AstroRSS({
    site: `${context.site}${feed}`,
    stylesheet: `/rss.xsl`,
    ...feeds[feed],
  });
