import Link from '@/components/Link';

export default function Footer() {
  return (
    <footer className="px-8">
      <div className="mx-auto max-w-4xl">
        <hr className="border-1 mb-8 w-full border-gray-400 border-opacity-20" />
        <div className="grid w-full grid-cols-1 justify-between gap-4 pb-8 sm:grid-cols-[repeat(3,min-content)]">
          <div className="flex flex-col space-y-4">
            <Link href="/">Home</Link>
            <Link href="/about">About</Link>
          </div>
          <div className="flex flex-col space-y-4">
            <Link href="/posts">Posts</Link>
            <Link href="/thoughts">Thoughts</Link>
            <Link href="/gsoc">GSoC</Link>
          </div>
          <div className="flex flex-col space-y-4">
            <Link href="/projects">Projects</Link>
            <Link href="/guestbook">Guestbook</Link>
          </div>
        </div>
        <div className="w-full py-4 text-center text-sm">
          © {new Date().getFullYear()} – made with{' '}
          <span className="transition-color cursor-pointer brightness-50 saturate-0 duration-700 hover:text-red-500 hover:brightness-100 hover:saturate-100 dark:brightness-[320%] dark:hover:brightness-100">
            ♥&#xfe0e;
          </span>{' '}
          by laymonage
        </div>
      </div>
    </footer>
  );
}
