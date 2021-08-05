import Head from 'next/head';
import { useRouter } from 'next/router';
import clsx from 'clsx';
import { ReactNode } from 'react';
import { capitalize } from '@/lib/string';
import Card from './Card';
import Giscus from './Giscus';
import Navigation from './Navigation';
import ScrollTop from './ScrollTop';
import Footer from './Footer';

export const siteTitle = 'laymonage';
export const siteRoot = 'https://laymonage.com';

export interface CustomMeta {
  title?: string;
  description?: string;
  image?: string;
  type?: string;
  date?: string;
}
export interface LayoutProps {
  children: ReactNode;
  navSafe?: boolean;
  customMeta?: CustomMeta;
  hasComments?: boolean;
}

const fonts = [
  'source-sans-pro-latin-reg-400-v14',
  'source-sans-pro-latin-reg-600-v14',
  'source-sans-pro-latin-itl-400-v14',
  'source-sans-pro-latin-itl-600-v14',
];

export default function Layout({
  children,
  navSafe,
  customMeta,
  hasComments,
}: LayoutProps) {
  const title =
    (customMeta?.title ? `${capitalize(customMeta.title)} | ` : '') + siteTitle;
  const meta = {
    description: 'I build up and break down stuff in the open.',
    image: `https://og-image.laymonage.com/**${encodeURI(
      customMeta?.title || siteTitle,
    )}**.png?&md=1`,
    type: 'website',
    ...customMeta,
    title,
  };

  const router = useRouter();

  return (
    <>
      <Head>
        <title>{meta.title}</title>
        <link rel="canonical" href={`${siteRoot}${router.asPath}`} />
        <link rel="icon" href="/favicon.ico" />
        {fonts.map((font) => (
          <link
            key={font}
            rel="preload"
            href={`/fonts/${font}.woff2`}
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
        ))}
        <meta name="description" content={meta.description} />
        <meta property="og:url" content={`${siteRoot}${router.asPath}`} />
        <meta property="og:type" content={meta.type} />
        <meta property="og:site_name" content={siteTitle} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:title" content={meta.title} />
        <meta property="og:image" content={meta.image} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@laymonage" />
        <meta name="twitter:title" content={meta.title} />
        <meta name="twitter:description" content={meta.description} />
        <meta name="twitter:image" content={meta.image} />
        {meta.date ? (
          <meta property="article:published_time" content={meta.date} />
        ) : null}
      </Head>
      <Navigation />
      <main
        className={clsx('flex flex-col items-center w-full mx-auto max-w-2xl', {
          'mt-2 mb-16 sm:mb-20 sm:mt-24': !navSafe,
        })}
      >
        {children}
        {hasComments ? (
          <Card>
            <Giscus />
          </Card>
        ) : null}
      </main>
      <div className="fixed top-0 left-0 w-screen h-screen bg-center bg-cover opacity-40 xl:opacity-100 bg" />
      <Footer />
      <ScrollTop />
    </>
  );
}
