import { ReactNode } from 'react';
import clsx from 'clsx';

export interface CardProps {
  children: ReactNode;
  header?: ReactNode;
  subtitle?: ReactNode;
  className?: string;
}

export default function Card({
  children,
  header,
  subtitle,
  className,
}: CardProps) {
  return (
    <div className={clsx('w-full', className)}>
      {header ? (
        <div
          className={clsx(
            'mb-8 text-4xl text-blue-800 dark:text-blue-200 sm:flex-row sm:text-5xl',
            {
              'flex flex-col items-baseline': !!(header && subtitle),
            },
          )}
        >
          {header}
          {subtitle ? (
            <div className="text-2xl sm:text-3xl">{subtitle}</div>
          ) : null}
        </div>
      ) : null}
      {children}
    </div>
  );
}
