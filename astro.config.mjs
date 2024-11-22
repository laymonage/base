// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

import sitemap from '@astrojs/sitemap';

import react from '@astrojs/react';

import icon from 'astro-icon';

import tailwind from '@astrojs/tailwind';

import pagefind from 'astro-pagefind';

import { copyButton } from './src/lib/shiki';

import vercel from '@astrojs/vercel/serverless';

// https://astro.build/config
export default defineConfig({
  site: 'https://laymonage.com',
  output: 'hybrid',
  integrations: [
    mdx(),
    sitemap({
      priority: 0.5,
      serialize(item) {
        const priorityMap = {
          0.1: [
            /\/palates\/music\/playlists\/[\w-]+\//,
            /\/palates\/music\/top\//,
          ],
          0.2: [/\/logs\/$/, /\/logs\/2[1,2]w[0-9]{2}\/$/],
          0.3: [/\/guestbook\/$/],
        };
        for (const [priority, urls] of Object.entries(priorityMap)) {
          for (const url of urls) {
            if (url.test(item.url)) {
              item.priority = +priority;
            }
          }
        }
        return item;
      },
      xslURL: '/sitemap.xsl',
    }),
    react(),
    icon(),
    tailwind(),
    pagefind(),
  ],
  markdown: {
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      defaultColor: false,
      transformers: [copyButton()],
    },
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
        },
      },
    },
  },
  experimental: {
    contentLayer: true,
  },
  adapter: vercel(),
});
