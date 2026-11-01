import { FEATURED_POKEMON, GENERATIONS } from './data.js';
import { initSite, loadAutocomplete, pokemonCard } from './site.js';

export function initHomePage(document) {
  initSite(document);
  loadAutocomplete(document);
  const featured = document.querySelector('#featured-grid');
  featured.replaceChildren(...FEATURED_POKEMON.map(pokemon => pokemonCard(document, pokemon)));
  const regions = document.querySelector('#home-regions');
  GENERATIONS.slice(0, 3).forEach(generation => {
    const link = document.createElement('a');
    link.className = 'region-preview';
    link.href = `generations.html#region-${generation.slug}`;
    const image = document.createElement('img');
    image.src = `images/regions/${generation.slug}.png`;
    image.alt = `Map of ${generation.region}`;
    image.width = 420;
    image.height = 240;
    image.loading = 'lazy';
    const meta = document.createElement('span');
    meta.className = 'eyebrow';
    meta.textContent = `Generation ${generation.roman}`;
    const title = document.createElement('h3');
    title.textContent = generation.region;
    link.append(image, meta, title);
    regions.appendChild(link);
  });
}

if (typeof document !== 'undefined') initHomePage(document);
