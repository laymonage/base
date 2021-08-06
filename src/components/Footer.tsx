import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="flex flex-col items-start justify-center w-full max-w-3xl p-4 mx-auto">
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
          <Link href="/posts">
            <a>Posts</a>
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
