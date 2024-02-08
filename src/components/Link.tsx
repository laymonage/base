import NextLink from 'next/link';
import { ComponentProps } from 'react';

export default function Link({
  href,
  ...rest
}: Omit<ComponentProps<typeof NextLink>, 'href'> & { href: string }) {
  const isInternalLink = (href as string).startsWith('/');
  const isAnchorLink = (href as string).startsWith('#');

  if (!href) {
    return <span {...rest} />;
  }

  if (isInternalLink) {
    return <NextLink href={href as string} {...rest} />;
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
