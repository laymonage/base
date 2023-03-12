// https://github.com/timlrx/tailwind-nextjs-starter-blog/blob/typescript/components/Pre.tsx

import clsx from 'clsx';
import { useState, useRef, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

export default function Pre({ children }: Props) {
  const wrapper = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  const onExit = () => {
    setCopied(false);
  };
  const onCopy = () => {
    if (!wrapper.current?.innerText) return;
    setCopied(true);
    navigator.clipboard.writeText(wrapper.current.innerText);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div ref={wrapper} onMouseLeave={onExit} className="pre group relative">
      <button
        aria-label="Copy code"
        type="button"
        className={`absolute right-2 top-2 h-8 w-8 rounded border-2 bg-gray-200 p-1 opacity-0 focus:opacity-100 group-hover:opacity-100 dark:bg-gray-800 ${
          copied
            ? 'border-green-500 focus:border-green-500 focus:outline-none'
            : 'border-gray-300 dark:border-gray-400'
        }`}
        onClick={onCopy}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          stroke="currentColor"
          fill="none"
          className={clsx({ 'text-green-500': copied })}
        >
          {copied ? (
            <>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
              />
            </>
          ) : (
            <>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </>
          )}
        </svg>
      </button>

      <pre>{children}</pre>
    </div>
  );
}
