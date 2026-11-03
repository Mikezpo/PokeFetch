import { api } from './api.js';
import { GENERATIONS, MAP_SOURCE } from './data.js';
import { initSite, showFeedback } from './site.js';

export function initGenerationsPage(document, { client = api } = {}) {
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
    const card = document.querySelector(`#region-${generation.slug}`);
    const mapLink = card.querySelector('.region-map-button');
    if (typeof dialog.showModal === 'function') {
      mapLink.setAttribute('aria-haspopup', 'dialog');
      mapLink.setAttribute('aria-controls', 'region-map-dialog');
      mapLink.addEventListener('click', event => {
        if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        openMap(generation);
      });
    }
    cards.set(generation.id, {
      count: card.querySelector('.generation-count')
    });
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
    }));
    const failed = results.some(result => result.status === 'rejected');
    showFeedback(document.querySelector('#page-feedback'), failed ? 'Some live Pokémon counts could not be loaded. Region maps and browsing links are still available.' : '', failed);
  }
  loadCounts();
  return { loadCounts };
}

if (typeof document !== 'undefined') { initSite(document); initGenerationsPage(document); }
