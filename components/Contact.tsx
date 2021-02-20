import Card from './Card';
import GitHub from './icons/GitHub.svg';
import LinkedIn from './icons/LinkedIn.svg';
import Twitter from './icons/Twitter.svg';

export const data = {
  alias: 'laymonage',
  name: 'Sage M. Abdullah',
  description: 'I build up and break down stuff in the open.',
  metaDescription: 'laymonage is Sage M. Abdullah. I build up and break down stuff in the open.',
  links: [
    {
      url: 'https://github.com/laymonage',
      icon: GitHub,
    },
    {
      url: 'https://linkedin.com/in/laymonage',
      icon: LinkedIn,
    },
    {
      url: 'https://twitter.com/laymonage',
      icon: Twitter,
    },
  ],
};

const Contact: React.FC = () => {
  const subtitle = (
    <>
      <span className="mr-1 text-gray-500 sm:ml-4"> is </span>
      <span>{data.name}</span>
    </>
  );
  return (
    <Card header={data.alias} subtitle={subtitle}>
      <div className="mb-8 text-xl text-left md:text-2xl">{data.description}</div>
      <div className="flex items-center">
        {data.links.map((link, index) => (
          <a
            key={index}
            target="_blank"
            rel="noreferrer noopener nofollow"
            href={link.url}
            className="w-8 h-8 p-1 ml-3 rounded fill-current first:ml-0 focus:outline-none focus:bg-blue-100 focus:text-blue-700 hover:bg-blue-100 hover:text-blue-700 dark:text-blue-200 dark:focus:bg-gray-700 dark:focus:text-blue-100 dark:hover:bg-gray-700 dark:hover:text-blue-100"
          >
            <link.icon />
          </a>
        ))}
      </div>
    </Card>
  );
};

export default Contact;
