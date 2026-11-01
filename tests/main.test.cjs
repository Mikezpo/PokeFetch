const assert = require('node:assert/strict');
const test = require('node:test');
const { readFileSync, existsSync } = require('node:fs');
const { join } = require('node:path');
const { loadPage, flush } = require('./dom-helper.cjs');
const modules = Promise.all([import('../js/api.js'), import('../js/main.js'), import('../js/site.js'), import('../js/pokedex.js'), import('../js/generations.js'), import('../js/data.js')]);
const root = join(__dirname, '..');

function fixture(name = 'bulbasaur', generation = 1, region = 'kanto', id = 1) {
  const pokemon = { id, name, is_default: true, height: 7, weight: 69,
    species: { name, url: `https://pokeapi.co/api/v2/pokemon-species/${id}/` },
    types: [{ type: { name: 'grass' } }, { type: { name: 'poison' } }],
    abilities: [{ ability: { name: 'overgrow' }, is_hidden: false }],
    sprites: { other: { 'official-artwork': { front_default: 'normal.png', front_shiny: 'shiny.png' } } },
    stats: [['speed', 0], ['defense', 130], ['special-attack', 140], ['hp', 100], ['special-defense', 150], ['attack', 120]].map(([name, base_stat]) => ({ stat: { name }, base_stat })) };
  const species = { id, name, names: [{ name: name.charAt(0).toUpperCase() + name.slice(1), language: { name: 'en' } }],
    generation: { url: `https://pokeapi.co/api/v2/generation/${generation}/` },
    genera: [{ genus: 'Seed Pokémon', language: { name: 'en' } }], growth_rate: { name: 'medium-slow' },
    flavor_text_entries: [{ flavor_text: 'A growing\nseed\fon its back.', language: { name: 'en' } }],
    evolution_chain: { url: 'https://pokeapi.co/api/v2/evolution-chain/1/' } };
  return { pokemon, species, generation: { id: generation, main_region: { name: region } }, name: species.names[0].name, description: 'A growing seed on its back.', stats: { hp: 100, attack: 120, defense: 130, 'special-attack': 140, 'special-defense': 150, speed: 0 } };
}

function charizardFixture(slug = 'charizard') {
  const details = fixture('charizard', 1, 'kanto', 6);
  const forms = {
    charizard: { id: 6, types: ['fire', 'flying'], ability: 'blaze', stats: [78, 84, 78, 109, 85, 100], height: 17, weight: 905 },
    'charizard-mega-x': { id: 10034, types: ['fire', 'dragon'], ability: 'tough-claws', stats: [78, 130, 111, 130, 85, 100], height: 17, weight: 1105 },
    'charizard-mega-y': { id: 10035, types: ['fire', 'flying'], ability: 'drought', stats: [78, 104, 78, 159, 115, 100], height: 17, weight: 1005 }
  };
  const form = forms[slug];
  details.species.varieties = [...Object.entries(forms).map(([name, value]) => ({ is_default: name === 'charizard', pokemon: { name, url: `https://pokeapi.co/api/v2/pokemon/${value.id}/` } })), { is_default: false, pokemon: { name: 'charizard-gmax', url: 'https://pokeapi.co/api/v2/pokemon/10196/' } }];
  details.pokemon = { ...details.pokemon, name: slug, id: form.id, is_default: slug === 'charizard', height: form.height, weight: form.weight,
    types: form.types.map(name => ({ type: { name } })), abilities: [{ ability: { name: form.ability }, is_hidden: false }],
    sprites: { other: { 'official-artwork': { front_default: `art/${slug}.png`, front_shiny: `art/shiny/${slug}.png` } } } };
  details.stats = Object.fromEntries(['hp', 'attack', 'defense', 'special-attack', 'special-defense', 'speed'].map((name, index) => [name, form.stats[index]]));
  details.pokemon.stats = Object.entries(details.stats).map(([name, base_stat]) => ({ stat: { name }, base_stat }));
  return details;
}
const chain = { species: { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon-species/1/' }, evolution_details: [], evolves_to: [{ species: { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon-species/2/' }, evolution_details: [{ min_level: 16 }], evolves_to: [] }] };
const speciesList = [{ name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon-species/1/' }, { name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon-species/25/' }, { name: 'pecharunt', url: 'https://pokeapi.co/api/v2/pokemon-species/1025/' }];
const pokemonTypes = new Map([[1, ['grass', 'poison']], [25, ['electric']], [50, ['ground']], [810, ['grass']]]);
function client(overrides = {}) { return { pokemonDetails: async () => fixture(), get: async () => ({ chain }), speciesList: async () => ({ results: speciesList }), ...overrides }; }
function response(data, status = 200) { return { ok: status === 200, status, json: async () => data }; }
function setupStats(initStatsPage, customClient = client(), query = '') {
  const document = loadPage('stats.html');
  const urls = [];
  const history = { replaceState(state, title, url) { urls.push(url); } };
  const app = initStatsPage(document, { client: customClient, location: { search: query }, history });
  return { ...app, document, urls, find: selector => document.querySelector(selector) };
}

test('all four pages have one module entry, complete navigation, and local styles', () => {
  const pages = ['index.html', 'stats.html', 'pokedex.html', 'generations.html'];
  for (const page of pages) {
    const document = loadPage(page);
    const scripts = document.querySelectorAll('script');
    assert.equal(scripts.length, 1, page);
    assert.equal(scripts[0].getAttribute('type'), 'module');
    assert.ok(existsSync(join(root, scripts[0].getAttribute('src'))));
    const navigation = document.querySelector('.navLinks');
    assert.deepEqual(navigation.querySelectorAll('a').map(link => link.href), pages);
    assert.equal(navigation.querySelectorAll('a').filter(link => link.getAttribute('aria-current') === 'page').length, 1);
  }
});

test('search normalization handles whitespace, IDs, accents, gender symbols, and punctuation', async () => {
  const [{ normalizePokemonName }] = await modules;
  for (const [input, expected] of [[' PiKaChu ', 'pikachu'], ['#025', '25'], ['0001', '1'], ['Mr. Mime', 'mr-mime'], ['Farfetch’d', 'farfetchd'], ['Nidoran♀', 'nidoran-f'], ['Nidoran♂', 'nidoran-m'], ['Flabébé', 'flabebe'], ['Type: Null', 'type-null'], ['Mega Charizard X', 'charizard-mega-x'], ['Mega Charizard Y', 'charizard-mega-y'], ['Mega Venusaur', 'venusaur-mega'], ['Mega Mewtwo Y', 'mewtwo-mega-y'], ['charizard-mega-x', 'charizard-mega-x']]) assert.equal(normalizePokemonName(input), expected);
});

test('PokéAPI values map by stat name even when reordered or zero', async () => {
  const [{ statValues }] = await modules;
  assert.deepEqual(statValues(fixture().pokemon), fixture().stats);
});

test('descriptions normalize Pokédex line breaks and use English entries', async () => {
  const [{ descriptionFor }] = await modules;
  assert.equal(descriptionFor(fixture().species), 'A growing seed on its back.');
  assert.match(descriptionFor({}), /more to discover/);
});

test('API response cache prevents repeated requests and survives a new client', async () => {
  const [{ createPokeApi }] = await modules;
  const saved = new Map();
  const storage = { getItem: key => saved.get(key), setItem: (key, value) => saved.set(key, value) };
  let calls = 0;
  const fetch = async () => { calls++; return response({ id: 1 }); };
  const first = createPokeApi(fetch, storage);
  await first.get('generation/1/');
  await first.get('generation/1/');
  await createPokeApi(fetch, storage).get('generation/1/');
  assert.equal(calls, 1);
});

test('the cached type index preserves primary and secondary types without per-Pokémon requests', async () => {
  const [{ createPokeApi }] = await modules;
  const calls = [];
  const types = {
    7: { name: 'bug', pokemon: [{ slot: 1, pokemon: { url: 'https://pokeapi.co/api/v2/pokemon/954/' } }] },
    14: { name: 'psychic', pokemon: [{ slot: 2, pokemon: { url: 'https://pokeapi.co/api/v2/pokemon/954/' } }, { slot: 1, pokemon: { url: 'https://pokeapi.co/api/v2/pokemon/955/' } }] },
    9: { name: 'steel', pokemon: [{ slot: 2, pokemon: { url: 'https://pokeapi.co/api/v2/pokemon/957/' } }] },
    18: { name: 'fairy', pokemon: [{ slot: 1, pokemon: { url: 'https://pokeapi.co/api/v2/pokemon/957/' } }] }
  };
  const api = createPokeApi(async url => {
    calls.push(url);
    assert.ok(!url.includes('/pokemon/'));
    const id = url.match(/\/type\/(\d+)\//)?.[1];
    return response(id ? types[id] : { results: [7, 14, 9, 18].map(id => ({ url: `https://pokeapi.co/api/v2/type/${id}/` })) });
  });
  const [first, second] = await Promise.all([api.pokemonTypeIndex(), api.pokemonTypeIndex()]);
  assert.equal(first, second);
  assert.deepEqual(first.get(954), ['bug', 'psychic']);
  assert.deepEqual(first.get(955), ['psychic']);
  assert.deepEqual(first.get(957), ['fairy', 'steel']);
  await api.pokemonTypeIndex();
  assert.equal(calls.length, 5);
});

test('a failed type-index request can be retried', async () => {
  const [{ createPokeApi }] = await modules;
  let attempts = 0;
  const api = createPokeApi(async url => {
    if (!url.endsWith('/type/14/')) return response({ results: [{ url: 'https://pokeapi.co/api/v2/type/14/' }] });
    if (++attempts === 1) return response(null, 503);
    return response({ name: 'psychic', pokemon: [{ slot: 1, pokemon: { url: 'https://pokeapi.co/api/v2/pokemon/955/' } }] });
  });
  await assert.rejects(api.pokemonTypeIndex(), error => error.status === 503);
  assert.deepEqual((await api.pokemonTypeIndex()).get(955), ['psychic']);
  assert.equal(attempts, 2);
});

test('404 and server failures produce readable errors without parsing the body', async () => {
  const [{ createPokeApi }] = await modules;
  for (const status of [404, 503]) {
    const api = createPokeApi(async () => ({ ok: false, status, json: () => assert.fail('Do not parse a failed response') }));
    await assert.rejects(api.get('pokemon/no-such-pokemon/'), error => error.status === status && /Pokémon|PokéAPI/.test(error.message));
  }
});

test('network and malformed-data failures have useful messages', async () => {
  const [{ createPokeApi }] = await modules;
  await assert.rejects(createPokeApi(async () => { throw new TypeError('Network'); }).get('pokemon/1/'), /connection/);
  await assert.rejects(createPokeApi(async () => ({ ok: true, json: async () => { throw new SyntaxError('bad JSON'); } })).get('pokemon/1/'), /could not be read/);
});

test('API refuses untrusted resource origins', async () => {
  const [{ createPokeApi }] = await modules;
  await assert.rejects(createPokeApi(() => assert.fail('Untrusted URL must not be fetched')).get('https://example.com/'), /Invalid Pokémon/);
});

test('species default forms resolve when the Pokémon endpoint has another name', async () => {
  const [{ createPokeApi }] = await modules;
  const data = fixture('deoxys', 3, 'hoenn', 386);
  data.species.varieties = [{ is_default: true, pokemon: { url: 'https://pokeapi.co/api/v2/pokemon/deoxys-normal/' } }];
  const calls = [];
  const api = createPokeApi(async url => {
    calls.push(url);
    if (url.endsWith('/pokemon/deoxys/')) return response(null, 404);
    if (url.includes('pokemon-species/')) return response(data.species);
    if (url.endsWith('/pokemon/deoxys-normal/')) return response({ ...data.pokemon, name: 'deoxys-normal' });
    if (url.endsWith('/generation/3/')) return response(data.generation);
    assert.fail(url);
  });
  const details = await api.pokemonDetails('Deoxys');
  assert.equal(details.pokemon.name, 'deoxys-normal');
  assert.equal(details.generation.id, 3);
  assert.equal(calls.length, 4);
});

test('latest request aborts its predecessor and invalidates old responses', async () => {
  const [{ createLatestRequest }] = await modules;
  const requests = createLatestRequest();
  const older = requests.start();
  const newer = requests.start();
  assert.equal(older.signal.aborted, true);
  assert.equal(older.isCurrent(), false);
  assert.equal(newer.isCurrent(), true);
  requests.cancel();
  assert.equal(newer.isCurrent(), false);
});

test('aborted JSON responses cannot enter the API cache', async () => {
  const [{ createPokeApi }] = await modules;
  let finish;
  let calls = 0;
  const api = createPokeApi(async () => { calls++; return calls === 1 ? { ok: true, json: () => new Promise(resolve => { finish = resolve; }) } : response({ id: 2 }); });
  const controller = new AbortController();
  const pending = api.get('pokemon/1/', { signal: controller.signal });
  await flush();
  controller.abort();
  finish({ id: 1 });
  await assert.rejects(pending, { name: 'AbortError' });
  assert.deepEqual(await api.get('pokemon/1/'), { id: 2 });
  assert.equal(calls, 2);
});

test('the stats profile starts hidden and appears only after a successful lookup', async () => {
  const [, { initStatsPage }] = await modules;
  const app = setupStats(initStatsPage);
  assert.equal(app.find('.statsSection').classList.contains('hide'), true);
  await app.search('Bulbasaur');
  assert.equal(app.find('.statsSection').classList.contains('hide'), false);
  assert.equal(app.find('#search-empty').classList.contains('hide'), true);
  assert.equal(app.find('.pokemonName').textContent, 'Bulbasaur');
  assert.equal(app.find('[data-stat="hp"]').querySelector('[data-stat-value]').textContent, '100');
  assert.equal(app.find('[data-stat="attack"]').querySelector('[data-stat-value]').textContent, '120');
  assert.equal(app.find('[data-stat="speed"]').querySelector('[data-stat-value]').textContent, '0');
  assert.equal(app.find('#stats-total').textContent, '640');
  assert.equal(app.find('#evolution-grid').children.length, 2);
});

test('generation and region come from the selected species, including Gen 8 and 9', async () => {
  const [, { initStatsPage }] = await modules;
  for (const [name, generation, region, id, roman] of [['grookey', 8, 'galar', 810, 'VIII'], ['sprigatito', 9, 'paldea', 906, 'IX']]) {
    const app = setupStats(initStatsPage, client({ pokemonDetails: async () => fixture(name, generation, region, id) }));
    await app.search(name);
    assert.equal(app.find('.pokeGen').textContent, 'Generation ' + roman);
    assert.equal(app.find('.pokeRegion').textContent, region.charAt(0).toUpperCase() + region.slice(1));
  }
});

test('shiny toggle swaps artwork without another request', async () => {
  const [, { initStatsPage }] = await modules;
  let calls = 0;
  const app = setupStats(initStatsPage, client({ pokemonDetails: async () => { calls++; return fixture(); } }));
  await app.search('bulbasaur');
  app.find('#shiny-toggle').dispatch('click');
  assert.equal(app.find('#pokeImg').src, 'shiny.png');
  assert.equal(app.find('#shiny-toggle').getAttribute('aria-pressed'), 'true');
  app.find('#shiny-toggle').dispatch('click');
  assert.equal(app.find('#pokeImg').src, 'normal.png');
  assert.equal(calls, 1);
});

test('Mega buttons use the available form names and exclude other varieties', async () => {
  const [, { megaEvolutions }] = await modules;
  assert.deepEqual(megaEvolutions(charizardFixture().species), [
    { slug: 'charizard-mega-x', name: 'Mega Charizard X' },
    { slug: 'charizard-mega-y', name: 'Mega Charizard Y' }
  ]);
  const venusaur = fixture('venusaur', 1, 'kanto', 3).species;
  venusaur.varieties = [{ pokemon: { name: 'venusaur' } }, { pokemon: { name: 'venusaur-mega' } }, { pokemon: { name: 'venusaur-gmax' } }];
  assert.deepEqual(megaEvolutions(venusaur), [{ slug: 'venusaur-mega', name: 'Mega Venusaur' }]);
  assert.deepEqual(megaEvolutions(fixture('pikachu').species), []);
});

test('Pokémon without Mega Evolutions keep the Mega controls hidden', async () => {
  const [, { initStatsPage }] = await modules;
  const app = setupStats(initStatsPage);
  await app.search('bulbasaur');
  assert.equal(app.find('#mega-form-controls').classList.contains('hide'), true);
  assert.equal(app.find('#mega-form-controls').children.length, 0);
});

test('both Charizard Mega forms update the profile and preserve shiny artwork', async () => {
  const [, { initStatsPage }] = await modules;
  let calls = 0;
  const app = setupStats(initStatsPage, client({ pokemonDetails: async slug => { calls++; return charizardFixture(slug); } }));
  await app.search('charizard');
  assert.deepEqual(app.find('#mega-form-controls').children.map(toggle => toggle.textContent), ['Mega Charizard X', 'Mega Charizard Y']);
  const originalButton = app.find('[data-mega-form="charizard-mega-x"]');
  app.find('#shiny-toggle').dispatch('click');
  await app.selectMegaEvolution('charizard-mega-x');
  assert.equal(app.find('.pokemonName').textContent, 'Mega Charizard X');
  assert.equal(app.find('#profile-form').textContent, 'Mega Evolution');
  assert.equal(app.find('#pokeImg').src, 'art/shiny/charizard-mega-x.png');
  assert.equal(app.find('#pokeImg').alt, 'Shiny Mega Charizard X');
  assert.equal(app.find('#shiny-toggle').getAttribute('aria-pressed'), 'true');
  assert.equal(app.find('[data-mega-form="charizard-mega-x"]'), originalButton);
  assert.equal(originalButton.getAttribute('aria-pressed'), 'true');
  assert.deepEqual(app.find('.pokemonType').children.map(badge => badge.textContent), ['Fire', 'Dragon']);
  assert.equal(app.find('.pokeAbilit').textContent, 'Tough Claws');
  assert.equal(app.find('[data-stat="attack"]').querySelector('[data-stat-value]').textContent, '130');
  assert.equal(app.find('#stats-total').textContent, '634');
  assert.equal(app.find('#profile-weight').textContent, '110.5 kg');
  assert.equal(app.find('.pokemonId').textContent, '#006');
  assert.equal(app.find('#previous-pokemon').href, 'stats.html?pokemon=5');
  assert.equal(app.find('#next-pokemon').href, 'stats.html?pokemon=7');
  assert.equal(app.find('#pokemonInput').value, 'Mega Charizard X');
  assert.equal(app.urls.at(-1), 'stats.html?pokemon=charizard-mega-x');

  await app.selectMegaEvolution('charizard-mega-y');
  assert.equal(app.find('.pokemonName').textContent, 'Mega Charizard Y');
  assert.equal(app.find('#pokeImg').src, 'art/shiny/charizard-mega-y.png');
  assert.equal(app.find('.pokeAbilit').textContent, 'Drought');
  assert.deepEqual(app.find('.pokemonType').children.map(badge => badge.textContent), ['Fire', 'Flying']);
  assert.equal(app.find('[data-stat="special-attack"]').querySelector('[data-stat-value]').textContent, '159');
  assert.equal(originalButton.getAttribute('aria-pressed'), 'false');
  assert.equal(app.find('[data-mega-form="charizard-mega-y"]').getAttribute('aria-pressed'), 'true');
  app.find('#shiny-toggle').dispatch('click');
  assert.equal(app.find('#pokeImg').src, 'art/charizard-mega-y.png');
  app.find('#shiny-toggle').dispatch('click');
  assert.equal(app.find('#pokeImg').src, 'art/shiny/charizard-mega-y.png');
  assert.equal(calls, 3);
});

test('selecting the active Mega again returns to the regular form without clearing shiny', async () => {
  const [, { initStatsPage }] = await modules;
  const app = setupStats(initStatsPage, client({ pokemonDetails: async slug => charizardFixture(slug) }));
  await app.search('charizard');
  await app.selectMegaEvolution('charizard-mega-x');
  app.find('#shiny-toggle').dispatch('click');
  await app.selectMegaEvolution('charizard-mega-x');
  assert.equal(app.find('.pokemonName').textContent, 'Charizard');
  assert.equal(app.find('#pokeImg').src, 'art/shiny/charizard.png');
  assert.equal(app.find('#stats-total').textContent, '534');
  assert.equal(app.find('#profile-form').textContent, 'National Pokédex');
  assert.ok(app.find('#mega-form-controls').children.every(toggle => toggle.getAttribute('aria-pressed') === 'false'));
});

test('direct Mega links select the matching button and can return to the base form', async () => {
  const [, { initStatsPage }] = await modules;
  const app = setupStats(initStatsPage, client({ pokemonDetails: async slug => charizardFixture(slug) }), '?pokemon=charizard-mega-y');
  await flush();
  assert.equal(app.find('.pokemonName').textContent, 'Mega Charizard Y');
  assert.equal(app.find('[data-mega-form="charizard-mega-y"]').getAttribute('aria-pressed'), 'true');
  await app.selectMegaEvolution('charizard-mega-y');
  assert.equal(app.find('.pokemonName').textContent, 'Charizard');
});

test('rapid Mega selections keep the latest form and the latest shiny setting', async () => {
  const [, { initStatsPage }] = await modules;
  const pending = [];
  const app = setupStats(initStatsPage, client({ pokemonDetails: (slug, options) => slug === 'charizard'
    ? Promise.resolve(charizardFixture()) : new Promise(resolve => pending.push({ slug, options, resolve })) }));
  await app.search('charizard');
  const older = app.selectMegaEvolution('charizard-mega-x');
  const newer = app.selectMegaEvolution('charizard-mega-y');
  assert.equal(pending[0].options.signal.aborted, true);
  app.find('#shiny-toggle').dispatch('click');
  pending[1].resolve(charizardFixture('charizard-mega-y'));
  await newer;
  pending[0].resolve(charizardFixture('charizard-mega-x'));
  await older;
  assert.equal(app.find('.pokemonName').textContent, 'Mega Charizard Y');
  assert.equal(app.find('#pokeImg').src, 'art/shiny/charizard-mega-y.png');
  assert.equal(app.find('#mega-form-controls').getAttribute('aria-busy'), 'false');
});

test('a new Pokémon search cancels a pending Mega form without revealing stale results', async () => {
  const [, { initStatsPage }] = await modules;
  let finishMega, finishPikachu, megaSignal;
  const app = setupStats(initStatsPage, client({ pokemonDetails: (slug, options) => {
    if (slug === 'charizard') return Promise.resolve(charizardFixture());
    if (slug === 'charizard-mega-x') { megaSignal = options.signal; return new Promise(resolve => { finishMega = resolve; }); }
    return new Promise(resolve => { finishPikachu = resolve; });
  } }));
  await app.search('charizard');
  const mega = app.selectMegaEvolution('charizard-mega-x');
  const pikachu = app.search('pikachu');
  assert.equal(megaSignal.aborted, true);
  finishMega(charizardFixture('charizard-mega-x'));
  await mega;
  assert.equal(app.find('.statsSection').classList.contains('hide'), true);
  finishPikachu(fixture('pikachu', 1, 'kanto', 25));
  await pikachu;
  assert.equal(app.find('.pokemonName').textContent, 'Pikachu');
  assert.equal(app.find('#mega-form-controls').classList.contains('hide'), true);
  assert.equal(app.find('#mega-feedback').textContent, '');
});

test('a failed Mega request keeps the current profile and shiny choice, then recovers on retry', async () => {
  const [, { initStatsPage }] = await modules;
  let fail = true;
  const app = setupStats(initStatsPage, client({ pokemonDetails: async slug => {
    if (slug !== 'charizard' && fail) throw new Error('Could not load this Mega Evolution.');
    return charizardFixture(slug);
  } }));
  await app.search('charizard');
  app.find('#shiny-toggle').dispatch('click');
  await app.selectMegaEvolution('charizard-mega-x');
  assert.equal(app.find('.statsSection').classList.contains('hide'), false);
  assert.equal(app.find('.pokemonName').textContent, 'Charizard');
  assert.equal(app.find('#pokeImg').src, 'art/shiny/charizard.png');
  assert.match(app.find('#mega-feedback').textContent, /Could not load/);
  assert.equal(app.find('#mega-form-controls').getAttribute('aria-busy'), 'false');
  fail = false;
  await app.selectMegaEvolution('charizard-mega-x');
  assert.equal(app.find('#pokeImg').src, 'art/shiny/charizard-mega-x.png');
  assert.equal(app.find('#mega-feedback').textContent, '');
});

test('Mega shiny fallbacks use that form’s sprite or artwork ID', async () => {
  const [{ artworkUrl }, { initStatsPage }] = await modules;
  for (const sprite of ['mega-x-pixel-shiny.png', undefined]) {
    const mega = charizardFixture('charizard-mega-x');
    delete mega.pokemon.sprites.other['official-artwork'].front_shiny;
    mega.pokemon.sprites.front_shiny = sprite;
    const app = setupStats(initStatsPage, client({ pokemonDetails: async slug => slug === 'charizard' ? charizardFixture() : mega }));
    await app.search('charizard');
    await app.selectMegaEvolution('charizard-mega-x');
    app.find('#shiny-toggle').dispatch('click');
    assert.equal(app.find('#pokeImg').src, sprite || artworkUrl(10034, true));
    assert.equal(app.find('#pokeImg').alt, 'Shiny Mega Charizard X');
  }
});

test('failed searches hide previous results and recover on retry', async () => {
  const [{ ApiError }, { initStatsPage }] = await modules;
  let fail = false;
  const app = setupStats(initStatsPage, client({ pokemonDetails: async () => { if (fail) throw new ApiError('No Pokémon found.', 404); return fixture(); } }));
  await app.search('bulbasaur');
  fail = true;
  await app.search('missing');
  assert.equal(app.find('.statsSection').classList.contains('hide'), true);
  assert.equal(app.find('#pokemonInput').getAttribute('aria-invalid'), 'true');
  assert.match(app.find('#page-feedback').textContent, /No Pokémon/);
  fail = false;
  await app.search('bulbasaur');
  assert.equal(app.find('.statsSection').classList.contains('hide'), false);
  assert.equal(app.find('#pokemonInput').getAttribute('aria-invalid'), 'false');
});

test('blank searches never reach the API', async () => {
  const [, { initStatsPage }] = await modules;
  const app = setupStats(initStatsPage, client({ pokemonDetails: () => assert.fail('Blank lookup') }));
  await app.search('   ');
  assert.match(app.find('#page-feedback').textContent, /Enter a Pokémon/);
  assert.equal(app.find('#fetchButton').textContent, 'Fetch');
});

test('older successes and failures cannot replace the latest Pokémon', async () => {
  const [, { initStatsPage }] = await modules;
  const pending = [];
  const app = setupStats(initStatsPage, client({ pokemonDetails: (query, options) => new Promise((resolve, reject) => pending.push({ query, options, resolve, reject })) }));
  const older = app.search('bulbasaur');
  const newer = app.search('pikachu');
  assert.equal(pending[0].options.signal.aborted, true);
  pending[1].resolve(fixture('pikachu', 1, 'kanto', 25));
  await newer;
  pending[0].resolve(fixture());
  await older;
  assert.equal(app.find('.pokemonName').textContent, 'Pikachu');
  const stale = app.search('bulbasaur');
  const current = app.search('pikachu');
  pending[2].reject(new Error('Old error'));
  await stale;
  assert.equal(app.find('#fetchButton').getAttribute('aria-busy'), 'true');
  pending[3].resolve(fixture('pikachu', 1, 'kanto', 25));
  await current;
  assert.equal(app.find('#page-feedback').textContent, 'Showing Pikachu.');
});

test('a blank lookup invalidates a pending search', async () => {
  const [, { initStatsPage }] = await modules;
  let finish;
  const app = setupStats(initStatsPage, client({ pokemonDetails: () => new Promise(resolve => { finish = resolve; }) }));
  const pending = app.search('bulbasaur');
  await app.search('');
  finish(fixture());
  await pending;
  assert.match(app.find('#page-feedback').textContent, /Enter a Pokémon/);
  assert.equal(app.find('.statsSection').classList.contains('hide'), true);
});

test('deep-linked profiles fetch the requested Pokémon', async () => {
  const [, { initStatsPage }] = await modules;
  let query;
  const app = setupStats(initStatsPage, client({ pokemonDetails: async value => { query = value; return fixture(); } }), '?pokemon=1');
  await flush();
  assert.equal(query, '1');
  assert.equal(app.find('.statsSection').classList.contains('hide'), false);
});

test('menu bar clicks, touch then click, outside clicks, and Escape keep state consistent', async () => {
  const [, , { initNavigation }] = await modules;
  const document = loadPage('index.html');
  initNavigation(document);
  const toggle = document.querySelector('.navButton');
  const links = document.querySelector('.navLinks');
  toggle.querySelector('.bar').dispatch('click');
  assert.equal(links.classList.contains('active'), true);
  toggle.dispatch('touchstart'); toggle.dispatch('click');
  assert.equal(links.classList.contains('active'), false);
  toggle.dispatch('click');
  document.querySelector('main').dispatch('click');
  assert.equal(toggle.getAttribute('aria-expanded'), 'false');
  toggle.dispatch('click'); document.dispatch('keydown', { key: 'Escape' });
  assert.equal(links.classList.contains('active'), false);
  assert.equal(toggle.focused, true);
});

test('Pokédex filters match names and numeric IDs', async () => {
  const [, , , { filterSpecies }] = await modules;
  const values = [{ id: 25, name: 'Pikachu' }, { id: 1, name: 'Bulbasaur' }, { id: 122, name: 'Mr. Mime' }];
  assert.deepEqual(filterSpecies(values, '#025'), [values[0]]);
  assert.deepEqual(filterSpecies(values, 'bulba'), [values[1]]);
  assert.deepEqual(filterSpecies(values, 'mr mime'), [values[2]]);
});

test('Pokédex paginates, searches, and opens the generation from its URL', async () => {
  const [, , , { initPokedexPage }] = await modules;
  const document = loadPage('pokedex.html');
  const data = { pokemon_species: Array.from({ length: 50 }, (_, index) => ({ name: 'pokemon-' + (index + 1), url: `https://pokeapi.co/api/v2/pokemon-species/${index + 1}/` })) };
  let selected;
  initPokedexPage(document, { client: { generation: async id => { selected = id; return data; }, pokemonTypeIndex: async () => pokemonTypes }, location: { search: '?generation=8' }, history: { replaceState() {} } });
  await flush();
  assert.equal(selected, '8');
  assert.equal(document.querySelector('#dex-region').textContent, 'Galar');
  assert.equal(document.querySelector('#pokedex-grid').children.length, 24);
  document.querySelector('#dex-next').dispatch('click');
  assert.equal(document.querySelector('#dex-page').textContent, 'Page 2 of 3');
  const input = document.querySelector('#dex-search');
  input.value = '50'; input.dispatch('input');
  assert.equal(document.querySelector('#pokedex-grid').children.length, 1);
  assert.equal(document.querySelector('#pokedex-grid').children[0].href, 'stats.html?pokemon=50');
  assert.equal(document.querySelector('#pokedex-grid').children[0].querySelector('.type-badge').textContent, 'Ground');
});

test('Pokédex cards show type badges in place of region labels, including types that arrive later', async () => {
  const [, , , { initPokedexPage }] = await modules;
  const document = loadPage('pokedex.html');
  let finishTypes;
  let typeCalls = 0;
  const types = new Promise(resolve => { finishTypes = resolve; });
  const data = { pokemon_species: [{ name: 'rabsca', url: 'https://pokeapi.co/api/v2/pokemon-species/954/' }, { name: 'tinkatink', url: 'https://pokeapi.co/api/v2/pokemon-species/957/' }] };
  const app = initPokedexPage(document, { client: { generation: async () => data, pokemonTypeIndex: () => { typeCalls++; return types; } }, location: { search: '?generation=9' }, history: { replaceState() {} } });
  await flush();
  const grid = document.querySelector('#pokedex-grid');
  const rabsca = grid.children[0];
  assert.equal(grid.querySelectorAll('.card-meta').length, 0);
  assert.equal(rabsca.querySelector('.type-list').children.length, 0);
  finishTypes(new Map([[954, ['bug', 'psychic']], [957, ['fairy', 'steel']]]));
  await flush();
  assert.equal(grid.children[0], rabsca);
  assert.deepEqual(rabsca.querySelector('.type-list').children.map(badge => badge.textContent), ['Bug', 'Psychic']);
  assert.ok(rabsca.querySelector('.type-badge').classList.contains('type-bug'));
  assert.deepEqual(grid.children[1].querySelector('.type-list').children.map(badge => badge.textContent), ['Fairy', 'Steel']);
  await app.loadGeneration('9');
  assert.equal(typeCalls, 1);
  assert.equal(grid.querySelectorAll('.card-meta').length, 0);
  assert.equal(document.querySelector('#dex-region').textContent, 'Paldea');
});

test('type loading errors keep the cards usable and Reload Pokémon retries the badges', async () => {
  const [, , , { initPokedexPage }] = await modules;
  const document = loadPage('pokedex.html');
  let attempts = 0;
  initPokedexPage(document, { client: {
    generation: async () => ({ pokemon_species: [{ name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon-species/1/' }] }),
    pokemonTypeIndex: async () => { if (++attempts === 1) throw new Error('Offline'); return pokemonTypes; }
  }, location: { search: '' }, history: { replaceState() {} } });
  await flush();
  assert.equal(document.querySelector('#pokedex-grid').children.length, 1);
  assert.match(document.querySelector('#page-feedback').textContent, /types could not be loaded/);
  document.querySelector('#dex-retry').dispatch('click');
  await flush();
  assert.deepEqual(document.querySelector('#pokedex-grid').children[0].querySelector('.type-list').children.map(badge => badge.textContent), ['Grass', 'Poison']);
  assert.equal(document.querySelector('#page-feedback').textContent, '');
  assert.equal(attempts, 2);
});

test('a late type-loading failure cannot hide a generation-loading error', async () => {
  const [, , , { initPokedexPage }] = await modules;
  const document = loadPage('pokedex.html');
  let failTypes;
  initPokedexPage(document, { client: {
    generation: async () => { throw new Error('Generation data unavailable.'); },
    pokemonTypeIndex: () => new Promise((resolve, reject) => { failTypes = reject; })
  }, location: { search: '' }, history: { replaceState() {} } });
  await flush();
  failTypes(new Error('Offline'));
  await flush();
  assert.equal(document.querySelector('#page-feedback').textContent, 'Generation data unavailable.');
});

test('generation switches ignore stale Pokédex responses', async () => {
  const [, , , { initPokedexPage }] = await modules;
  const document = loadPage('pokedex.html');
  const pending = [];
  const app = initPokedexPage(document, { client: { generation: id => new Promise(resolve => pending.push({ id, resolve })), pokemonTypeIndex: async () => pokemonTypes }, location: { search: '' }, history: { replaceState() {} } });
  const current = app.loadGeneration('8');
  pending[1].resolve({ pokemon_species: [{ name: 'grookey', url: 'https://pokeapi.co/api/v2/pokemon-species/810/' }] });
  await current;
  pending[0].resolve({ pokemon_species: [{ name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon-species/1/' }] });
  await flush();
  assert.equal(document.querySelector('#pokedex-grid').children[0].href, 'stats.html?pokemon=810');
});

test('all nine generation cards have maps, working Pokédex links, and an accessible map dialog', async () => {
  const [, , , , { initGenerationsPage }, { GENERATIONS }] = await modules;
  const document = loadPage('generations.html');
  initGenerationsPage(document, { client: { generation: async () => ({ pokemon_species: [1], version_groups: [{ name: 'red-blue' }] }) } });
  await flush();
  assert.equal(document.querySelector('#generation-grid').children.length, 9);
  for (const generation of GENERATIONS) {
    assert.ok(existsSync(join(root, 'images/regions/' + generation.slug + '.png')));
    const card = document.querySelector('#region-' + generation.slug);
    assert.equal(card.querySelector('a').href, 'pokedex.html?generation=' + generation.id);
  }
  document.querySelector('.region-map-button').dispatch('click');
  const dialog = document.querySelector('#region-map-dialog');
  assert.equal(dialog.open, true);
  assert.equal(dialog.querySelector('img').src, 'images/regions/kanto.png');
  dialog.querySelector('[data-close-dialog]').dispatch('click');
  assert.equal(dialog.open, false);
});

test('branching evolution families preserve every branch and condition', async () => {
  const [, { flattenEvolution, evolutionCondition }] = await modules;
  const family = flattenEvolution({ ...chain, evolves_to: [...chain.evolves_to, { species: { name: 'venusaur', url: 'https://pokeapi.co/api/v2/pokemon-species/3/' }, evolution_details: [{ item: { name: 'leaf-stone' } }], evolves_to: [] }] });
  assert.equal(family.length, 3);
  assert.equal(evolutionCondition(family[1].details), 'Level 16');
  assert.equal(evolutionCondition(family[2].details), 'Use Leaf Stone');
});
