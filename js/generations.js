import { api, formatName } from './api.js';
import { GENERATIONS, MAP_SOURCE } from './data.js';
import { initSite, showFeedback } from './site.js';

export function initGenerationsPage(document, { client = api } = {}) {
  const grid = document.querySelector('#generation-grid');
  const jump = document.querySelector('#region-jump');
  const dialog = document.querySelector('#region-map-dialog');
  const dialogImage = dialog.querySelector('img');
  const cards = new Map();

  function openMap(generation) {
    dialog.querySelector('#map-dialog-title').textContent = `${generation.region} · Generation ${generation.roman}`;
    dialogImage.src = `images/regions/${generation.slug}.png`;
    dialogImage.alt = `Official illustrated map of the ${generation.region} region`;
    dialog.showModal();
  }

  GENERATIONS.forEach(generation => {
    const link = document.createElement('a');
    link.href = `#region-${generation.slug}`;
    link.textContent = generation.region;
    link.className = 'region-jump-link';
    jump.appendChild(link);

    const card = document.createElement('article');
    card.className = 'generation-card';
    card.id = `region-${generation.slug}`;
    const mapButton = document.createElement('button');
    mapButton.className = 'region-map-button';
    mapButton.type = 'button';
    mapButton.setAttribute('aria-label', `View the full ${generation.region} map`);
    const image = document.createElement('img');
    image.src = `images/regions/${generation.slug}.png`;
    image.alt = `Map of ${generation.region}`;
    image.width = 600;
    image.height = 400;
    image.loading = 'lazy';
    const mapLabel = document.createElement('span');
    mapLabel.textContent = 'Explore the map ↗';
    mapButton.append(image, mapLabel);
    mapButton.addEventListener('click', () => openMap(generation));
    const content = document.createElement('div');
    content.className = 'generation-card-body';
    const eyebrow = document.createElement('span');
    eyebrow.className = 'eyebrow';
    eyebrow.textContent = `Generation ${generation.roman}`;
    const heading = document.createElement('h2');
    heading.textContent = generation.region;
    const description = document.createElement('p');
    description.textContent = generation.description;
    const count = document.createElement('span');
    count.className = 'generation-count';
    count.textContent = 'Discover this generation';
    const games = document.createElement('span');
    games.className = 'generation-games';
    const browse = document.createElement('a');
    browse.className = 'text-link';
    browse.href = `pokedex.html?generation=${generation.id}`;
    browse.textContent = `Browse Generation ${generation.roman} →`;
    content.append(eyebrow, heading, description, count, games);
    if (generation.note) {
      const note = document.createElement('p');
      note.className = 'region-note';
      note.textContent = generation.note;
      content.appendChild(note);
    }
    content.appendChild(browse);
    card.append(mapButton, content);
    grid.appendChild(card);
    cards.set(generation.id, { count, games });
  });
  dialog.querySelector('[data-close-dialog]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  dialog.querySelector('[data-map-source]').href = MAP_SOURCE;

  async function loadCounts() {
    showFeedback(document.querySelector('#page-feedback'), 'Loading generation details…');
    const results = await Promise.allSettled(GENERATIONS.map(async generation => {
      const data = await client.generation(generation.id);
      const card = cards.get(generation.id);
      card.count.textContent = `${data.pokemon_species.length} Pokémon introduced`;
      card.games.textContent = data.version_groups.slice(0, 3).map(group => formatName(group.name)).join(' · ');
    }));
    const failed = results.some(result => result.status === 'rejected');
    showFeedback(document.querySelector('#page-feedback'), failed ? 'Some live Pokémon counts could not be loaded. Region maps and browsing links are still available.' : '', failed);
  }
  loadCounts();
  return { loadCounts };
}

if (typeof document !== 'undefined') { initSite(document); initGenerationsPage(document); }
