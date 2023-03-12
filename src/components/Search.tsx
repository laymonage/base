import { useRef, useEffect, ChangeEventHandler } from 'react';

interface SearchProps {
  onSearch: ChangeEventHandler<HTMLInputElement>;
}

export default function Search({ onSearch }: SearchProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === '/' && document.activeElement !== inputRef.current) {
      event.preventDefault();
      inputRef.current?.focus();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, []);

  return (
    <div className="flex">
      <input
        className="w-full flex-grow rounded border-2 border-gray-400 border-opacity-20 bg-gray-300 bg-opacity-10 px-4 py-2 hover:bg-opacity-30 focus:bg-opacity-30 focus:outline-none sm:rounded-r-none sm:border-r-0"
        placeholder="Type what you're looking for..."
        type="text"
        onChange={onSearch}
        ref={inputRef}
      />
      <kbd
        className="my-auto hidden h-full rounded rounded-l-none border-2 border-gray-400 border-opacity-20 bg-gray-400 bg-opacity-20 p-2 text-gray-400 sm:block"
        title="Press / to focus"
      >
        /
      </kbd>
    </div>
  );
}
