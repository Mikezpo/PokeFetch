export const SITE_URL = 'https://mikezpo.github.io/PokeFetch/';

export function updatePageMetadata(document, { title, description, path }) {
  const head = document.querySelector('head');
  document.querySelector('title').textContent = title;
  const setMeta = (attribute, name, content) => {
    let meta = head.querySelector(`[${attribute}="${name}"]`);
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute(attribute, name);
      head.appendChild(meta);
    }
    meta.setAttribute('content', content);
  };
  setMeta('name', 'description', description);
  setMeta('property', 'og:title', title);
  setMeta('property', 'og:description', description);
  setMeta('name', 'twitter:title', title);
  setMeta('name', 'twitter:description', description);

  // Interactive pages set their canonical only after resolving the selected content.
  // This avoids conflicting canonical URLs in the source HTML and rendered page.
  const url = new URL(path, SITE_URL).href;
  let canonical = head.querySelector('[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    head.appendChild(canonical);
  }
  canonical.href = url;
  setMeta('property', 'og:url', url);
}
