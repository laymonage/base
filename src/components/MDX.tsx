// https://github.com/timlrx/tailwind-nextjs-starter-blog/blob/typescript/components/MDXComponents.tsx

import { ComponentType, useMemo } from 'react';
import { ComponentMap, getMDXComponent } from 'mdx-bundler/client';
import Image from 'next/image';
import Link from './Link';
import Pre from './Pre';
import { NextScript } from 'next/document';

export const MDXComponents: ComponentMap = {
  Image: Image as ComponentType,
  Link,
  a: Link,
  pre: Pre,
  script: NextScript,
};

interface Props {
  mdxSource: string;
  [key: string]: unknown;
}

export default function MDXLayoutRenderer({ mdxSource, ...rest }: Props) {
  const MDXLayout = useMemo(() => getMDXComponent(mdxSource), [mdxSource]);

  return <MDXLayout components={MDXComponents} {...rest} />;
}
