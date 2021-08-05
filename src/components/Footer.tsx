import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="flex flex-col items-start justify-center w-full max-w-2xl mx-auto mb-8">
      <hr className="w-full mb-8 border-gray-400 border-1 border-opacity-20" />
      <div className="grid w-full max-w-2xl grid-cols-1 gap-4 pb-16 sm:grid-cols-3">
        <div className="flex flex-col space-y-4">
          <Link href="/">
            <a>Home</a>
          </Link>
          <Link href="/about">
            <a>About</a>
          </Link>
        </div>
        <div className="flex flex-col space-y-4">
          <Link href="/blog">
            <a>Blog</a>
          </Link>
          <Link href="/projects">
            <a>Projects</a>
          </Link>
        </div>
        <div className="flex flex-col space-y-4">
          <Link href="/guestbook">
            <a>Guestbook</a>
          </Link>
        </div>
      </div>
    </footer>
  );
}
