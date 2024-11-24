import fastGlob from 'fast-glob';
import { parse } from 'parse5';
import path from 'node:path';
import fs from 'node:fs';
import type { AstroIntegration } from 'astro';

export const defaultOutDir = '.vercel/output/static';

// Derived from og-images-generator
// https://github.com/JulianCataldo/og-images-generator/blob/be04b8cff19a18b946e3f6d8a7afea96ee5269e5/src/collect.js#L26
// (c) Julian Cataldo – MIT License

function extractMetadataFromHtml(fileContent: string) {
  const ast = parse(fileContent);

  const doc = ast.childNodes.find((node) => node.nodeName === 'html');
  if (doc === undefined || !('childNodes' in doc))
    throw Error('Invalid base HTML document.');

  const head = doc.childNodes.find((node) => node.nodeName === 'head');
  if (head === undefined || !('childNodes' in head))
    throw Error('Invalid HTML head element.');

  const body = doc.childNodes.find((node) => node.nodeName === 'body');
  if (body === undefined || !('childNodes' in body))
    throw Error('Invalid HTML body element.');

  const metaTagsNode = head.childNodes.filter((node) =>
    ['meta'].includes(node.nodeName),
  );

  const metaTags: Record<string, string> = {};
  metaTagsNode.forEach((node) => {
    if (!('attrs' in node)) return;

    node.attrs.map((attr) => {
      if (attr.name === 'property' || attr.name === 'name') {
        const metaName = attr.value;
        const metaValue = node.attrs.find(
          (attr) => attr.name === 'content',
        )?.value;

        if (metaValue) metaTags[metaName] = metaValue;
      }
    });
  });

  return metaTags;
}

export async function collectHtmlPages(outDir = defaultOutDir) {
  const files = await fastGlob(path.join(outDir, '**/*.html'));

  const pages: { [key: string]: { title: string; description: string } } = {};

  await Promise.all(
    files.map(async (filePath) => {
      const fileContent = await fs.promises.readFile(filePath, 'utf-8');
      const metadata = extractMetadataFromHtml(fileContent);
      const pagePath = path
        .relative(outDir, filePath)
        .replace(/\/index\.html$/, '')
        .replace(/\.html$/, ''); // For the main index.html

      if (pagePath === 'index') {
        pages[pagePath] = {
          title: `laymonage's personal website`,
          description: 'laymonage.com',
        };
      } else {
        pages[pagePath] = {
          title: metadata.title,
          description: `laymonage.com/${pagePath}`,
        };
      }
    }),
  );

  return pages;
}

export function getImageOptions(
  _: string,
  page: { title: string; description: string },
) {
  return {
    title: page.title,
    description: page.description,
    logo: {
      path: './public/logo.png',
      size: [200, 200],
    },
    border: {
      color: [71, 85, 105],
      width: 24,
    },
    bgImage: {
      path: './public/bg.png',
      fit: 'cover',
      position: ['end', 'center'],
    },
    bgGradient: [[17, 24, 39]],
    font: {
      title: {
        weight: 'SemiBold',
        families: ['Source Sans 3'],
      },
      description: {
        families: ['Source Sans 3'],
      },
    },
    fonts: [
      'https://api.fontsource.org/v1/fonts/source-sans-3/latin-400-normal.ttf',
    ],
  };
}

async function generateOgImages(outDir = defaultOutDir) {
  // HACK: The package uses extensionless imports, and using it in an Astro
  // integration doesn't work for some reason, as Vite would throw an
  // ERR_MODULE_NOT_FOUND error. So, we import it dynamically here with a full
  // path via node_modules.
  const generateOpenGraphImage = (
    await import(
      '../../node_modules/astro-og-canvas/dist/generateOpenGraphImage.js'
    )
  ).generateOpenGraphImage;

  const pages = Object.entries(await collectHtmlPages(outDir));

  for (const [ogPath, page] of pages) {
    const options = getImageOptions(ogPath, page);

    const dest = path.join(process.cwd(), outDir, 'og', `${ogPath}.png`);
    await fs.promises
      .mkdir(path.dirname(dest), { recursive: true })
      .catch(() => null);
    await fs.promises.writeFile(
      dest,
      await generateOpenGraphImage(
        options as Parameters<typeof generateOpenGraphImage>[0],
      ),
    );
  }
}

export function ogImagesGenerator(): AstroIntegration {
  return {
    name: 'og-images-generator',

    hooks: {
      'astro:build:done': ({ dir }) =>
        generateOgImages(path.relative(process.cwd(), dir.pathname)),
    },
  };
}
