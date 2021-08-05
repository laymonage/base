import { ReactNode } from 'react';

interface ExternalLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
}

export default function ExternalLink({
  href,
  children,
  className,
}: ExternalLinkProps) {
  return (
    <a
      className={className}
      target="_blank"
      rel="noreferrer noopener nofollow"
      href={href}
    >
      {children}
    </a>
  );
}
