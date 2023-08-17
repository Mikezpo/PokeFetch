// fetch('https://pokeapi.co/api/v2/pokemon/')
//       .then(res => res.json()) // parse response as JSON
//       .then(data => {
//         console.log(data.types[1].type.name);
//       })
//       .catch(err => {
//         console.log(`error ${err}`);
//       });

document.addEventListener('DOMContentLoaded', function () {
  // Function for handling the fetch and processing data
  function getFetch() {
    const pokemonInput = document.querySelector('#pokemonInput').value.toLowerCase();
    const url = `https://pokeapi.co/api/v2/pokemon/${pokemonInput}`;
    let pokeStore = [];
    let pokeImg = [];

    fetch(url)
      .then(res => res.json()) // parse response as JSON
      .then(data => {
        pokeStore.push(data.types.map(type => type.type.name.toLowerCase()));
        pokeImg.push(data.sprites.front_shiny);
        document.querySelector('#pokeImg').src = pokeImg[0];
      })
      .catch(err => {
        console.log(`error ${err}`);
      });
  }

  // Pokemon name list

  const pokemonNames = [
    "Bulbasaur", "Ivysaur", "Venusaur", "Charmander", "Charmeleon", "Charizard",
    "Squirtle", "Wartortle", "Blastoise", "Caterpie", "Metapod", "Butterfree",
    "Weedle", "Kakuna", "Beedrill", "Pidgey", "Pidgeotto", "Pidgeot",
    "Rattata", "Raticate", "Spearow", "Fearow", "Ekans", "Arbok",
    "Pikachu", "Raichu", "Sandshrew", "Sandslash", "Nidoran♀", "Nidorina",
    "Nidoqueen", "Nidoran♂", "Nidorino", "Nidoking", "Clefairy", "Clefable",
    "Vulpix", "Ninetales", "Jigglypuff", "Wigglytuff", "Zubat", "Golbat",
    "Oddish", "Gloom", "Vileplume", "Paras", "Parasect", "Venonat",
    "Venomoth", "Diglett", "Dugtrio", "Meowth", "Persian", "Psyduck",
    "Golduck", "Mankey", "Primeape", "Growlithe", "Arcanine", "Poliwag",
    "Poliwhirl", "Poliwrath", "Abra", "Kadabra", "Alakazam", "Machop",
    "Machoke", "Machamp", "Bellsprout", "Weepinbell", "Victreebel", "Tentacool",
    "Tentacruel", "Geodude", "Graveler", "Golem", "Ponyta", "Rapidash",
    "Slowpoke", "Slowbro", "Magnemite", "Magneton", "Farfetch'd", "Doduo",
    "Dodrio", "Seel", "Dewgong", "Grimer", "Muk", "Shellder",
    "Cloyster", "Gastly", "Haunter", "Gengar", "Onix", "Drowzee",
    "Hypno", "Krabby", "Kingler", "Voltorb", "Electrode", "Exeggcute",
    "Exeggutor", "Cubone", "Marowak", "Hitmonlee", "Hitmonchan", "Lickitung",
    "Koffing", "Weezing", "Rhyhorn", "Rhydon", "Chansey", "Tangela",
    "Kangaskhan", "Horsea", "Seadra", "Goldeen", "Seaking", "Staryu",
    "Starmie", "Mr. Mime", "Scyther", "Jynx", "Electabuzz", "Magmar",
    "Pinsir", "Tauros", "Magikarp", "Gyarados", "Lapras", "Ditto",
    "Eevee", "Vaporeon", "Jolteon", "Flareon", "Porygon", "Omanyte",
    "Omastar", "Kabuto", "Kabutops", "Aerodactyl", "Snorlax", "Articuno",
    "Zapdos", "Moltres", "Dratini", "Dragonair", "Dragonite", "Mewtwo",
    "Mew",
    //gen 2
    "Chikorita", "Bayleef", "Meganium", "Cyndaquil", "Quilava", "Typhlosion",
    "Totodile", "Croconaw", "Feraligatr", "Sentret", "Furret", "Hoothoot",
    "Noctowl", "Ledyba", "Ledian", "Spinarak", "Ariados", "Crobat",
    "Chinchou", "Lanturn", "Pichu", "Cleffa", "Igglybuff", "Togepi",
    "Togetic", "Natu", "Xatu", "Mareep", "Flaaffy", "Ampharos",
    "Bellossom", "Marill", "Azumarill", "Sudowoodo", "Politoed", "Hoppip",
    "Skiploom", "Jumpluff", "Aipom", "Sunkern", "Sunflora", "Yanma",
    "Wooper", "Quagsire", "Espeon", "Umbreon", "Murkrow", "Slowking",
    "Misdreavous", "Unown", "Wobbuffet", "Girafarig", "Pineco", "Forretress",
    "Dunsparce", "Gligar", "Steelix", "Snubbull", "Granbull", "Qwilfish",
    "Scizor", "Shuckle", "Heracross", "Sneasel", "Teddiursa", "Ursaring",
    "Slugma", "Magcargo", "Swinub", "Piloswine", "Corsola", "Remoraid",
    "Octillery", "Delibird", "Mantine", "Skarmory", "Houndour", "Houndoom",
    "Kingdra", "Phanpy", "Donphan", "Porygon2", "Stantler", "Smeargle",
    "Tyrogue", "Hitmontop", "Smoochum", "Elekid", "Magby", "Miltank",
    "Blissey", "Raikou", "Entei", "Suicune", "Larvitar", "Pupitar",
    "Tyranitar", "Lugia", "Ho-Oh", "Celebi",
    //gen 3
    "Treecko", "Grovyle", "Sceptile", "Torchic", "Combusken", "Blaziken",
    "Mudkip", "Marshtomp", "Swampert", "Poochyena", "Mightyena", "Zigzagoon",
    "Linoone", "Wurmple", "Silcoon", "Beautifly", "Cascoon", "Dustox",
    "Lotad", "Lombre", "Ludicolo", "Seedot", "Nuzleaf", "Shiftry",
    "Taillow", "Swellow", "Wingull", "Pelipper", "Ralts", "Kirlia",
    "Gardevoir", "Surskit", "Masquerain", "Shroomish", "Breloom", "Slakoth",
    "Vigoroth", "Slaking", "Nincada", "Ninjask", "Shedinja", "Whismur",
    "Loudred", "Exploud", "Makuhita", "Hariyama", "Azurill", "Nosepass",
    "Skitty", "Delcatty", "Sableye", "Mawile", "Aron", "Lairon",
    "Aggron", "Meditite", "Medicham", "Electrike", "Manectric", "Plusle",
    "Minun", "Volbeat", "Illumise", "Roselia", "Gulpin", "Swalot",
    "Carvanha", "Sharpedo", "Wailmer", "Wailord", "Numel", "Camerupt",
    "Torkoal", "Spoink", "Grumpig", "Spinda", "Trapinch", "Vibrava",
    "Flygon", "Cacnea", "Cacturne", "Swablu", "Altaria", "Zangoose",
    "Seviper", "Lunatone", "Solrock", "Barboach", "Whiscash", "Corphish",
    "Crawdaunt", "Baltoy", "Claydol", "Lileep", "Cradily", "Anorith",
    "Armaldo", "Feebas", "Milotic", "Castform", "Kecleon", "Shuppet",
    "Banette", "Duskull", "Dusclops", "Tropius", "Chimecho", "Absol",
    "Wynaut", "Snorunt", "Glalie", "Spheal", "Sealeo", "Walrein",
    "Clamperl", "Huntail", "Gorebyss", "Relicanth", "Luvdisc", "Bagon",
    "Shelgon", "Salamence", "Beldum", "Metang", "Metagross", "Regirock",
    "Regice", "Registeel", "Latias", "Latios", "Kyogre", "Groudon",
    "Rayquaza", "Jirachi", "Deoxys",
    // gen 4
    

];

const pokemonList = document.getElementById("pokemonList");

pokemonNames.forEach(name => {
    const option = document.createElement("option");
    option.value = name;
    pokemonList.appendChild(option);
});

// EVENT LISTENERS

// Add event listener to the "Fetch" button
const compareButton = document.querySelector('button[name="button"]');
compareButton.addEventListener('click', getFetch);

// Add event listeners to all elements with class 'inputValue' for pressing "Enter"
const inputValues = document.querySelectorAll('.inputValue');
inputValues.forEach(inputValue => {
  inputValue.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
      getFetch();
    }
  });
});
});

// Old code for Pokemon type comparison

// Function to calculate type effectiveness
// function calculateTypeEffectiveness(pokeTypes) {
  // Type chart with effectiveness multipliers
  // const typeChart = {
  //   normal: { normal: 1, fire: 1, water: 1, electric: 1, grass: 1, ice: 1, fighting: 2, poison: 1, ground: 1, flying: 1, psychic: 1, bug: 1, rock: 1, ghost: 0, dragon: 1, dark: 1, steel: 1, fairy: 1 },

  //   fire: { normal: 1, fire: 0.5, water: 0.5, electric: 1, grass: 2, ice: 2, fighting: 1, poison: 1, ground: 1, flying: 1, psychic: 1, bug: 2, rock: 0.5, ghost: 1, dragon: 0.5, dark: 1, steel: 2, fairy: 1 },

  //   water: { normal: 1, fire: 2, water: 0.5, electric: 1, grass: 0.5, ice: 1, fighting: 1, poison: 1, ground: 2, flying: 1, psychic: 1, bug: 1, rock: 2, ghost: 1, dragon: 0.5, dark: 1, steel: 1, fairy: 1 },

  //   electric: { normal: 1, fire: 1, water: 2, electric: 0.5, grass: 0.5, ice: 1, fighting: 1, poison: 1, ground: 0, flying: 2, psychic: 1, bug: 1, rock: 1, ghost: 1, dragon: 0.5, dark: 1, steel: 1, fairy: 1 },

  //   grass: { normal: 1, fire: 0.5, water: 2, electric: 1, grass: 0.5, ice: 1, fighting: 1, poison: 0.5, ground: 2, flying: 0.5, psychic: 1, bug: 0.5, rock: 2, ghost: 1, dragon: 0.5, dark: 1, steel: 0.5, fairy: 1 },

  //   ice: { normal: 1, fire: 0.5, water: 0.5, electric: 1, grass: 2, ice: 0.5, fighting: 1, poison: 1, ground: 2, flying: 2, psychic: 1, bug: 1, rock: 1, ghost: 1, dragon: 2, dark: 1, steel: 0.5, fairy: 1 },

  //   fighting: { normal: 2, fire: 1, water: 1, electric: 1, grass: 1, ice: 1, fighting: 1, poison: 0.5, ground: 1, flying: 0.5, psychic: 0.5, bug: 0.5, rock: 2, ghost: 0, dragon: 1, dark: 2, steel: 2, fairy: 0.5 },

  //   poison: { normal: 1, fire: 1, water: 1, electric: 1, grass: 2, ice: 1, fighting: 1, poison: 0.5, ground: 0.5, flying: 1, psychic: 2, bug: 1, rock: 1, ghost: 0.5, dragon: 1, dark: 1, steel: 0, fairy: 2 },

  //   ground: { normal: 1, fire: 2, water: 1, electric: 2, grass: 0.5, ice: 1, fighting: 1, poison: 2, ground: 1, flying: 0, psychic: 1, bug: 0.5, rock: 2, ghost: 1, dragon: 1, dark: 1, steel: 2, fairy: 1 },

  //   flying: { normal: 1, fire: 1, water: 1, electric: 0.5, grass: 2, ice: 1, fighting: 2, poison: 1, ground: 1, flying: 1, psychic: 1, bug: 2, rock: 0.5, ghost: 1, dragon: 1, dark: 1, steel: 0.5, fairy: 1 },

  //   psychic: { normal: 1, fire: 1, water: 1, electric: 1, grass: 1, ice: 1, fighting: 2, poison: 2, ground: 1, flying: 1, psychic: 0.5, bug: 1, rock: 1, ghost: 1, dragon: 1, dark: 0, steel: 0.5, fairy: 1 },

  //   bug: { normal: 1, fire: 0.5, water: 1, electric: 1, grass: 2, ice: 1, fighting: 0.5, poison: 0.5, ground: 1, flying: 0.5, psychic: 2, bug: 1, rock: 1, ghost: 0.5, dragon: 1, dark: 2, steel: 0.5, fairy: 0.5 },

  //   rock: { normal: 1, fire: 2, water: 1, electric: 1, grass: 1, ice: 2, fighting: 0.5, poison: 1, ground: 0.5, flying: 2, psychic: 1, bug: 2, rock: 1, ghost: 1, dragon: 1, dark: 1, steel: 0.5, fairy: 1 },

  //   ghost: { normal: 0, fire: 1, water: 1, electric: 1, grass: 1, ice: 1, fighting: 1, poison: 1, ground: 1, flying: 1, psychic: 1, bug: 1, rock: 1, ghost: 2, dragon: 1, dark: 2, steel: 1, fairy: 1 },

  //   dragon: { normal: 1, fire: 1, water: 1, electric: 1, grass: 1, ice: 1, fighting: 1, poison: 1, ground: 1, flying: 1, psychic: 1, bug: 1, rock: 1, ghost: 1, dragon: 2, dark: 1, steel: 0.5, fairy: 2 },

  //   dark: { normal: 1, fire: 1, water: 1, electric: 1, grass: 1, ice: 1, fighting: 0.5, poison: 1, ground: 1, flying: 1, psychic: 2, bug: 1, rock: 1, ghost: 2, dragon: 1, dark: 0.5, steel: 1, fairy: 0.5 },

  //   steel: { normal: 1, fire: 0.5, water: 0.5, electric: 0.5, grass: 1, ice: 2, fighting: 1, poison: 1, ground: 1, flying: 1, psychic: 1, bug: 1, rock: 2, ghost: 1, dragon: 1, dark: 1, steel: 0.5, fairy: 2 },

  //   fairy: { normal: 1, fire: 0.5, water: 1, electric: 1, grass: 1, ice: 1, fighting: 2, poison: 0.5, ground: 1, flying: 1, psychic: 1, bug: 1, rock: 1, ghost: 1, dragon: 0, dark: 2, steel: 0.5, fairy: 1 },
  // };

  // Calculate effectiveness
  // let effectiveness = 1;
  // for (let i = 0; i < pokeTypes[0].length; i++) {
  //   for (let j = 0; j < pokeTypes[1].length; j++) {
  //     const attackingType = pokeTypes[0][i];
  //     const defendingType = pokeTypes[1][j];
  //     effectiveness *= typeChart[attackingType][defendingType];
  //   }
  // }

  // Determine the result message based on effectiveness
//   if (effectiveness === 0) {
//     return 'No effect - 0% damage';
//   } else if (effectiveness < 1) {
//     return 'Not very effective - 50% damage';
//   } else if (effectiveness === 1) {
//     return 'Normal - 100% damage';
//   } else if (effectiveness > 1) {
//     return 'Super effective - 200% damage';
//   }
// }