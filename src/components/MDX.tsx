// https://github.com/timlrx/tailwind-nextjs-starter-blog/blob/typescript/components/MDXComponents.tsx

import { useMemo } from 'react';
import { ComponentMap, getMDXComponent } from 'mdx-bundler/client';
import Image from 'next/image';
import Link from './Link';
import Pre from './Pre';

export const MDXComponents: ComponentMap = {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  Image,
  a: Link,
  pre: Pre,
};

interface Props {
  mdxSource: string;
  [key: string]: unknown;
}

export default function MDXLayoutRenderer({ mdxSource, ...rest }: Props) {
  const MDXLayout = useMemo(() => getMDXComponent(mdxSource), [mdxSource]);

  return <MDXLayout components={MDXComponents} {...rest} />;
}
