export const capitalize = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1);

export const humanizeLogSlug = (slug: string) => {
  const [year, week] = slug.split('w');
  return `20${year} Week ${week}`;
};
