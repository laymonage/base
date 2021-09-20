import Link from '@/components/Link';

export default function Footer() {
  return (
    <footer className="flex flex-col items-start justify-center w-full max-w-2xl px-8 py-4 mx-auto">
      <hr className="w-full mb-8 border-gray-400 border-1 border-opacity-20" />
      <div className="grid justify-between w-full gap-4 grid-cols-1 pb-16 sm:grid-cols-[repeat(3,min-content)]">
        <div className="flex flex-col space-y-4">
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
        </div>
        <div className="flex flex-col space-y-4">
          <Link href="/posts">Posts</Link>
          <Link href="/logs">Logs</Link>
          <Link href="/gsoc">GSoC</Link>
        </div>
        <div className="flex flex-col space-y-4">
          <Link href="/projects">Projects</Link>
          <Link href="/guestbook">Guestbook</Link>
        </div>
      </div>
      <div className="w-full text-sm text-center">
        © 2021 – made with{' '}
        <span className="duration-700 cursor-pointer saturate-0 hover:saturate-100 hover:brightness-100 brightness-50 dark:brightness-[320%] dark:hover:brightness-100 hover:text-red-500 transition-color">
          ♥&#xfe0e;
        </span>{' '}
        by laymonage
      </div>
    </footer>
  );
}
