import NextLink from 'next/link';
import { AnchorHTMLAttributes, DetailedHTMLProps } from 'react';

export default function Link({
  href,
  ...rest
}: DetailedHTMLProps<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  HTMLAnchorElement
>) {
  const isInternalLink = href && href.startsWith('/');
  const isAnchorLink = href && href.startsWith('#');

  if (isInternalLink) {
    return (
      <NextLink href={href as string}>
        <a {...rest} />
      </NextLink>
    );
  }

  if (isAnchorLink) {
    return <a href={href} {...rest} />;
  }

  return (
    <a
      target="_blank"
      rel="noopener noreferrer nofollow"
      href={href}
      {...rest}
    />
  );
}
