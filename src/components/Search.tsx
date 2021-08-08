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
        className="flex-grow w-full px-4 py-2 bg-gray-300 border-2 border-gray-400 rounded sm:border-r-0 sm:rounded-r-none border-opacity-20 focus:outline-none focus:bg-opacity-30 hover:bg-opacity-30 bg-opacity-10"
        placeholder="Type what you're looking for..."
        type="text"
        onChange={onSearch}
        ref={inputRef}
      />
      <kbd
        className="hidden h-full p-2 my-auto text-gray-400 bg-gray-400 border-2 border-gray-400 rounded rounded-l-none border-opacity-20 bg-opacity-20 sm:block"
        title="Press / to focus"
      >
        /
      </kbd>
    </div>
  );
}
