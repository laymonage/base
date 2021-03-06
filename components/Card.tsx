import { ReactNode } from 'react';
import cn from 'classnames';

export interface CardProps {
  children: ReactNode;
  header?: ReactNode;
  subtitle?: ReactNode;
}

const Card = ({ children, header, subtitle }: CardProps) => {
  return (
    <div className="flex-col w-full p-8 bg-white rounded shadow-md dark:bg-gray-800">
      {header && (
        <div
          className={cn('mb-8 text-4xl text-blue-800 dark:text-blue-200 sm:text-5xl sm:flex-row', {
            'flex flex-col items-baseline': !!(header && subtitle),
          })}
        >
          {header}
          {subtitle && <div className="text-2xl sm:text-3xl">{subtitle}</div>}
        </div>
      )}
      {children}
    </div>
  );
};
export default Card;
