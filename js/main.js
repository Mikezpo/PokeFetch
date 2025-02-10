// NAVBAR

const toggleButton = document.getElementsByClassName('navButton')[0];
const navbarLinks = document.getElementsByClassName('navLinks')[0];

toggleButton.checked = false;

// Add click event listener to each menu item
const menuItems = document.querySelectorAll('.menu-list a');
for (const item of menuItems) {
  item.addEventListener('click', () => {
    // Close the menu when an item is clicked
    navbarLinks.classList.remove('active');
    toggleButton.checked = false;
  });
}

const toggleMenu = () => {
  const isActive = navbarLinks.classList.toggle('active');
  toggleButton.setAttribute('aria-expanded', isActive);
}

toggleButton.addEventListener('click', toggleMenu);
toggleButton.addEventListener('touchstart', toggleMenu);

// Close the menu when clicking outside of it
document.addEventListener('click', (event) => {
  const isClickInsideMenu = navbarLinks.contains(event.target);
  const isClickOnButton = event.target === toggleButton;

  if (!isClickInsideMenu && !isClickOnButton) {
    navbarLinks.classList.remove('active');
    toggleButton.checked = false;
  }
});


// Testing the API values to be fetched

fetch(`https://pokeapi.co/api/v2/pokemon/charizard`)
      .then(res => res.json()) // parse response as JSON
      .then(data => {
        console.log(data.species.name);
        console.log(data.id);
        console.log(data.types[0].type.name);
        // it gives error when allowing more than one type since some pokemons only have one type
        // create for loop conditional to check if another pokemon type is present
        if (data.types[1]) {
          console.log(data.types[1].type.name);
        }        
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
        // create for loop conditional to check if more abilities are present

        
        console.log(data);
        console.log(data);
        console.log(data);
      })
      .catch(err => {
        console.log(`error ${err}`);
      });

      
// Created function to capitalize strings

String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
}

// Function to fetch API

document.addEventListener('DOMContentLoaded', function () {
  // Function for handling the fetch and processing data
  function fetchPokemonData() {
    let pokemonInput = document.querySelector('#pokemonInput').value.toLowerCase();
    const url = `https://pokeapi.co/api/v2/pokemon/${pokemonInput}`;
    let pokeStore = [];
    let pokeImg;
    let pokeImgShiny;
    let pokeId;
    let pokeAtt;
    let pokeDef;
    let pokeHp;
    let specAtt;
    let specDef;
    let pokeSpeed;

    // Find the generation and region for the given Pokémon name
    const generationAndRegion = pokemonNames.find(gen => gen.names.map(name => name.toLowerCase()).includes(pokemonInput));

    const generation = generationAndRegion ? generationAndRegion.generation : 'Unknown';
    const region = generationAndRegion ? generationAndRegion.region : 'Unknown';


    fetch(url)
      .then(res => res.json()) // parse response as JSON
      .then(data => {
        pokeStore.push(data.types.map(type => type.type.name.toLowerCase()));
        pokeImg = data.sprites.other["official-artwork"].front_default;
        pokeImgShiny = data.sprites.other["official-artwork"].front_shiny;
        
        pokeId = data.id;
        pokeAtt = data.stats[0].base_stat;
        pokeDef = data.stats[1].base_stat;

        pokeHp = data.stats[2].base_stat;
        specAtt = data.stats[3].base_stat;
        specDef = data.stats[4].base_stat;
        pokeSpeed = data.stats[5].base_stat;

        // Loop through pokemon types
        // Get the <ul> element for pokemon type
        const pokeType = document.querySelector('.pokemonType');

        // Clear any existing content inside the type list
        while (pokeType.firstChild) {
          pokeType.removeChild(pokeType.firstChild);
      }      

        // Loop through types and create <li> elements
        for(let i= 0; i < data.types.length; i++) {
          const pokemonType = data.types[i].type.name.capitalize();
          // Create new <li> element
          const pokemonTypeList = document.createElement('li');
          pokemonTypeList.textContent = pokemonType;

          // Add a class to the <li> element based on the type
          pokemonTypeList.classList.add(`type-${pokemonType.toLowerCase()}`);

          //Append the <li> element to the type list
          pokeType.appendChild(pokemonTypeList);
        }
        
        // Loop through pokemon abilities
        // Get the <ul> element for abilities
        const abilitiesList = document.querySelector('.pokeAbilit');

        // Clear any existing content inside the abilities list
        
        while (abilitiesList.firstChild) {
          abilitiesList.removeChild(abilitiesList.firstChild);
      }      

        // Loop through abilities and create <li> elements
        for (let i = 0; i < data.abilities.length; i++) {
          const abilityName = data.abilities[i].ability.name.capitalize();
          
          // Create a new <li> element
          const abilityListItem = document.createElement('li');
          abilityListItem.textContent = abilityName;

          // Append the <li> element to the abilities list
          abilitiesList.appendChild(abilityListItem);
        }

        // Declared variable to make first letter Uppercase
        let firstLetterCap = `${pokemonInput}`.capitalize();

        // Pokemon Images
        document.querySelector('#pokeImg').src = pokeImg;
        document.querySelector('#pokeImgShiny').src = pokeImgShiny;
        // Pokemon name
        document.querySelector('#pokeDefaultImg').textContent = firstLetterCap;
        document.querySelector('#pokeShinyImg').textContent = `Shiny ` + firstLetterCap;
        // Pokemon stats
        document.querySelector('.pokemonName').textContent = firstLetterCap;
        document.querySelector('.pokemonId').textContent = pokeId;
        document.querySelector('.pokeAtt').textContent = pokeAtt;
        document.querySelector('.pokeDef').textContent = pokeDef;
        document.querySelector('.pokeHp').textContent = pokeHp;
        document.querySelector('.specAtt').textContent = specAtt;
        document.querySelector('.specDef').textContent = specDef;
        document.querySelector('.pokeSpeed').textContent = pokeSpeed;

        document.querySelector('.pokeGen').textContent = generation;
        document.querySelector('.pokeRegion').textContent = region;
      })

      // Display the generation and region information
      

      .catch(err => {
        console.log(`error ${err}`);
        // document.querySelector('.errorMessage').textContent = 'An error occurred';
    });
    
  }

  // Pokemon name list

  const pokemonNames = [
    //gen 1
    { names: ["Bulbasaur", "Ivysaur", "Venusaur", "Charmander", "Charmeleon", "Charizard",
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
    "Mew"], generation: 1, region: "Kanto" },

    //gen 2
    { names: ["Chikorita", "Bayleef", "Meganium", "Cyndaquil", "Quilava", "Typhlosion",
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
    "Tyranitar", "Lugia", "Ho-Oh", "Celebi"], generation: 2, region: "Johto" },
    
    //gen 3
    { names: ["Treecko", "Grovyle", "Sceptile", "Torchic", "Combusken", "Blaziken",
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
    "Rayquaza", "Jirachi", "Deoxys",], generation: 3, region: "Hoenn" },

    //gen 4
    { names: ["Turtwig", "Grotle", "Torterra", "Chimchar", "Monferno", "Infernape",
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
    "Phione", "Manaphy", "Darkrai", "Shaymin", "Arceus",], generation: 4, region: "Sinnoh" },

    //gen 5
    { names: ["Snivy", "Servine", "Serperior", "Tepig", "Pignite", "Emboar",
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
    "Landorus", "Kyurem", "Keldeo", "Meloetta", "Genesect",], generation: 5, region: "Unova" },
    //gen 6
    { names: ["Chespin", "Quilladin", "Chesnaught", "Fennekin", "Braixen", "Delphox",
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
    "Xerneas", "Yveltal", "Zygarde", "Diancie", "Hoopa", "Volcanion",], generation: 6, region: "Kalos" },
    //gen 7
    { names: ["Rowlet", "Dartrix", "Decidueye", "Litten", "Torracat", "Incineroar",
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
    "Glastrier", "Spectrier", "Calyrex",], generation: 7, region: "Alola" },
    //gen 8
    { names: ["Grookey", "Thwackey", "Rillaboom", "Scorbunny", "Raboot", "Cinderace",
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
    "Zacian", "Zamazenta", "Eternatus"], generation: 8, region: "Galar" },
];

const pokemonList = document.getElementById("pokemonList");

// Loop through each generation
pokemonNames.forEach(generation => {
  // Loop through each Pokémon name in the generation
  generation.names.forEach(pokemonName => {
    const option = document.createElement("option");
    option.value = pokemonName; // Set the value to the Pokémon name
    option.textContent = pokemonName; // Set the displayed text to the Pokémon name
    pokemonList.appendChild(option);
  });
});


// EVENT LISTENERS

// Add event listener to the "Fetch" button
const compareButton = document.querySelector('button[name="button"]');
compareButton.addEventListener('click', fetchPokemonData);

// Add event listeners to all elements with class 'inputValue' for pressing "Enter"
const inputValues = document.querySelectorAll('.inputValue');
inputValues.forEach(inputValue => {
  inputValue.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
      fetchPokemonData();
    }
  });
});
});

// Old code for Pokemon type comparison

// Function to calculate type effectiveness
function calculateTypeEffectiveness(pokeTypes) {
//  Type chart with effectiveness multipliers
  const typeChart = {
    normal: { normal: 1, fire: 1, water: 1, electric: 1, grass: 1, ice: 1, fighting: 2, poison: 1, ground: 1, flying: 1, psychic: 1, bug: 1, rock: 1, ghost: 0, dragon: 1, dark: 1, steel: 1, fairy: 1 },

    fire: { normal: 1, fire: 0.5, water: 0.5, electric: 1, grass: 2, ice: 2, fighting: 1, poison: 1, ground: 1, flying: 1, psychic: 1, bug: 2, rock: 0.5, ghost: 1, dragon: 0.5, dark: 1, steel: 2, fairy: 1 },

    water: { normal: 1, fire: 2, water: 0.5, electric: 1, grass: 0.5, ice: 1, fighting: 1, poison: 1, ground: 2, flying: 1, psychic: 1, bug: 1, rock: 2, ghost: 1, dragon: 0.5, dark: 1, steel: 1, fairy: 1 },

    electric: { normal: 1, fire: 1, water: 2, electric: 0.5, grass: 0.5, ice: 1, fighting: 1, poison: 1, ground: 0, flying: 2, psychic: 1, bug: 1, rock: 1, ghost: 1, dragon: 0.5, dark: 1, steel: 1, fairy: 1 },

    grass: { normal: 1, fire: 0.5, water: 2, electric: 1, grass: 0.5, ice: 1, fighting: 1, poison: 0.5, ground: 2, flying: 0.5, psychic: 1, bug: 0.5, rock: 2, ghost: 1, dragon: 0.5, dark: 1, steel: 0.5, fairy: 1 },

    ice: { normal: 1, fire: 0.5, water: 0.5, electric: 1, grass: 2, ice: 0.5, fighting: 1, poison: 1, ground: 2, flying: 2, psychic: 1, bug: 1, rock: 1, ghost: 1, dragon: 2, dark: 1, steel: 0.5, fairy: 1 },

    fighting: { normal: 2, fire: 1, water: 1, electric: 1, grass: 1, ice: 1, fighting: 1, poison: 0.5, ground: 1, flying: 0.5, psychic: 0.5, bug: 0.5, rock: 2, ghost: 0, dragon: 1, dark: 2, steel: 2, fairy: 0.5 },

    poison: { normal: 1, fire: 1, water: 1, electric: 1, grass: 2, ice: 1, fighting: 1, poison: 0.5, ground: 0.5, flying: 1, psychic: 2, bug: 1, rock: 1, ghost: 0.5, dragon: 1, dark: 1, steel: 0, fairy: 2 },

    ground: { normal: 1, fire: 2, water: 1, electric: 2, grass: 0.5, ice: 1, fighting: 1, poison: 2, ground: 1, flying: 0, psychic: 1, bug: 0.5, rock: 2, ghost: 1, dragon: 1, dark: 1, steel: 2, fairy: 1 },

    flying: { normal: 1, fire: 1, water: 1, electric: 0.5, grass: 2, ice: 1, fighting: 2, poison: 1, ground: 1, flying: 1, psychic: 1, bug: 2, rock: 0.5, ghost: 1, dragon: 1, dark: 1, steel: 0.5, fairy: 1 },

    psychic: { normal: 1, fire: 1, water: 1, electric: 1, grass: 1, ice: 1, fighting: 2, poison: 2, ground: 1, flying: 1, psychic: 0.5, bug: 1, rock: 1, ghost: 1, dragon: 1, dark: 0, steel: 0.5, fairy: 1 },

    bug: { normal: 1, fire: 0.5, water: 1, electric: 1, grass: 2, ice: 1, fighting: 0.5, poison: 0.5, ground: 1, flying: 0.5, psychic: 2, bug: 1, rock: 1, ghost: 0.5, dragon: 1, dark: 2, steel: 0.5, fairy: 0.5 },

    rock: { normal: 1, fire: 2, water: 1, electric: 1, grass: 1, ice: 2, fighting: 0.5, poison: 1, ground: 0.5, flying: 2, psychic: 1, bug: 2, rock: 1, ghost: 1, dragon: 1, dark: 1, steel: 0.5, fairy: 1 },

    ghost: { normal: 0, fire: 1, water: 1, electric: 1, grass: 1, ice: 1, fighting: 1, poison: 1, ground: 1, flying: 1, psychic: 1, bug: 1, rock: 1, ghost: 2, dragon: 1, dark: 2, steel: 1, fairy: 1 },

    dragon: { normal: 1, fire: 1, water: 1, electric: 1, grass: 1, ice: 1, fighting: 1, poison: 1, ground: 1, flying: 1, psychic: 1, bug: 1, rock: 1, ghost: 1, dragon: 2, dark: 1, steel: 0.5, fairy: 2 },

    dark: { normal: 1, fire: 1, water: 1, electric: 1, grass: 1, ice: 1, fighting: 0.5, poison: 1, ground: 1, flying: 1, psychic: 2, bug: 1, rock: 1, ghost: 2, dragon: 1, dark: 0.5, steel: 1, fairy: 0.5 },

    steel: { normal: 1, fire: 0.5, water: 0.5, electric: 0.5, grass: 1, ice: 2, fighting: 1, poison: 1, ground: 1, flying: 1, psychic: 1, bug: 1, rock: 2, ghost: 1, dragon: 1, dark: 1, steel: 0.5, fairy: 2 },

    fairy: { normal: 1, fire: 0.5, water: 1, electric: 1, grass: 1, ice: 1, fighting: 2, poison: 0.5, ground: 1, flying: 1, psychic: 1, bug: 1, rock: 1, ghost: 1, dragon: 0, dark: 2, steel: 0.5, fairy: 1 },
  };

//  Calculate effectiveness
  let effectiveness = 1;
  for (let i = 0; i < pokeTypes[0].length; i++) {
    for (let j = 0; j < pokeTypes[1].length; j++) {
      const attackingType = pokeTypes[0][i];
      const defendingType = pokeTypes[1][j];
      effectiveness *= typeChart[attackingType][defendingType];
    }
  }

//  Determine the result message based on effectiveness
  if (effectiveness === 0) {
    return 'No effect - 0% damage';
  } else if (effectiveness < 1) {
    return 'Not very effective - 50% damage';
  } else if (effectiveness === 1) {
    return 'Normal - 100% damage';
  } else if (effectiveness > 1) {
    return 'Super effective - 200% damage';
  }
}