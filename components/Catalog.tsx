import { ReactNodeArray } from 'react';

export interface Items {
  items: ReactNodeArray;
  border?: boolean;
  className?: string;
}

const Catalog = ({ items, border, className }: Items) => {
  return (
    <ol className={className}>
      {items.map((item, index) => (
        <li key={index}>
          {border && index !== 0 && (
            <div className="w-full mx-auto my-6 border border-gray-400 border-opacity-20" />
          )}
          {item}
        </li>
      ))}
    </ol>
  );
};
export default Catalog;
