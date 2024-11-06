export const decodeHTML = (html: string) => {
  if (typeof document === 'undefined') return html;
  const text = document.createElement('textarea');
  text.innerHTML = html;
  return text.value;
};
