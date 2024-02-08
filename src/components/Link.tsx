import NextLink, { LinkProps } from 'next/link';

export default function Link({
  href,
  ...rest
}: Omit<LinkProps, 'href'> & { href: string }) {
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
