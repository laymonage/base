const dateFormat: Intl.DateTimeFormatOptions = {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  timeZoneName: 'short',
};

const dateFormatter = new Intl.DateTimeFormat('en', dateFormat);

export function formatDate(date: string | Date) {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateFormatter.format(dateObj);
}

const shortDateFormat: Intl.DateTimeFormatOptions = {
  day: 'numeric',
  month: 'short',
};

const shortDateFormatter = new Intl.DateTimeFormat('en', shortDateFormat);

const shortDateYearFormat: Intl.DateTimeFormatOptions = {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
};

const shortDateYearFormatter = new Intl.DateTimeFormat(
  'en',
  shortDateYearFormat,
);

const relativeTimeFormat: Intl.RelativeTimeFormatOptions = {
  localeMatcher: 'best fit',
  numeric: 'auto',
  style: 'long',
};

const relativeTimeFormatter = new Intl.RelativeTimeFormat(
  'en',
  relativeTimeFormat,
);

interface FormatParamsDate {
  format: Intl.DateTimeFormat;
  value: Date;
}

interface FormatParamsRelative {
  format: Intl.RelativeTimeFormat;
  value: number;
  unit: Intl.RelativeTimeFormatUnit;
}

function format(params: FormatParamsDate): string;
function format(params: FormatParamsRelative): string;
function format(p: FormatParamsDate | FormatParamsRelative): string {
  const isDate = !('unit' in p);

  return isDate ? p.format.format(p.value) : p.format.format(p.value, p.unit);
}

export function relativeFormat(date: string | Date) {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diff = now.getTime() - dateObj.getTime();
  const diffInSeconds = Math.floor(diff / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInYears = now.getUTCFullYear() - dateObj.getUTCFullYear();

  if (diffInYears > 0)
    return format({ format: shortDateYearFormatter, value: dateObj });
  if (diffInDays >= 30)
    return format({ format: shortDateFormatter, value: dateObj });
  if (diffInDays > 0)
    return format({
      format: relativeTimeFormatter,
      value: -diffInDays,
      unit: 'day',
    });
  if (diffInHours > 0)
    return format({
      format: relativeTimeFormatter,
      value: -diffInHours,
      unit: 'hour',
    });
  if (diffInMinutes > 0)
    return format({
      format: relativeTimeFormatter,
      value: -diffInMinutes,
      unit: 'minute',
    });
  return format({
    format: relativeTimeFormatter,
    value: -diffInSeconds,
    unit: 'second',
  });
}

export function msToComponents(ms: number) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = Math.floor(minutes % 60);
  return { hours, minutes: remainingMinutes, seconds: remainingSeconds };
}

export function msToDuration(ms: number) {
  const { minutes, seconds } = msToComponents(ms);
  return `PT${minutes}M${seconds}S`;
}

export function msToMinutes(ms: number) {
  const { minutes, seconds } = msToComponents(ms);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

export function humanizeMs(ms: number) {
  const { hours, minutes, seconds } = msToComponents(ms);
  return hours ? `${hours} hr ${minutes} min` : `${minutes} min ${seconds} sec`;
}
