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
    // const poke2 = document.querySelector('#poke2').value.toLowerCase();
    const url = `https://pokeapi.co/api/v2/pokemon/${pokemonInput}`;
    // const url2 = `https://pokeapi.co/api/v2/pokemon/${poke2}`;
    let pokeStore = [];
    let pokeImg = [];

    fetch(url)
      .then(res => res.json()) // parse response as JSON
      .then(data => {
        pokeStore.push(data.types.map(type => type.type.name.toLowerCase()));
        pokeImg.push(data.sprites.front_shiny);
        document.querySelector('#pokeImg').src = pokeImg[0];

        // fetch(url2)
        //   .then(res => res.json()) // parse response as JSON
        //   .then(data => {
        //     pokeStore.push(data.types.map(type => type.type.name.toLowerCase()));
        //     pokeImg.push(data.sprites.front_shiny);

            // const effectiveness = calculateTypeEffectiveness(pokeStore);

            
            // document.querySelector('#pokeImg2').src = pokeImg[1];
            // document.querySelector('h2').innerText = effectiveness;
          // })
          // .catch(err => {
          //   console.log(`error ${err}`);
          // });
      })
      .catch(err => {
        console.log(`error ${err}`);
      });
  }

  // Autocomplete Pokemon name

  // Sample list of Pokémon names (you should replace this with your actual data)





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

  // Add event listener to the "Fetch" button
  const compareButton = document.querySelector('button[name="button"]');
  compareButton.addEventListener('click', getFetch);

  // Adding event listeners to all elements with class 'inputValue' for pressing "Enter"
  const inputValues = document.querySelectorAll('.inputValue');
  inputValues.forEach(inputValue => {
    inputValue.addEventListener('keypress', function (event) {
      if (event.key === 'Enter') {
        getFetch();
      }
    });
  });
});