import Card from '@/components/Card';
import Layout from '@/components/Layout';
import Link from '@/components/Link';

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
            <Link href="#guestbook">Guestbook</Link>
          </h2>
        }
      >
        Welcome! You can sign my guestbook down below. It is powered by my very
        own project: <Link href="https://giscus.app">giscus</Link>. Feel free to
        write anything – just please be considerate :)
      </Card>
    </Layout>
  );
}
