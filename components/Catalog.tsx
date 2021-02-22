import { ReactNodeArray } from 'react';

export interface Items {
  items: ReactNodeArray;
  border?: boolean;
}

const Catalog = ({ items, border }: Items) => {
  return (
    <ol>
      {items.map((item, index) => (
        <li key={index}>
          {border && index !== 0 && <div className="w-full mx-auto border" />}
          {item}
        </li>
      ))}
    </ol>
  );
};
export default Catalog;
