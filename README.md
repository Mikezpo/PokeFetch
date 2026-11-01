# PokeFetch

A Pokémon discovery website built with HTML, CSS, and JavaScript. No framework, build step, or package installation is required.

## Pages

- **Home** — search, featured Pokémon, and introductions to the regions.
- **Stats Check** (`stats.html`) — a Pokémon profile with regular/shiny artwork, named Mega Evolution controls where available, an English Pokédex entry, abilities, height, weight, all six base stats, and its evolution family.
- **Pokédex** (`pokedex.html`) — browse all Pokémon species or choose a generation, search by name or number, and move through paginated results.
- **Generations & Regions** (`generations.html`) — nine illustrated regional maps, live Pokémon counts, generation browsing links, and a full-map viewer.

Profiles remain hidden until a Pokémon is successfully selected. Profiles and generation filters support direct links, for example:

- `stats.html?pokemon=grookey`
- `stats.html?pokemon=charizard-mega-x`
- `pokedex.html?generation=8&search=grookey`
- `generations.html#region-galar`

Select a named Mega Evolution button beside the shiny toggle to switch forms. Select the active Mega button again to return to the regular form. The shiny setting is preserved across form changes, and stats, types, abilities, and dimensions update with the selected form.

## Run locally

With Node.js 18 or later:

```sh
npm start
```

Open [http://127.0.0.1:5501](http://127.0.0.1:5501). Stop the server with Ctrl+C.

If that port is occupied, run `node scripts/serve.mjs 5502`. VS Code Live Server also works. Serve the folder over HTTP because the browser loads JavaScript modules; opening an HTML file directly from the filesystem is not supported.

The included preview server serves public HTML, CSS, JavaScript, and image assets. It binds to the local computer only.

## Tests

```sh
npm test
```

The tests use Node's built-in test runner, real page markup, a small DOM test helper, and mocked API responses. They do not require internet access. They cover API normalization and caching, stat mapping, default forms, request cancellation, profile visibility, errors and retries, mobile navigation, generation filters, pagination, and map dialogs.

## Data and artwork

- Pokémon data: [PokéAPI](https://pokeapi.co/docs/v2).
- Pokémon artwork: [PokeAPI/sprites](https://github.com/PokeAPI/sprites).
- Regional maps: [The Pokémon Company's region-map collection](https://www.pokemon.com/us/news/adventure-from-kanto-to-paldea-with-the-pokemon-center-s-region-map-posters). Original sources are recorded in [images/regions/SOURCES.md](images/regions/SOURCES.md).

Successful API responses are cached in memory and, when available, session storage for 24 hours. An internet connection is needed for new Pokémon data and artwork. Regional map images are included locally.

The application code is MIT licensed. Pokémon imagery and regional maps belong to their respective rights holders and are not covered by the code license.
