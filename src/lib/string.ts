export const capitalize = (s: string): string =>
  s.charAt(0).toUpperCase() + s.slice(1);

export const parseLogSlug = (slug: string) => {
  const [year, week] = slug.split('w');
  return { year: `20${year}`, week };
};

export const humanizeLogSlug = (slug: string) => {
  const { year, week } = parseLogSlug(slug);
  return `${year} Week ${week}`;
};

export const decodeHTML = (html: string) => {
  if (typeof document === 'undefined') return html;
  const text = document.createElement('textarea');
  text.innerHTML = html;
  return text.value;
};
