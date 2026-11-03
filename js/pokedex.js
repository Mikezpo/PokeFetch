import { api, createLatestRequest, formatName, normalizePokemonName, resourceId } from './api.js';
import { GENERATIONS, generationInfo } from './data.js';
import { initSite, pokemonCard, showFeedback, typeBadge } from './site.js';
import { updatePageMetadata } from './seo.js';

export function filterSpecies(species, query) {
  const name = normalizePokemonName(query);
  return species.filter(pokemon => normalizePokemonName(pokemon.name).includes(name) || String(pokemon.id) === name);
}

export function initPokedexPage(document, { client = api, location = globalThis.location, history = globalThis.history } = {}) {
  const select = document.querySelector('#generation-select');
  const input = document.querySelector('#dex-search');
  const grid = document.querySelector('#pokedex-grid');
  const feedback = document.querySelector('#page-feedback');
  const previous = document.querySelector('#dex-previous');
  const next = document.querySelector('#dex-next');
  const pager = document.querySelector('#dex-page');
  const requests = createLatestRequest();
  const pageSize = 24;
  let species = [];
  let page = 1;
  let loading = true;
  let generationError = '';
  let types = new Map();
  let typesLoading = false;
  let typesLoaded = false;
  let typesFailed = false;

  function updateUrl() {
    const params = new URLSearchParams({ generation: select.value });
    if (input.value.trim()) params.set('search', input.value.trim());
    history?.replaceState(null, '', 'pokedex.html?' + params);
  }

  function updateFeedback() {
    const count = filterSpecies(species, input.value).length;
    const message = loading ? 'Opening the Pokédex…'
      : generationError ? generationError
      : !count ? 'No Pokémon match this search. Try another name or number.'
      : typesLoading ? 'Loading Pokémon types…'
      : typesFailed ? 'Pokémon types could not be loaded. Select Reload Pokémon to try again.' : '';
    showFeedback(feedback, message, !loading && Boolean(generationError || (count && typesFailed)));
  }

  async function loadTypes() {
    if (typesLoaded || typesLoading) return;
    typesLoading = true;
    typesFailed = false;
    updateFeedback();
    try {
      types = await client.pokemonTypeIndex();
      typesLoaded = true;
      // Update badges in place so loading them does not replace focused cards or artwork.
      grid.querySelectorAll('[data-pokemon-id]').forEach(card => {
        const names = types.get(Number(card.getAttribute('data-pokemon-id'))) || [];
        card.querySelector('.type-list').replaceChildren(...names.map(name => typeBadge(document, name)));
      });
    } catch { typesFailed = true; }
    finally { typesLoading = false; updateFeedback(); }
  }

  function render() {
    const filtered = filterSpecies(species, input.value);
    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
    page = Math.min(page, totalPages);
    grid.replaceChildren(...filtered.slice((page - 1) * pageSize, page * pageSize).map(pokemon => pokemonCard(document, {
      ...pokemon, types: types.get(pokemon.id) || []
    })));
    previous.disabled = loading || page <= 1;
    next.disabled = loading || page >= totalPages;
    pager.textContent = `Page ${page} of ${totalPages}`;
    document.querySelector('#dex-count').textContent = `${filtered.length} Pokémon`;
    updateFeedback();
  }

  async function loadGeneration(value) {
    const request = requests.start();
    loading = true;
    generationError = '';
    species = [];
    page = 1;
    render();
    loadTypes();
    const info = generationInfo(value);
    document.querySelector('#dex-region').textContent = info ? info.region : 'Every generation';
    document.querySelector('#dex-generation').textContent = info ? `Generation ${info.roman}` : 'National Pokédex';
    const mapLink = document.querySelector('#dex-map-link');
    mapLink.href = info ? `generations.html#region-${info.slug}` : 'generations.html';
    try {
      const data = value === 'all' ? await client.speciesList({ signal: request.signal }) : await client.generation(value, { signal: request.signal });
      if (!request.isCurrent()) return;
      species = (data.results || data.pokemon_species).map(pokemon => ({
        id: resourceId(pokemon.url), name: formatName(pokemon.name)
      })).sort((a, b) => a.id - b.id);
      loading = false;
      render();
      updatePageMetadata(document, {
        title: info ? `${info.region} Pokédex — Generation ${info.roman} Pokémon | PokeFetch` : 'National Pokédex — All Pokémon Generations | PokeFetch',
        description: info ? `Browse the ${info.region} Pokédex on PokeFetch. Explore Pokémon introduced in Generation ${info.roman}, view their types, and open profiles for stats, abilities, and artwork.` : 'Explore the National Pokédex on PokeFetch. Browse Pokémon across all nine generations, see their types, and open profiles for stats, abilities, and artwork.',
        path: info?.id === 1 ? 'pokedex.html' : `pokedex.html?generation=${info?.id || 'all'}`
      });
      updateUrl();
    } catch (error) {
      if (!request.isCurrent() || error.name === 'AbortError') return;
      loading = false;
      generationError = error.message || 'The Pokédex could not be loaded.';
      render();
    }
  }

  GENERATIONS.forEach(generation => {
    const option = document.createElement('option');
    option.value = String(generation.id);
    option.textContent = `Generation ${generation.roman} · ${generation.region}`;
    select.appendChild(option);
  });
  const params = new URLSearchParams(location?.search || '');
  const initial = params.get('generation') || '1';
  select.value = initial === 'all' || generationInfo(initial) ? initial : '1';
  input.value = params.get('search') || '';
  select.addEventListener('change', () => { input.value = ''; loadGeneration(select.value); });
  input.addEventListener('input', () => { page = 1; render(); updateUrl(); });
  previous.addEventListener('click', () => { page -= 1; render(); grid.scrollIntoView({ block: 'start' }); });
  next.addEventListener('click', () => { page += 1; render(); grid.scrollIntoView({ block: 'start' }); });
  document.querySelector('#dex-retry').addEventListener('click', () => loadGeneration(select.value));
  loadGeneration(select.value);
  return { loadGeneration };
}

if (typeof document !== 'undefined') { initSite(document); initPokedexPage(document); }
