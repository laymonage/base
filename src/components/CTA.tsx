import { ComponentProps } from 'react';
import Link from './Link';
import clsx from 'clsx';
import { IconArrowRight } from '@tabler/icons-react';

export default function CTA({
  className,
  children,
  ...props
}: ComponentProps<typeof Link>) {
  return (
    <Link
      className={clsx('cta flex w-fit items-center gap-4 py-4 px-6', className)}
      {...props}
    >
      {children}
      <IconArrowRight width={20} height={20} />
    </Link>
  );
}
