import { api, artworkUrl, formatName, resourceId } from './api.js';

export function initNavigation(document) {
  const toggle = document.querySelector('.navButton');
  const links = document.querySelector('.navLinks');
  if (!toggle || !links) return;
  const setOpen = open => {
    links.classList.toggle('active', open);
    toggle.setAttribute('aria-expanded', String(open));
  };
  toggle.addEventListener('click', () => setOpen(!links.classList.contains('active')));
  links.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setOpen(false)));
  document.addEventListener('click', event => {
    if (!toggle.contains(event.target) && !links.contains(event.target)) setOpen(false);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && links.classList.contains('active')) { setOpen(false); toggle.focus(); }
  });
}

export function showFeedback(element, message = '', isError = false) {
  element.textContent = message;
  element.classList.toggle('is-error', isError);
  element.setAttribute('role', isError ? 'alert' : 'status');
}

export function setImage(image, url, alt = '') {
  image.classList.remove('image-fallback');
  image.src = url;
  image.alt = alt;
  image.onerror = () => {
    image.onerror = null;
    image.src = 'images/pokeball.png';
    image.classList.add('image-fallback');
  };
}

export function typeBadge(document, type) {
  const badge = document.createElement('span');
  badge.className = `type-badge type-${type}`;
  badge.textContent = formatName(type);
  return badge;
}

export function pokemonCard(document, pokemon) {
  const link = document.createElement('a');
  link.className = 'pokemon-card';
  link.setAttribute('data-pokemon-id', pokemon.id);
  link.href = `stats.html?pokemon=${pokemon.id}`;
  const image = document.createElement('img');
  image.width = 160;
  image.height = 160;
  image.loading = 'lazy';
  setImage(image, artworkUrl(pokemon.id), pokemon.name);
  const number = document.createElement('span');
  number.className = 'dex-number';
  number.textContent = `#${String(pokemon.id).padStart(3, '0')}`;
  const name = document.createElement('h3');
  name.textContent = pokemon.name;
  const meta = document.createElement('div');
  meta.className = 'type-list';
  if (pokemon.types) pokemon.types.forEach(type => meta.appendChild(typeBadge(document, type)));
  else {
    const label = document.createElement('span');
    label.className = 'card-meta';
    label.textContent = pokemon.region || 'View Pokémon';
    meta.appendChild(label);
  }
  link.append(number, image, name, meta);
  return link;
}

export async function loadAutocomplete(document, client = api) {
  const list = document.querySelector('#pokemonList');
  if (!list) return;
  try {
    const { results } = await client.speciesList();
    const options = results.map(species => {
      const option = document.createElement('option');
      option.value = formatName(species.name);
      return option;
    });
    list.replaceChildren(...options);
    return results;
  } catch { return []; /* A failed suggestion list must not prevent typed searches. */ }
}

export function initRandomButtons(document, client = api, location = globalThis.location) {
  document.querySelectorAll('[data-random]').forEach(button => {
    button.addEventListener('click', async () => {
      const feedback = document.querySelector('#page-feedback');
      button.disabled = true;
      try {
        const { results } = await client.speciesList();
        const selected = results[Math.floor(Math.random() * results.length)];
        location.href = `stats.html?pokemon=${resourceId(selected.url)}`;
      } catch (error) { if (feedback) showFeedback(feedback, error.message, true); }
      finally { button.disabled = false; }
    });
  });
}

export function initSite(document) {
  initNavigation(document);
  document.querySelectorAll('[data-artwork-id]').forEach(image => setImage(image, artworkUrl(image.dataset.artworkId), image.alt));
  document.querySelectorAll('[data-year]').forEach(element => { element.textContent = new Date().getFullYear(); });
  initRandomButtons(document);
}
