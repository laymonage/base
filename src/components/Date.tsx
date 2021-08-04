import { parseISO, format } from 'date-fns';

export interface DateProps {
  dateString: string;
  dateFormat?: string;
  className?: string;
}

export default function Date({ dateString, dateFormat, className }: DateProps) {
  const date = parseISO(dateString);
  return (
    <time dateTime={dateString} className={className}>
      {format(date, dateFormat || 'LLLL d, yyyy')}
    </time>
  );
}
