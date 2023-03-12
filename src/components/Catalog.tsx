import { ReactNodeArray } from 'react';

export interface Items {
  items: ReactNodeArray;
  border?: boolean;
  className?: string;
}

export default function Catalog({ items, border, className }: Items) {
  return (
    <ol className={className}>
      {items.map((item, index) => (
        <li key={index}>
          {border && index !== 0 ? (
            <div className="mx-auto my-6 w-full border border-gray-400 border-opacity-20" />
          ) : null}
          {item}
        </li>
      ))}
    </ol>
  );
}
