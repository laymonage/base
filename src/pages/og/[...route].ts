import { OGImageRoute, generateOpenGraphImage } from 'astro-og-canvas';
import { getImageOptions, collectHtmlPages } from '../../lib/astro';

// For local previews only

export const { getStaticPaths, GET } = OGImageRoute({
  param: 'route',
  pages: import.meta.env.DEV ? await collectHtmlPages() : {},
  getImageOptions: (path, page) =>
    getImageOptions(path, page) as Parameters<typeof generateOpenGraphImage>[0],
});
