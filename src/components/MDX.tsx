// https://github.com/timlrx/tailwind-nextjs-starter-blog/blob/typescript/components/MDXComponents.tsx

import { useMemo } from 'react';
import { getMDXComponent } from 'mdx-bundler/client';
import Image from 'next/image';
import Link from './Link';
import Pre from './Pre';
import Script, { ScriptProps } from 'next/script';

export const MDXComponents = {
  Image,
  Link,
  a: Link,
  pre: Pre,
  script: Script as (props: ScriptProps) => JSX.Element,
};

interface Props {
  mdxSource: string;
  [key: string]: unknown;
}

export default function MDXLayoutRenderer({ mdxSource, ...rest }: Props) {
  const MDXLayout = useMemo(() => getMDXComponent(mdxSource), [mdxSource]);

  return <MDXLayout components={MDXComponents} {...rest} />;
}
