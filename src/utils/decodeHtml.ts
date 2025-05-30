export const decodeHtml = (html: string): string => {
  if (typeof window === 'undefined') {
    return html
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'");
  }
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
};