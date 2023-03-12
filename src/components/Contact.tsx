import { ElementType } from 'react';
import Card from './Card';
import Link from './Link';
import GitHub from './icons/GitHub.svg';
import LinkedIn from './icons/LinkedIn.svg';
import Twitter from './icons/Twitter.svg';

export interface ContactInfo {
  name: string;
  alias: string;
  description: string;
  metaDescription: string;
  links: Array<{
    url: string;
    name: string;
    icon: ElementType;
  }>;
}

export const data: ContactInfo = {
  alias: 'laymonage',
  name: 'Sage Abdullah',
  description: 'I build up and break down stuff in the open.',
  metaDescription:
    'laymonage is Sage M. Abdullah. I build up and break down stuff in the open.',
  links: [
    {
      url: 'https://github.com/laymonage',
      name: 'GitHub',
      icon: GitHub,
    },
    {
      url: 'https://linkedin.com/in/laymonage',
      name: 'LinkedIn',
      icon: LinkedIn,
    },
    {
      url: 'https://twitter.com/laymonage',
      name: 'Twitter',
      icon: Twitter,
    },
  ],
};

export default function Contact({
  name,
  alias,
  description,
  links,
}: ContactInfo) {
  const subtitle = name ? (
    <>
      <span className="mr-1 text-gray-500 sm:ml-4"> is </span>
      <span>{name}</span>
    </>
  ) : undefined;

  return (
    <Card
      className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-lg flex-col justify-center sm:-mt-20 sm:min-h-[calc(100vh-4rem)]"
      header={<strong>{alias}</strong>}
      subtitle={subtitle}
    >
      <div className="mb-8 text-left text-xl sm:text-2xl">{description}</div>
      <div className="flex items-center">
        {links.map((link) => (
          <Link
            key={link.url}
            href={link.url}
            aria-label={link.name}
            className="ml-3 h-8 w-8 rounded fill-current p-1 first:ml-0 hover:bg-blue-100 hover:text-blue-700 focus:bg-blue-100 focus:text-blue-700 focus:outline-none dark:text-blue-200 dark:hover:bg-gray-700 dark:hover:text-blue-100 dark:focus:bg-gray-700 dark:focus:text-blue-100"
          >
            <link.icon />
          </Link>
        ))}
      </div>
    </Card>
  );
}
