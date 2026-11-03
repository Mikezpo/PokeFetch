// Current standard type relations from https://pokeapi.co/api/v2/type/{name}/
// All 324 single-type matchups cross-checked against https://pokemondb.net/type.
// Verified 2026-11-03. Past-generation relations and battle modifiers are excluded.
// A local snapshot keeps defenses available without extra requests per Pokémon.
export const ATTACK_TYPES = Object.freeze(['normal', 'fire', 'water', 'electric', 'grass', 'ice', 'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy']);

const TYPE_DEFENSES = {
  normal: {
    weak: ['fighting'],
    resistant: [],
    immune: ['ghost']
  },
  fire: {
    weak: ['ground', 'rock', 'water'],
    resistant: ['bug', 'steel', 'fire', 'grass', 'ice', 'fairy'],
    immune: []
  },
  water: {
    weak: ['grass', 'electric'],
    resistant: ['steel', 'fire', 'water', 'ice'],
    immune: []
  },
  electric: {
    weak: ['ground'],
    resistant: ['flying', 'steel', 'electric'],
    immune: []
  },
  grass: {
    weak: ['flying', 'poison', 'bug', 'fire', 'ice'],
    resistant: ['ground', 'water', 'grass', 'electric'],
    immune: []
  },
  ice: {
    weak: ['fighting', 'rock', 'steel', 'fire'],
    resistant: ['ice'],
    immune: []
  },
  fighting: {
    weak: ['flying', 'psychic', 'fairy'],
    resistant: ['rock', 'bug', 'dark'],
    immune: []
  },
  poison: {
    weak: ['ground', 'psychic'],
    resistant: ['fighting', 'poison', 'bug', 'grass', 'fairy'],
    immune: []
  },
  ground: {
    weak: ['water', 'grass', 'ice'],
    resistant: ['poison', 'rock'],
    immune: ['electric']
  },
  flying: {
    weak: ['rock', 'electric', 'ice'],
    resistant: ['fighting', 'bug', 'grass'],
    immune: ['ground']
  },
  psychic: {
    weak: ['bug', 'ghost', 'dark'],
    resistant: ['fighting', 'psychic'],
    immune: []
  },
  bug: {
    weak: ['flying', 'rock', 'fire'],
    resistant: ['fighting', 'ground', 'grass'],
    immune: []
  },
  rock: {
    weak: ['fighting', 'ground', 'steel', 'water', 'grass'],
    resistant: ['normal', 'flying', 'poison', 'fire'],
    immune: []
  },
  ghost: {
    weak: ['ghost', 'dark'],
    resistant: ['poison', 'bug'],
    immune: ['normal', 'fighting']
  },
  dragon: {
    weak: ['ice', 'dragon', 'fairy'],
    resistant: ['fire', 'water', 'grass', 'electric'],
    immune: []
  },
  dark: {
    weak: ['fighting', 'bug', 'fairy'],
    resistant: ['ghost', 'dark'],
    immune: ['psychic']
  },
  steel: {
    weak: ['fighting', 'ground', 'fire'],
    resistant: ['normal', 'flying', 'rock', 'bug', 'steel', 'grass', 'psychic', 'ice', 'dragon', 'fairy'],
    immune: ['poison']
  },
  fairy: {
    weak: ['poison', 'steel'],
    resistant: ['fighting', 'bug', 'dark'],
    immune: ['dragon']
  },
};

export function calculateTypeDefenses(defendingTypes) {
  const types = [...new Set(defendingTypes)];
  if (!types.length || !types.every(type => Object.hasOwn(TYPE_DEFENSES, type))) return [];
  return ATTACK_TYPES.map(type => ({
    type,
    multiplier: types.reduce((damage, defender) => {
      const relation = TYPE_DEFENSES[defender];
      if (relation.immune.includes(type)) return 0;
      if (relation.weak.includes(type)) return damage * 2;
      if (relation.resistant.includes(type)) return damage / 2;
      return damage;
    }, 1)
  }));
}

export function formatDamageMultiplier(multiplier) {
  if (multiplier === 0.25) return '¼×';
  if (multiplier === 0.5) return '½×';
  return `${multiplier}×`;
}

