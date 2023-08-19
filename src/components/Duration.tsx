import { msToDuration, msToMinutes } from '@/lib/datetime';
import { ReactNode } from 'react';

interface DurationProps {
  // The duration in milliseconds
  value: number;
  className?: string;
  children?: ReactNode;
}

export default function Duration({
  value,
  className = 'text-secondary',
  children,
}: DurationProps) {
  return (
    <time className={className} dateTime={msToDuration(value)}>
      {children || msToMinutes(value)}
    </time>
  );
}
