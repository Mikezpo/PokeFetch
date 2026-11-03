const assert = require('node:assert/strict');
const test = require('node:test');
const defenses = import('../js/type-defenses.js');

async function matchups(types) {
  const { calculateTypeDefenses } = await defenses;
  return Object.fromEntries(calculateTypeDefenses(types).map(({ type, multiplier }) => [type, multiplier]));
}

test('single Fire typing has its own weaknesses and resistances', async () => {
  const values = await matchups(['fire']);
  assert.equal(Object.keys(values).length, 18);
  assert.equal(values.water, 2);
  assert.equal(values.ground, 2);
  assert.equal(values.rock, 2);
  assert.equal(values.grass, 0.5);
  assert.equal(values.fire, 0.5);
  assert.equal(values.electric, 1);
});

test('Fire and Flying match the full Charizard defense chart', async () => {
  assert.deepEqual(await matchups(['fire', 'flying']), {
    normal: 1, fire: 0.5, water: 2, electric: 2, grass: 0.25, ice: 1,
    fighting: 0.5, poison: 1, ground: 0, flying: 1, psychic: 1, bug: 0.25,
    rock: 4, ghost: 1, dragon: 1, dark: 1, steel: 0.5, fairy: 0.5
  });
});

test('Mega Charizard X Fire and Dragon typing changes weaknesses and cancels opposing modifiers', async () => {
  const values = await matchups(['fire', 'dragon']);
  assert.equal(values.fire, 0.25);
  assert.equal(values.water, 1);
  assert.equal(values.electric, 0.5);
  assert.equal(values.ice, 1);
  assert.equal(values.ground, 2);
  assert.equal(values.rock, 2);
  assert.equal(values.dragon, 2);
  assert.equal(values.fairy, 1);
});

test('dual-type immunities remain zero even when the other type is weak', async () => {
  const normalGhost = await matchups(['normal', 'ghost']);
  assert.equal(normalGhost.normal, 0);
  assert.equal(normalGhost.fighting, 0);
  assert.equal(normalGhost.ghost, 0);
  assert.equal(normalGhost.dark, 2);
  const waterGround = await matchups(['water', 'ground']);
  assert.equal(waterGround.electric, 0);
  assert.equal(waterGround.grass, 4);
  assert.equal(waterGround.water, 1);
});

test('the chart uses current Steel and Fairy relations rather than historic rules', async () => {
  const steel = await matchups(['steel']);
  assert.equal(steel.ghost, 1);
  assert.equal(steel.dark, 1);
  assert.equal(steel.poison, 0);
  assert.equal(steel.fairy, 0.5);
  const fairy = await matchups(['fairy']);
  assert.equal(fairy.dragon, 0);
  assert.equal(fairy.poison, 2);
  assert.equal(fairy.steel, 2);
});

test('duplicates do not compound damage and unsupported types do not invent neutral defenses', async () => {
  const { calculateTypeDefenses, formatDamageMultiplier } = await defenses;
  assert.deepEqual(await matchups(['fire', 'fire']), await matchups(['fire']));
  assert.deepEqual(calculateTypeDefenses([]), []);
  assert.deepEqual(calculateTypeDefenses(['stellar']), []);
  assert.deepEqual([0, 0.25, 0.5, 1, 2, 4].map(formatDamageMultiplier), ['0×', '¼×', '½×', '1×', '2×', '4×']);
});
