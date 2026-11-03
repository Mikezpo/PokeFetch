import { initSite, loadAutocomplete } from './site.js';

export function initHomePage(document) {
  initSite(document);
  loadAutocomplete(document);
}

if (typeof document !== 'undefined') initHomePage(document);
