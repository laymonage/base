import Link from 'next/link';
import Card from '@/components/Card';
import Layout from '@/components/Layout';
import ExternalLink from '@/components/ExternalLink';

export default function About() {
  return (
    <Layout
      customMeta={{
        title: 'Guestbook',
        description: `laymonage's guestbook. Feel free to sign it!`,
      }}
      hasComments
    >
      <Card
        header={
          <h2 id="guestbook">
            <Link href="#guestbook">
              <a>Guestbook</a>
            </Link>
          </h2>
        }
      >
        Welcome! You can sign my guestbook down below. It is powered by my very
        own project:{' '}
        <ExternalLink href="https://giscus.app">giscus</ExternalLink>. Feel free
        to write anything – just please be considerate :)
      </Card>
    </Layout>
  );
}
