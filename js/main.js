// Testing the API values to be fetched

fetch(`https://pokeapi.co/api/v2/pokemon/bisharp`)
      .then(res => res.json()) // parse response as JSON
      .then(data => {
        console.log(data.species.name);
        console.log(data.id);
        console.log(data.types[0].type.name);
        // check if type 2 is present
        // console.log(data.types[1].type.name);
        console.log(data.stats[0].stat.name);
        console.log(data.stats[0].base_stat);
        console.log(data.stats[1].stat.name);
        console.log(data.stats[1].base_stat);
        console.log(data.stats[2].stat.name);
        console.log(data.stats[2].base_stat);
        console.log(data.stats[3].stat.name);
        console.log(data.stats[3].base_stat);
        console.log(data.stats[4].stat.name);
        console.log(data.stats[4].base_stat);
        console.log(data.stats[5].stat.name);
        console.log(data.stats[5].base_stat);
        
        
        console.log(data.abilities[0].ability.name);
        console.log(data.abilities[1].ability.name);
        // check if more abilities are present

        
        console.log(data);
        console.log(data);
        console.log(data);
      })
      .catch(err => {
        console.log(`error ${err}`);
      });

// Created Object to capitalize the first letter of the input the user provides

Object.defineProperty(String.prototype, 'capitalize', {
  value: function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
  },
  enumerable: false
});

// Function to fetch API

document.addEventListener('DOMContentLoaded', function () {
  // Function for handling the fetch and processing data
  function getFetch() {
    const pokemonInput = document.querySelector('#pokemonInput').value.toLowerCase();
    const url = `https://pokeapi.co/api/v2/pokemon/${pokemonInput}`;
    let pokeStore = [];
    let pokeImg = [];
    let pokeImgShiny = [];
    
    let pokeId = [];
    let pokeType = [];
    // let pokeType = [];

    fetch(url)
      .then(res => res.json()) // parse response as JSON
      .then(data => {
        pokeStore.push(data.types.map(type => type.type.name.toLowerCase()));
        pokeImg.push(data.sprites.other["official-artwork"].front_default);
        pokeImgShiny.push(data.sprites.other["official-artwork"].front_shiny);
        
        pokeId.push(data.id);
        pokeType.push(data.types[0].type.name);

        // Declared variable to make first letter Uppercase
        let firstLetterCap = `${pokemonInput}`.capitalize();
        let typeLetterCap = data.types[0].type.name.capitalize();

        // Pokemon Images
        document.querySelector('#pokeImg').src = pokeImg[0];
        document.querySelector('#pokeImgShiny').src = pokeImgShiny[0];
        // Pokemon name
        document.querySelector('#pokeDefaultImg').innerHTML = firstLetterCap;
        document.querySelector('#pokeShinyImg').innerHTML = `Shiny ` + firstLetterCap;
        // Pokemon stats
        document.querySelector('.pokemonName').innerHTML = `Name: ` + firstLetterCap;
        document.querySelector('.pokemonId').innerHTML = `Pokemon ID: ` + pokeId;
        document.querySelector('.pokemonType').innerHTML = `Pokemon Type: ` + typeLetterCap;



      })
      .catch(err => {
        console.log(`error ${err}`);
      });
  }

  // Pokemon name list

  const pokemonNames = [
    //gen 1
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
    //gen 4
    "Turtwig", "Grotle", "Torterra", "Chimchar", "Monferno", "Infernape",
    "Piplup", "Prinplup", "Empoleon", "Starly", "Staravia", "Staraptor",
    "Bidoof", "Bibarel", "Kricketot", "Kricketune", "Shinx", "Luxio",
    "Luxray", "Budew", "Roserade", "Cranidos", "Rampardos", "Shieldon",
    "Bastiodon", "Burmy", "Wormadam", "Mothim", "Combee", "Vespiquen",
    "Pachirisu", "Buizel", "Floatzel", "Cherubi", "Cherrim", "Shellos",
    "Gastrodon", "Ambipom", "Drifloon", "Drifblim", "Buneary", "Lopunny",
    "Mismagius", "Honchkrow", "Glameow", "Purugly", "Chingling", "Stunky",
    "Skuntank", "Bronzor", "Bronzong", "Bonsly", "Mime Jr.", "Happiny",
    "Chatot", "Spiritomb", "Gible", "Gabite", "Garchomp", "Munchlax",
    "Riolu", "Lucario", "Hippopotas", "Hippowdon", "Skorupi", "Drapion",
    "Croagunk", "Toxicroak", "Carnivine", "Finneon", "Lumineon", "Mantyke",
    "Snover", "Abomasnow", "Weavile", "Magnezone", "Lickilicky", "Rhyperior",
    "Tangrowth", "Electivire", "Magmortar", "Togekiss", "Yanmega", "Leafeon",
    "Glaceon", "Gliscor", "Mamoswine", "Porygon-Z", "Gallade", "Probopass",
    "Dusknoir", "Froslass", "Rotom", "Uxie", "Mesprit", "Azelf",
    "Dialga", "Palkia", "Heatran", "Regigigas", "Giratina", "Cresselia",
    "Phione", "Manaphy", "Darkrai", "Shaymin", "Arceus",
    //gen 5
    "Snivy", "Servine", "Serperior", "Tepig", "Pignite", "Emboar",
    "Oshawott", "Dewott", "Samurott", "Patrat", "Watchog", "Lillipup",
    "Herdier", "Stoutland", "Purrloin", "Liepard", "Pansage", "Simisage",
    "Pansear", "Simisear", "Panpour", "Simipour", "Munna", "Musharna",
    "Pidove", "Tranquill", "Unfezant", "Blitzle", "Zebstrika", "Roggenrola",
    "Boldore", "Gigalith", "Woobat", "Swoobat", "Drilbur", "Excadrill",
    "Audino", "Timburr", "Gurdurr", "Conkeldurr", "Tympole", "Palpitoad",
    "Seismitoad", "Throh", "Sawk", "Sewaddle", "Swadloon", "Leavanny",
    "Venipede", "Whirlipede", "Scolipede", "Cottonee", "Whimsicott", "Petilil",
    "Lilligant", "Basculin", "Sandile", "Krokorok", "Krookodile", "Darumaka",
    "Darmanitan", "Maractus", "Dwebble", "Crustle", "Scraggy", "Scrafty",
    "Sigilyph", "Yamask", "Cofagrigus", "Tirtouga", "Carracosta", "Archen",
    "Archeops", "Trubbish", "Garbodor", "Zorua", "Zoroark", "Minccino",
    "Cinccino", "Gothita", "Gothorita", "Gothitelle", "Solosis", "Duosion",
    "Reuniclus", "Ducklett", "Swanna", "Vanillite", "Vanillish", "Vanilluxe",
    "Deerling", "Sawsbuck", "Emolga", "Karrablast", "Escavalier", "Foongus",
    "Amoonguss", "Frillish", "Jellicent", "Alomomola", "Joltik", "Galvantula",
    "Ferroseed", "Ferrothorn", "Klink", "Klang", "Klinklang", "Tynamo",
    "Eelektrik", "Eelektross", "Elgyem", "Beheeyem", "Litwick", "Lampent",
    "Chandelure", "Axew", "Fraxure", "Haxorus", "Cubchoo", "Beartic",
    "Cryogonal", "Shelmet", "Accelgor", "Stunfisk", "Mienfoo", "Mienshao",
    "Druddigon", "Golett", "Golurk", "Pawniard", "Bisharp", "Bouffalant",
    "Rufflet", "Braviary", "Vullaby", "Mandibuzz", "Heatmor", "Durant",
    "Deino", "Zweilous", "Hydreigon", "Larvesta", "Volcarona", "Cobalion",
    "Terrakion", "Virizion", "Tornadus", "Thundurus", "Reshiram", "Zekrom",
    "Landorus", "Kyurem", "Keldeo", "Meloetta", "Genesect",
    //gen 6
    "Chespin", "Quilladin", "Chesnaught", "Fennekin", "Braixen", "Delphox",
    "Froakie", "Frogadier", "Greninja", "Bunnelby", "Diggersby", "Fletchling",
    "Fletchinder", "Talonflame", "Scatterbug", "Spewpa", "Vivillon", "Litleo",
    "Pyroar", "Flabébé", "Floette", "Florges", "Skiddo", "Gogoat",
    "Pancham", "Pangoro", "Furfrou", "Espurr", "Meowstic", "Honedge",
    "Doublade", "Aegislash", "Spritzee", "Aromatisse", "Swirlix", "Slurpuff",
    "Inkay", "Malamar", "Binacle", "Barbaracle", "Skrelp", "Dragalge",
    "Clauncher", "Clawitzer", "Helioptile", "Heliolisk", "Tyrunt", "Tyrantrum",
    "Amaura", "Aurorus", "Sylveon", "Hawlucha", "Dedenne", "Carbink",
    "Goomy", "Sliggoo", "Goodra", "Klefki", "Phantump", "Trevenant",
    "Pumpkaboo", "Gourgeist", "Bergmite", "Avalugg", "Noibat", "Noivern",
    "Xerneas", "Yveltal", "Zygarde", "Diancie", "Hoopa", "Volcanion",
    //gen 7
    "Rowlet", "Dartrix", "Decidueye", "Litten", "Torracat", "Incineroar",
    "Popplio", "Brionne", "Primarina", "Pikipek", "Trumbeak", "Toucannon",
    "Yungoos", "Gumshoos", "Grubbin", "Charjabug", "Vikavolt", "Crabrawler",
    "Crabominable", "Oricorio", "Cutiefly", "Ribombee", "Rockruff", "Lycanroc",
    "Wishiwashi", "Mareanie", "Toxapex", "Mudbray", "Mudsdale", "Dewpider",
    "Araquanid", "Fomantis", "Lurantis", "Morelull", "Shiinotic", "Salandit",
    "Salazzle", "Stufful", "Bewear", "Bounsweet", "Steenee", "Tsareena",
    "Comfey", "Oranguru", "Passimian", "Wimpod", "Golisopod", "Sandygast",
    "Palossand", "Pyukumuku", "Type: Null", "Silvally", "Minior", "Komala",
    "Turtonator", "Togedemaru", "Mimikyu", "Bruxish", "Drampa", "Dhelmise",
    "Jangmo-o", "Hakamo-o", "Kommo-o", "Tapu Koko", "Tapu Lele", "Tapu Bulu",
    "Tapu Fini", "Cosmog", "Cosmoem", "Solgaleo", "Lunala", "Nihilego",
    "Buzzwole", "Pheromosa", "Xurkitree", "Celesteela", "Kartana", "Guzzlord",
    "Necrozma", "Magearna", "Marshadow", "Poipole", "Naganadel", "Stakataka",
    "Blacephalon", "Zeraora", "Meltan", "Melmetal", "Grookey", "Thwackey",
    "Rillaboom", "Scorbunny", "Raboot", "Cinderace", "Sobble", "Drizzile",
    "Inteleon", "Skwovet", "Greedent", "Rookidee", "Corvisquire", "Corviknight",
    "Blipbug", "Dottler", "Orbeetle", "Nickit", "Thievul", "Gossifleur",
    "Eldegoss", "Wooloo", "Dubwool", "Chewtle", "Drednaw", "Yamper",
    "Boltund", "Rolycoly", "Carkol", "Coalossal", "Applin", "Flapple",
    "Appletun", "Silicobra", "Sandaconda", "Cramorant", "Arrokuda", "Barraskewda",
    "Toxel", "Toxtricity", "Sizzlipede", "Centiskorch", "Clobbopus", "Grapploct",
    "Sinistea", "Polteageist", "Hatenna", "Hattrem", "Hatterene", "Impidimp",
    "Morgrem", "Grimmsnarl", "Obstagoon", "Perrserker", "Cursola", "Sirfetch'd",
    "Mr. Rime", "Runerigus", "Milcery", "Alcremie", "Falinks", "Pincurchin",
    "Snom", "Frosmoth", "Stonjourner", "Eiscue", "Indeedee", "Morpeko",
    "Cufant", "Copperajah", "Dracozolt", "Arctozolt", "Dracovish", "Arctovish",
    "Duraludon", "Dreepy", "Drakloak", "Dragapult", "Zacian", "Zamazenta",
    "Eternatus", "Kubfu", "Urshifu", "Zarude", "Regieleki", "Regidrago",
    "Glastrier", "Spectrier", "Calyrex",
    //gen 8
    "Grookey", "Thwackey", "Rillaboom", "Scorbunny", "Raboot", "Cinderace",
    "Sobble", "Drizzile", "Inteleon", "Skwovet", "Greedent", "Rookidee",
    "Corvisquire", "Corviknight", "Blipbug", "Dottler", "Orbeetle", "Nickit",
    "Thievul", "Gossifleur", "Eldegoss", "Wooloo", "Dubwool", "Chewtle",
    "Drednaw", "Yamper", "Boltund", "Rolycoly", "Carkol", "Coalossal",
    "Applin", "Flapple", "Appletun", "Silicobra", "Sandaconda", "Cramorant",
    "Arrokuda", "Barraskewda", "Toxel", "Toxtricity", "Sizzlipede", "Centiskorch",
    "Clobbopus", "Grapploct", "Sinistea", "Polteageist", "Hatenna", "Hattrem",
    "Hatterene", "Impidimp", "Morgrem", "Grimmsnarl", "Obstagoon", "Perrserker",
    "Cursola", "Sirfetch'd", "Mr. Rime", "Runerigus", "Milcery", "Alcremie",
    "Falinks", "Pincurchin", "Snom", "Frosmoth", "Stonjourner", "Eiscue",
    "Indeedee", "Morpeko", "Cufant", "Copperajah", "Dracozolt", "Arctozolt",
    "Dracovish", "Arctovish", "Duraludon", "Dreepy", "Drakloak", "Dragapult",
    "Zacian", "Zamazenta", "Eternatus"
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