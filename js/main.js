import { api, artworkUrl, createLatestRequest, englishName, formatName, normalizePokemonName, resourceId } from './api.js';
import { FEATURED_POKEMON, generationInfo } from './data.js';
import { initSite, loadAutocomplete, pokemonCard, setImage, showFeedback, typeBadge } from './site.js';

const STAT_LABELS = { hp: 'HP', attack: 'Attack', defense: 'Defence', 'special-attack': 'Sp. Attack', 'special-defense': 'Sp. Defence', speed: 'Speed' };

export function megaEvolutions(species) {
  return (species.varieties || []).flatMap(({ pokemon }) => {
    const match = pokemon.name.match(/-mega(?:-(.+))?$/);
    if (!match) return [];
    return [{ slug: pokemon.name, name: `Mega ${englishName(species)}${match[1] ? ' ' + formatName(match[1]) : ''}` }];
  });
}

function profileName(details) {
  return megaEvolutions(details.species).find(form => form.slug === details.pokemon.name)?.name || details.name;
}

export function flattenEvolution(chain, depth = 0, result = []) {
  result.push({ id: resourceId(chain.species.url), name: formatName(chain.species.name), depth, details: chain.evolution_details || [] });
  (chain.evolves_to || []).forEach(next => flattenEvolution(next, depth + 1, result));
  return result;
}

export function evolutionCondition(details) {
  const condition = details[0];
  if (!condition) return 'First stage';
  if (condition.item) return `Use ${formatName(condition.item.name)}`;
  if (condition.min_level) return `Level ${condition.min_level}`;
  if (condition.min_happiness) return 'High friendship';
  if (condition.trigger?.name === 'trade') return 'Trade';
  return formatName(condition.trigger?.name || 'Evolution');
}

export function initStatsPage(document, { client = api, location = globalThis.location, history = globalThis.history } = {}) {
  const input = document.querySelector('#pokemonInput');
  const form = document.querySelector('#pokemon-search');
  const button = document.querySelector('#fetchButton');
  const feedback = document.querySelector('#page-feedback');
  const results = document.querySelector('.statsSection');
  const empty = document.querySelector('#search-empty');
  const shinyButton = document.querySelector('#shiny-toggle');
  const megaControls = document.querySelector('#mega-form-controls');
  const megaFeedback = document.querySelector('#mega-feedback');
  const evolutionGrid = document.querySelector('#evolution-grid');
  const requests = createLatestRequest();
  const formRequests = createLatestRequest();
  let currentDetails;
  let shiny = false;
  let maxSpeciesId = Infinity;
  let megaControlsKey;

  function renderImage() {
    const { pokemon } = currentDetails;
    const name = profileName(currentDetails);
    const artwork = pokemon.sprites.other?.['official-artwork'];
    const source = shiny ? artwork?.front_shiny || pokemon.sprites.front_shiny : artwork?.front_default || pokemon.sprites.front_default;
    setImage(document.querySelector('#pokeImg'), source || artworkUrl(pokemon.id, shiny), `${shiny ? 'Shiny ' : ''}${name}`);
    shinyButton.setAttribute('aria-pressed', String(shiny));
    shinyButton.textContent = shiny ? 'Show default artwork' : 'Show shiny artwork';
  }

  function renderMegaControls(details) {
    const forms = megaEvolutions(details.species);
    const key = `${details.species.id}:${forms.map(form => form.slug).join(',')}`;
    if (megaControlsKey !== key) {
      const buttons = forms.map(form => {
        const toggle = document.createElement('button');
        toggle.type = 'button';
        toggle.className = 'btn btn-small btn-quiet';
        toggle.textContent = form.name;
        toggle.setAttribute('data-mega-form', form.slug);
        toggle.title = `Select ${form.name}. Select it again to return to ${details.name}.`;
        toggle.addEventListener('click', () => selectMegaEvolution(form.slug));
        return toggle;
      });
      megaControls.replaceChildren(...buttons);
      megaControlsKey = key;
    }
    megaControls.classList.toggle('hide', forms.length === 0);
    megaControls.querySelectorAll('[data-mega-form]').forEach(toggle => {
      toggle.setAttribute('aria-pressed', String(toggle.getAttribute('data-mega-form') === details.pokemon.name));
    });
  }

  async function selectMegaEvolution(slug) {
    if (!currentDetails) return;
    const mega = megaEvolutions(currentDetails.species).find(form => form.slug === slug);
    if (!mega) return;
    const speciesId = currentDetails.species.id;
    const defaultForm = currentDetails.species.varieties?.find(variety => variety.is_default)?.pokemon.name || currentDetails.species.name;
    const target = currentDetails.pokemon.name === slug ? defaultForm : slug;
    const targetName = target === defaultForm ? currentDetails.name : mega.name;
    const request = formRequests.start();
    megaControls.setAttribute('aria-busy', 'true');
    showFeedback(megaFeedback, `Loading ${targetName}…`);
    try {
      const details = await client.pokemonDetails(target, { signal: request.signal });
      if (!request.isCurrent() || currentDetails.species.id !== speciesId) return;
      render(details, { preserveShiny: true });
      input.value = profileName(details);
      showFeedback(feedback, `Showing ${profileName(details)}.`);
      showFeedback(megaFeedback);
      history?.replaceState(null, '', `stats.html?pokemon=${encodeURIComponent(details.pokemon.name)}`);
    } catch (error) {
      if (!request.isCurrent() || error.name === 'AbortError') return;
      showFeedback(megaFeedback, error.message || 'This Mega Evolution could not be loaded. Please try again.', true);
    } finally {
      if (request.isCurrent()) megaControls.setAttribute('aria-busy', 'false');
    }
  }

  function renderPager() {
    const id = currentDetails.species.id;
    for (const [selector, target] of [['#previous-pokemon', id - 1], ['#next-pokemon', id + 1]]) {
      const link = document.querySelector(selector);
      const disabled = target < 1 || target > maxSpeciesId;
      link.setAttribute('aria-disabled', String(disabled));
      if (disabled) link.removeAttribute('href');
      else link.href = `stats.html?pokemon=${target}`;
    }
  }

  function render(details, { preserveShiny = false } = {}) {
    currentDetails = details;
    if (!preserveShiny) shiny = false;
    const { pokemon, species, generation, name, description, stats } = details;
    const displayName = profileName(details);
    const isMega = megaEvolutions(species).some(form => form.slug === pokemon.name);
    const generationData = generationInfo(generation.id);
    const setText = (selector, value) => { document.querySelector(selector).textContent = value; };
    setText('.pokemonName', displayName);
    setText('.pokemonId', `#${String(species.id).padStart(3, '0')}`);
    setText('#profile-form', isMega ? 'Mega Evolution' : pokemon.is_default === false ? formatName(pokemon.name) : 'National Pokédex');
    setText('#pokemon-description', description);
    setText('#profile-category', species.genera?.find(entry => entry.language.name === 'en')?.genus || 'Pokémon');
    setText('.pokeGen', generationData ? `Generation ${generationData.roman}` : englishName(generation));
    setText('.pokeRegion', englishName(generation.main_region));
    setText('#profile-height', `${pokemon.height / 10} m`);
    setText('#profile-weight', `${pokemon.weight / 10} kg`);
    setText('#profile-growth', formatName(species.growth_rate?.name || 'Unknown'));

    document.querySelector('.pokemonType').replaceChildren(...pokemon.types.map(({ type }) => typeBadge(document, type.name)));
    const abilities = pokemon.abilities.map(({ ability, is_hidden }) => {
      const item = document.createElement('li');
      item.textContent = formatName(ability.name) + (is_hidden ? ' · Hidden ability' : '');
      return item;
    });
    document.querySelector('.pokeAbilit').replaceChildren(...abilities);

    Object.entries(STAT_LABELS).forEach(([name, label]) => {
      const row = document.querySelector(`[data-stat="${name}"]`);
      const value = stats[name] ?? 0;
      row.querySelector('[data-stat-value]').textContent = value;
      row.querySelector('[data-stat-fill]').style.width = `${Math.min(255, Math.max(0, value)) / 255 * 100}%`;
      row.setAttribute('aria-label', `${label}: ${value}`);
    });
    setText('#stats-total', Object.keys(STAT_LABELS).reduce((total, stat) => total + (stats[stat] || 0), 0));
    setText('#evolution-heading', `${name}’s evolution family`);
    renderImage();
    renderMegaControls(details);
    renderPager();
    results.classList.remove('hide');
    empty.classList.add('hide');
  }

  async function loadEvolution(details, request) {
    evolutionGrid.replaceChildren();
    showFeedback(document.querySelector('#evolution-feedback'), 'Finding the evolution family…');
    if (!details.species.evolution_chain?.url) {
      showFeedback(document.querySelector('#evolution-feedback'), 'No evolution information is available for this Pokémon.');
      return;
    }
    try {
      const { chain } = await client.get(details.species.evolution_chain.url, { signal: request.signal });
      if (!request.isCurrent()) return;
      const family = flattenEvolution(chain);
      family.forEach(member => {
        const card = pokemonCard(document, member);
        card.classList.add('evolution-card');
        if (member.id === details.species.id) card.setAttribute('aria-current', 'true');
        const condition = document.createElement('span');
        condition.className = 'evolution-condition';
        condition.textContent = evolutionCondition(member.details);
        card.appendChild(condition);
        evolutionGrid.appendChild(card);
      });
      showFeedback(document.querySelector('#evolution-feedback'), family.length === 1 ? 'This Pokémon has no known evolution.' : 'Select a Pokémon to explore the next part of its story.');
    } catch (error) {
      if (request.isCurrent() && error.name !== 'AbortError') {
        showFeedback(document.querySelector('#evolution-feedback'), 'Evolution information could not be loaded right now.', true);
      }
    }
  }

  async function search(value = input.value) {
    const request = requests.start();
    formRequests.cancel();
    megaControls.setAttribute('aria-busy', 'false');
    showFeedback(megaFeedback);
    results.classList.add('hide');
    empty.classList.remove('hide');
    input.setAttribute('aria-invalid', 'false');
    button.textContent = 'Fetch';
    button.setAttribute('aria-busy', 'false');
    if (!normalizePokemonName(value)) {
      showFeedback(feedback, 'Enter a Pokémon name or Pokédex number.', true);
      input.setAttribute('aria-invalid', 'true');
      return;
    }
    showFeedback(feedback, 'Fetching your Pokémon…');
    button.textContent = 'Fetching…';
    button.setAttribute('aria-busy', 'true');
    try {
      const details = await client.pokemonDetails(value, { signal: request.signal });
      if (!request.isCurrent()) return;
      render(details);
      input.value = megaEvolutions(details.species).some(form => form.slug === details.pokemon.name)
        ? profileName(details) : details.pokemon.is_default === false ? formatName(details.pokemon.name) : details.name;
      showFeedback(feedback, `Showing ${profileName(details)}.`);
      history?.replaceState(null, '', `stats.html?pokemon=${encodeURIComponent(details.pokemon.name)}`);
      await loadEvolution(details, request);
    } catch (error) {
      if (!request.isCurrent() || error.name === 'AbortError') return;
      showFeedback(feedback, error.message || 'Could not load Pokémon. Please try again.', true);
      input.setAttribute('aria-invalid', String(error.status === 404 || error.status === 400));
    } finally {
      if (request.isCurrent()) {
        button.textContent = 'Fetch';
        button.setAttribute('aria-busy', 'false');
      }
    }
  }

  form.addEventListener('submit', event => { event.preventDefault(); search(); });
  input.addEventListener('keydown', event => { if (event.key === 'Enter' && event.isComposing) event.preventDefault(); });
  shinyButton.addEventListener('click', () => { if (currentDetails) { shiny = !shiny; renderImage(); } });
  loadAutocomplete(document, client).then(list => {
    if (list?.length) maxSpeciesId = Math.max(...list.map(species => resourceId(species.url)));
    if (currentDetails) renderPager();
  });
  const featured = document.querySelector('#featured-grid');
  featured.replaceChildren(...FEATURED_POKEMON.slice(0, 3).map(pokemon => pokemonCard(document, pokemon)));
  const initial = new URLSearchParams(location?.search || '').get('pokemon');
  if (initial) { input.value = initial; search(initial); }
  return { search, selectMegaEvolution };
}

if (typeof document !== 'undefined') { initSite(document); initStatsPage(document); }
