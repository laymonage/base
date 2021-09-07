// https://github.com/timlrx/tailwind-nextjs-starter-blog/blob/typescript/lib/mdx.ts

import { bundleMDX } from 'mdx-bundler';
import path from 'path';
import readingTime from 'reading-time';
import codeTitle from './remark-code-title';
import imgToJsx from './img-to-jsx';
import { grayMatterEngines } from '../markdown';
import processTaskListItem from './task-list-item';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrismPlus from 'rehype-prism-plus';

function fixESBuildPath() {
  // https://github.com/kentcdodds/mdx-bundler#nextjs-esbuild-enoent
  if (process.platform === 'win32') {
    process.env.ESBUILD_BINARY_PATH = path.join(
      process.cwd(),
      'node_modules',
      'esbuild',
      'esbuild.exe',
    );
    return;
  }
  process.env.ESBUILD_BINARY_PATH = path.join(
    process.cwd(),
    'node_modules',
    'esbuild',
    'bin',
    'esbuild',
  );
}

export async function processMDX<T>(content: string) {
  fixESBuildPath();

  const { frontmatter, code } = await bundleMDX(content, {
    // mdx imports can be automatically source from the components directory
    cwd: path.join(process.cwd(), 'components'),
    grayMatterOptions(options) {
      options.engines = grayMatterEngines;
      return options;
    },
    xdmOptions(options) {
      options.remarkPlugins = [
        ...(options.remarkPlugins ?? []),
        remarkGfm,
        codeTitle,
        imgToJsx,
      ];
      options.rehypePlugins = [
        ...(options.rehypePlugins ?? []),
        rehypeSlug,
        [
          rehypeAutolinkHeadings,
          {
            properties: { className: 'anchor' },
            content: { type: 'comment', value: '' }, // Remove default span content
          },
        ],
        [rehypePrismPlus, { ignoreMissing: true }],
        processTaskListItem,
      ];
      return options;
    },
  });

  return {
    mdxSource: code,
    frontMatter: {
      readingTime: readingTime(code),
      ...(frontmatter as T),
    },
  };
}
