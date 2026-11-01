const API_ROOT = 'https://pokeapi.co/api/v2/';
const CACHE_LIFETIME = 24 * 60 * 60 * 1000;

export class ApiError extends Error {
  constructor(message, status = 0) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export function normalizePokemonName(value) {
  const name = String(value).trim().toLowerCase().normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/♀/g, '-f').replace(/♂/g, '-m')
    .replace(/[.'’:]/g, '').replace(/\s+/g, '-')
    .replace(/^mega-(.+?)(-(?:x|y|z))?$/, '$1-mega$2');
  return name.replace(/^#?0*(\d+)$/, '$1');
}

export function formatName(value = '') {
  const names = { 'nidoran-f': 'Nidoran♀', 'nidoran-m': 'Nidoran♂', 'mr-mime': 'Mr. Mime', 'mr-rime': 'Mr. Rime', 'mime-jr': 'Mime Jr.', 'type-null': 'Type: Null', flabebe: 'Flabébé', farfetchd: 'Farfetch’d', sirfetchd: 'Sirfetch’d', 'ho-oh': 'Ho-Oh', 'porygon-z': 'Porygon-Z' };
  if (names[value]) return names[value];
  return value.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

export function resourceId(url) {
  return Number(String(url).match(/\/(\d+)\/?(?:\?.*)?$/)?.[1]) || 0;
}

export function englishName(resource, fallback = '') {
  return resource.names?.find(entry => entry.language.name === 'en')?.name || formatName(fallback || resource.name);
}

export function artworkUrl(id, shiny = false) {
  return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${shiny ? 'shiny/' : ''}${id}.png`;
}

export function statValues(pokemon) {
  return Object.fromEntries(pokemon.stats.map(({ stat, base_stat }) => [stat.name, base_stat]));
}

export function descriptionFor(species) {
  const entries = species.flavor_text_entries?.filter(entry => entry.language.name === 'en') || [];
  return entries.at(-1)?.flavor_text.replace(/[\n\f\r]+/g, ' ').replace(/\s+/g, ' ').trim()
    || 'There is still more to discover about this Pokémon.';
}

export function createLatestRequest() {
  let version = 0;
  let controller;
  return {
    start() {
      controller?.abort();
      controller = new AbortController();
      const current = ++version;
      return { signal: controller.signal, isCurrent: () => current === version };
    },
    cancel() { controller?.abort(); version += 1; }
  };
}

export function createPokeApi(fetchImpl = globalThis.fetch, storage = undefined) {
  const memory = new Map();
  let typeIndexPromise;

  async function get(resource, { signal } = {}) {
    const url = new URL(resource, API_ROOT);
    if (url.origin !== 'https://pokeapi.co' || !url.pathname.startsWith('/api/v2/')) {
      throw new ApiError('Invalid Pokémon data resource.');
    }
    if (signal?.aborted) throw new DOMException('Request cancelled', 'AbortError');
    const key = 'pokefetch:api:' + url.href;
    let cached = memory.get(key);
    try { if (!cached) cached = JSON.parse(storage?.getItem(key) || 'null'); } catch { /* Storage may be unavailable. */ }
    if (cached && Date.now() - cached.time < CACHE_LIFETIME) {
      memory.set(key, cached);
      return cached.data;
    }

    let response;
    try { response = await fetchImpl(url.href, { signal }); }
    catch (error) {
      if (error.name === 'AbortError') throw error;
      throw new ApiError('Could not reach PokéAPI. Check your connection and try again.');
    }
    if (!response.ok) {
      throw new ApiError(response.status === 404
        ? 'No Pokémon found. Check the name or Pokédex number and try again.'
        : 'PokéAPI is unavailable right now. Please try again.', response.status);
    }
    let data;
    try { data = await response.json(); }
    catch (error) {
      if (error.name === 'AbortError') throw error;
      throw new ApiError('The Pokémon data could not be read. Please try again.');
    }
    if (signal?.aborted) throw new DOMException('Request cancelled', 'AbortError');
    cached = { time: Date.now(), data };
    memory.set(key, cached);
    try { storage?.setItem(key, JSON.stringify(cached)); } catch { /* Memory cache still works when storage is full. */ }
    return data;
  }

  async function pokemonDetails(query, options = {}) {
    const name = normalizePokemonName(query);
    if (!name) throw new ApiError('Enter a Pokémon name or Pokédex number.', 400);
    let pokemon;
    let species;
    try { pokemon = await get(`pokemon/${encodeURIComponent(name)}/`, options); }
    catch (error) {
      if (error.status !== 404) throw error;
      // Species such as Deoxys and Wormadam use a different default-form Pokémon name.
      species = await get(`pokemon-species/${encodeURIComponent(name)}/`, options);
      const defaultForm = species.varieties?.find(variety => variety.is_default);
      if (!defaultForm) throw error;
      pokemon = await get(defaultForm.pokemon.url, options);
    }
    species ||= await get(pokemon.species.url, options);
    const generation = await get(species.generation.url, options);
    return { pokemon, species, generation, name: englishName(species), description: descriptionFor(species), stats: statValues(pokemon) };
  }

  async function buildTypeIndex() {
    const { results } = await get('type/?limit=100');
    const queue = [...results];
    const pokemonTypes = new Map();
    // Fetch the type collections once, rather than a full Pokémon response for every card.
    async function worker() {
      while (queue.length) {
        const type = await get(queue.shift().url);
        for (const { slot, pokemon } of type.pokemon || []) {
          const id = resourceId(pokemon.url);
          const entries = pokemonTypes.get(id) || [];
          entries.push({ slot, name: type.name });
          pokemonTypes.set(id, entries);
        }
      }
    }
    const outcomes = await Promise.allSettled(Array.from({ length: Math.min(4, queue.length) }, worker));
    const failed = outcomes.find(outcome => outcome.status === 'rejected');
    if (failed) throw failed.reason;
    return new Map([...pokemonTypes].map(([id, types]) => [id, types.sort((a, b) => a.slot - b.slot).map(type => type.name)]));
  }

  function pokemonTypeIndex() {
    typeIndexPromise ||= buildTypeIndex().catch(error => { typeIndexPromise = undefined; throw error; });
    return typeIndexPromise;
  }

  return {
    get,
    pokemonDetails,
    pokemonTypeIndex,
    speciesList: options => get('pokemon-species/?limit=10000', options),
    generations: options => get('generation/?limit=100', options),
    generation: (id, options) => get(`generation/${id}/`, options)
  };
}

let storage;
try { storage = globalThis.sessionStorage; } catch { /* Some browser privacy settings block storage. */ }
export const api = createPokeApi(globalThis.fetch, storage);
