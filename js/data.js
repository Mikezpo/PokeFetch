export const MAP_SOURCE = 'https://www.pokemon.com/us/news/adventure-from-kanto-to-paldea-with-the-pokemon-center-s-region-map-posters';
const mapBase = 'https://www.pokemon.com/static-assets/content-assets/cms2/img/misc/_tiles/pokemon-center/2023/03272023/inline/';

export const GENERATIONS = [
  { id: 1, roman: 'I', region: 'Kanto', slug: 'kanto', starters: [1, 4, 7], description: 'The place where it all began. Set out through familiar forests, coastal towns, and the original Pokémon League.' },
  { id: 2, roman: 'II', region: 'Johto', slug: 'johto', starters: [152, 155, 158], description: 'A region of old traditions, quiet shrines, and legendary stories, just west of Kanto.' },
  { id: 3, roman: 'III', region: 'Hoenn', slug: 'hoenn', starters: [252, 255, 258], description: 'Follow the coastline through tropical forests and volcanic landscapes in a region shaped by land and sea.' },
  { id: 4, roman: 'IV', region: 'Sinnoh', slug: 'sinnoh', starters: [387, 390, 393], description: 'Ancient myths meet snowy peaks, deep lakes, and the towering slopes of Mount Coronet.' },
  { id: 5, roman: 'V', region: 'Unova', slug: 'unova', starters: [495, 498, 501], description: 'Discover busy cities, long bridges, and the wild places that connect them.' },
  { id: 6, roman: 'VI', region: 'Kalos', slug: 'kalos', starters: [650, 653, 656], description: 'Take the scenic route through elegant cities, flowering gardens, and the streets of Lumiose City.' },
  { id: 7, roman: 'VII', region: 'Alola', slug: 'alola', starters: [722, 725, 728], description: 'An island adventure filled with coastal trails, tropical Pokémon, and a different kind of challenge.' },
  { id: 8, roman: 'VIII', region: 'Galar', slug: 'galar', starters: [810, 813, 816], description: 'Explore open countryside and lively cities, with stadium battles at the heart of the journey.', note: 'Generation VIII also introduced Pokémon from Hisui, the ancient Sinnoh region.' },
  { id: 9, roman: 'IX', region: 'Paldea', slug: 'paldea', starters: [906, 909, 912], description: 'Choose your own path across an open landscape of mountains, beaches, and wide, sunlit plains.' }
].map(generation => ({ ...generation, map: mapBase + generation.slug + '.png' }));

export const FEATURED_POKEMON = [
  { id: 1, name: 'Bulbasaur', types: ['grass', 'poison'], generation: 1 },
  { id: 4, name: 'Charmander', types: ['fire'], generation: 1 },
  { id: 7, name: 'Squirtle', types: ['water'], generation: 1 },
  { id: 25, name: 'Pikachu', types: ['electric'], generation: 1 },
  { id: 133, name: 'Eevee', types: ['normal'], generation: 1 },
  { id: 94, name: 'Gengar', types: ['ghost', 'poison'], generation: 1 }
];

export function generationInfo(id) {
  return GENERATIONS.find(generation => generation.id === Number(id));
}
