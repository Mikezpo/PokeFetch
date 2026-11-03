const assert = require('node:assert/strict');
const test = require('node:test');
const { readFileSync, existsSync } = require('node:fs');
const { join } = require('node:path');
const { loadPage } = require('./dom-helper.cjs');
const root = join(__dirname, '..');
const site = 'https://mikezpo.github.io/PokeFetch/';

test('all entry pages provide distinct descriptions, branded titles, and a working social image', () => {
  const titles = new Set();
  const descriptions = new Set();
  for (const page of ['index.html', 'stats.html', 'pokedex.html', 'generations.html']) {
    const document = loadPage(page);
    const title = document.querySelector('title').textContent;
    const description = document.querySelector('[name="description"]').getAttribute('content');
    assert.match(title, /PokeFetch/);
    assert.match(description, /Pokémon/);
    titles.add(title);
    descriptions.add(description);
    assert.equal(document.querySelectorAll('h1').length, 1);
    assert.equal(document.querySelector('[property="og:title"]').getAttribute('content'), title);
    assert.equal(document.querySelector('[name="twitter:description"]').getAttribute('content'), description);
    assert.doesNotMatch(document.querySelector('[name="robots"]').getAttribute('content'), /noindex|nofollow/);
    const image = new URL(document.querySelector('[property="og:image"]').getAttribute('content'));
    assert.equal(image.origin, new URL(site).origin);
    assert.ok(existsSync(join(root, image.pathname.slice(new URL(site).pathname.length))));
  }
  assert.equal(titles.size, 4);
  assert.equal(descriptions.size, 4);
});

test('featured Pokémon and every region are readable and linked without executing JavaScript', async () => {
  const { FEATURED_POKEMON, GENERATIONS } = await import('../js/data.js');
  const home = loadPage('index.html');
  const featured = home.querySelector('#featured-grid').querySelectorAll('a');
  assert.deepEqual(featured.map(card => card.querySelector('h3').textContent), FEATURED_POKEMON.map(pokemon => pokemon.name));
  assert.ok(featured.every(card => card.href.startsWith('stats.html?pokemon=')));
  assert.equal(home.querySelector('#home-regions').querySelectorAll('a').length, 3);
  assert.equal(loadPage('stats.html').querySelector('#featured-grid').children.length, 3);
  const regions = loadPage('generations.html');
  assert.equal(regions.querySelector('#generation-grid').children.length, 9);
  for (const generation of GENERATIONS) {
    const card = regions.querySelector('#region-' + generation.slug);
    assert.equal(card.querySelector('h2').textContent, generation.region);
    assert.equal(card.querySelector('p').textContent, generation.description);
    assert.ok(existsSync(join(root, card.querySelector('.region-map-button').href)));
    assert.equal(card.querySelector('.text-link').href, 'pokedex.html?generation=' + generation.id);
  }
});

test('the sitemap covers the canonical entry pages and each distinct generation without search permutations', () => {
  const sitemap = readFileSync(join(root, 'sitemap.xml'), 'utf8');
  const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => new URL(match[1]));
  assert.equal(urls.length, 13);
  assert.equal(new Set(urls.map(url => url.href)).size, urls.length);
  for (const path of ['', 'stats.html', 'pokedex.html', 'generations.html']) {
    assert.ok(urls.some(url => url.href === site + path));
  }
  for (const generation of ['2', '3', '4', '5', '6', '7', '8', '9', 'all']) {
    assert.ok(urls.some(url => url.searchParams.get('generation') === generation));
  }
  for (const url of urls) {
    assert.equal(url.origin, new URL(site).origin);
    assert.ok(url.pathname.startsWith(new URL(site).pathname));
    assert.equal(url.hash, '');
    assert.equal(url.searchParams.has('search'), false);
    assert.ok(existsSync(join(root, url.pathname.slice(new URL(site).pathname.length) || 'index.html')));
  }
  for (const [page, path] of [['index.html', ''], ['generations.html', 'generations.html']]) {
    assert.equal(loadPage(page).querySelector('[rel="canonical"]').href, site + path);
  }
});

test('homepage structured data identifies the real app, its creator, and its public URL', () => {
  const html = readFileSync(join(root, 'index.html'), 'utf8');
  const data = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
  assert.equal(data['@type'], 'WebApplication');
  assert.equal(data.name, 'PokeFetch');
  assert.equal(data.url, site);
  assert.equal(data.creator.name, 'José Oliveira');
  assert.equal(data.creator.url, 'https://github.com/Mikezpo');
  assert.equal(data.isAccessibleForFree, true);
});
