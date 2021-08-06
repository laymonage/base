import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="flex flex-col items-start justify-center w-full max-w-3xl p-4 mx-auto">
      <hr className="w-full mb-8 border-gray-400 border-1 border-opacity-20" />
      <div className="grid justify-between w-full max-w-3xl gap-4 grid-cols-2 pb-16 sm:grid-cols-[repeat(3,min-content)]">
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
          <Link href="/logs">
            <a>Logs</a>
          </Link>
        </div>
        <div className="flex flex-col space-y-4">
          <Link href="/projects">
            <a>Projects</a>
          </Link>
          <Link href="/guestbook">
            <a>Guestbook</a>
          </Link>
        </div>
      </div>
      <div className="w-full text-sm text-center">
        © 2021 – made with{' '}
        <span className="duration-700 cursor-pointer hover:text-red-500 transition-color">
          ♥
        </span>{' '}
        by laymonage
      </div>
    </footer>
  );
}
