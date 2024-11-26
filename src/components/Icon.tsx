import type { SVGAttributes } from 'react';

export default function Icon({
  name,
  className = 'stroke-2',
  ...props
}: { name: string } & SVGAttributes<SVGElement>) {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <use href={`#ai:${name}`} />
    </svg>
  );
}
