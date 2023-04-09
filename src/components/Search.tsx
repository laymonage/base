import { useRef, useEffect, ComponentProps } from 'react';
import DebouncedInput from './DebouncedInput';

export default function Search({
  className,
  inputClassName = '',
  ...props
}: ComponentProps<typeof DebouncedInput> & { inputClassName?: string }) {
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
    <div className={`flex ${className}`}>
      <DebouncedInput
        className={`w-full flex-grow rounded border-2 border-gray-400 border-opacity-20 bg-gray-300 bg-opacity-10 px-4 py-2 hover:bg-opacity-30 focus:bg-opacity-30 focus:outline-none sm:rounded-r-none sm:border-r-0 ${inputClassName}`}
        placeholder="Type what you're looking for..."
        type="text"
        {...props}
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
