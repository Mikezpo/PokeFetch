// fetch('https://pokeapi.co/api/v2/pokemon/')
//       .then(res => res.json()) // parse response as JSON
//       .then(data => {
//         console.log(data.types[1].type.name);
//       })
//       .catch(err => {
//         console.log(`error ${err}`);
//       });


document.addEventListener('DOMContentLoaded', function() {
  // Function for handling the fetch and processing data
  function getFetch() {
    const poke1 = document.querySelector('#poke1').value.toLowerCase();
    const poke2 = document.querySelector('#poke2').value.toLowerCase();
    const url = `https://pokeapi.co/api/v2/pokemon/${poke1}`;
    const url2 = `https://pokeapi.co/api/v2/pokemon/${poke2}`;
    let pokeStore = [];
    let pokeImg = [];

    fetch(url)
      .then(res => res.json()) // parse response as JSON
      .then(data => {
        pokeStore.push(data.types[0].type.name); // Convert to lowercase
        if (data.types[1]) {
          pokeStore.push(data.types[1].type.name); // Convert to lowercase
        }
        pokeImg.push(data.sprites.front_shiny);

        fetch(url2)
          .then(res => res.json()) // parse response as JSON
          .then(data => {
            pokeStore.push(data.types[0].type.name); // Convert to lowercase
            if (data.types[1]) {
              pokeStore.push(data.types[1].type.name); // Convert to lowercase
            }
            pokeImg.push(data.sprites.front_shiny);

            // Check if Pokemon does not have any effect on opponent type 2

            if(
              (pokeStore[0] === 'normal' && pokeStore[2] === 'ghost') ||
              (pokeStore[0] === 'electric' && pokeStore[2] === 'ground') ||
              (pokeStore[0] === 'fighting' && pokeStore[2] === 'ghost') ||
              (pokeStore[0] === 'poison' && pokeStore[2] === 'steel') ||
              (pokeStore[0] === 'ground' && pokeStore[2] === 'flying') ||
              (pokeStore[0] === 'psychic' && pokeStore[2] === 'dark') ||
              (pokeStore[0] === 'ghost' && pokeStore[2] === 'normal') ||
              (pokeStore[0] === 'dragon' && pokeStore[2] === 'fairy')
            ) {
              document.querySelector('#pokeImg1').src = pokeImg[0];
              document.querySelector('#pokeImg2').src = pokeImg[1];
              document.querySelector('h2').innerText = 'No effect - 0% damage';
            
            // Check if Pokemon does not have any effect on opponent type 1
            } else if(
              (pokeStore[0] === 'normal' && pokeStore[1] === 'ghost') ||
              (pokeStore[0] === 'electric' && pokeStore[1] === 'ground') ||
              (pokeStore[0] === 'fighting' && pokeStore[1] === 'ghost') ||
              (pokeStore[0] === 'poison' && pokeStore[1] === 'steel') ||
              (pokeStore[0] === 'ground' && pokeStore[1] === 'flying') ||
              (pokeStore[0] === 'psychic' && pokeStore[1] === 'dark') ||
              (pokeStore[0] === 'ghost' && pokeStore[1] === 'normal') ||
              (pokeStore[0] === 'dragon' && pokeStore[1] === 'fairy')
            ) {
              document.querySelector('#pokeImg1').src = pokeImg[0];
              document.querySelector('#pokeImg2').src = pokeImg[1];
              document.querySelector('h2').innerText = 'No effect - 0% damage';

            // Check if Pokemon is not very effective against opponent type 2
            } else if(
              (pokeStore[0] === 'normal' && (pokeStore[2] === 'rock' || pokeStore[2] === 'steel')) ||
              (pokeStore[0] === 'fire' && (pokeStore[2] === 'water' || pokeStore[2] === 'fire' || pokeStore[2] === 'rock' || pokeStore[2] === 'dragon')) ||
              (pokeStore[0] === 'water' && (pokeStore[2] === 'water' || pokeStore[2] === 'grass' || pokeStore[2] === 'dragon')) ||
              (pokeStore[0] === 'electric' && (pokeStore[2] === 'grass' || pokeStore[2] === 'electric' || pokeStore[2] === 'dragon')) ||
              (pokeStore[0] === 'grass' && (pokeStore[2] === 'fire' || pokeStore[2] === 'grass' || pokeStore[2] === 'poison' || pokeStore[2] === 'flying' || pokeStore[2] === 'bug' || pokeStore[2] === 'dragon' || pokeStore[2] === 'steel')) ||
              (pokeStore[0] === 'ice' && (pokeStore[2] === 'fire' || pokeStore[2] === 'water' || pokeStore[2] === 'ice' || pokeStore[2] === 'steel')) ||
              (pokeStore[0] === 'fighting' && (pokeStore[2] === 'poison' || pokeStore[2] === 'flying' || pokeStore[2] === 'psychic' || pokeStore[2] === 'bug' || pokeStore[2] === 'fairy')) ||
              (pokeStore[0] === 'poison' && (pokeStore[2] === 'poison' || pokeStore[2] === 'ground' || pokeStore[2] === 'rock' || pokeStore[2] === 'ghost')) ||
              (pokeStore[0] === 'ground' && (pokeStore[2] === 'grass' || pokeStore[2] === 'bug')) ||
              (pokeStore[0] === 'flying' && (pokeStore[2] === 'electric' || pokeStore[2] === 'rock' || pokeStore[2] === 'steel')) ||
              (pokeStore[0] === 'psychic' && (pokeStore[2] === 'psychic' || pokeStore[2] === 'steel')) ||
              (pokeStore[0] === 'bug' && (pokeStore[2] === 'fire' || pokeStore[2] === 'fighting' || pokeStore[2] === 'poison' || pokeStore[2] === 'flying' || pokeStore[2] === 'ghost' || pokeStore[2] === 'steel' || pokeStore[2] === 'fairy')) ||
              (pokeStore[0] === 'rock' && (pokeStore[2] === 'fighting' || pokeStore[2] === 'ground' || pokeStore[2] === 'steel')) ||
              (pokeStore[0] === 'ghost' && (pokeStore[2] === 'dark')) ||
              (pokeStore[0] === 'dragon' && (pokeStore[2] === 'steel')) ||
              (pokeStore[0] === 'dark' && (pokeStore[2] === 'fighting' || pokeStore[2] === 'dark' || pokeStore[2] === 'fairy')) ||
              (pokeStore[0] === 'steel' && (pokeStore[2] === 'fire' || pokeStore[2] === 'water' || pokeStore[2] === 'electric' || pokeStore[2] === 'steel')) ||
              (pokeStore[0] === 'fairy' && (pokeStore[2] === 'fire' || pokeStore[2] === 'poison' || pokeStore[2] === 'steel'))

            ) {
              document.querySelector('#pokeImg1').src = pokeImg[0];
              document.querySelector('#pokeImg2').src = pokeImg[1];
              document.querySelector('h2').innerText = 'Not very effective - 50% damage';

            // Check if Pokemon is not very effective against opponent type 1
            } else if(
              (pokeStore[0] === 'normal' && (pokeStore[1] === 'rock' || pokeStore[1] === 'steel')) ||
              (pokeStore[0] === 'fire' && (pokeStore[1] === 'water' || pokeStore[1] === 'fire' || pokeStore[1] === 'rock' || pokeStore[1] === 'dragon')) ||
              (pokeStore[0] === 'water' && (pokeStore[1] === 'water' || pokeStore[1] === 'grass' || pokeStore[1] === 'dragon')) ||
              (pokeStore[0] === 'electric' && (pokeStore[1] === 'grass' || pokeStore[1] === 'electric' || pokeStore[1] === 'dragon')) ||
              (pokeStore[0] === 'grass' && (pokeStore[1] === 'fire' || pokeStore[1] === 'grass' || pokeStore[1] === 'poison' || pokeStore[1] === 'flying' || pokeStore[1] === 'bug' || pokeStore[1] === 'dragon' || pokeStore[1] === 'steel')) ||
              (pokeStore[0] === 'ice' && (pokeStore[1] === 'fire' || pokeStore[1] === 'water' || pokeStore[1] === 'ice' || pokeStore[1] === 'steel')) ||
              (pokeStore[0] === 'fighting' && (pokeStore[1] === 'poison' || pokeStore[1] === 'flying' || pokeStore[1] === 'psychic' || pokeStore[1] === 'bug' || pokeStore[1] === 'fairy')) ||
              (pokeStore[0] === 'poison' && (pokeStore[1] === 'poison' || pokeStore[1] === 'ground' || pokeStore[1] === 'rock' || pokeStore[1] === 'ghost')) ||
              (pokeStore[0] === 'ground' && (pokeStore[1] === 'grass' || pokeStore[1] === 'bug')) ||
              (pokeStore[0] === 'flying' && (pokeStore[1] === 'electric' || pokeStore[1] === 'rock' || pokeStore[1] === 'steel')) ||
              (pokeStore[0] === 'psychic' && (pokeStore[1] === 'psychic' || pokeStore[1] === 'steel')) ||
              (pokeStore[0] === 'bug' && (pokeStore[1] === 'fire' || pokeStore[1] === 'fighting' || pokeStore[1] === 'poison' || pokeStore[1] === 'flying' || pokeStore[1] === 'ghost' || pokeStore[1] === 'steel' || pokeStore[1] === 'fairy')) ||
              (pokeStore[0] === 'rock' && (pokeStore[1] === 'fighting' || pokeStore[1] === 'ground' || pokeStore[1] === 'steel')) ||
              (pokeStore[0] === 'ghost' && (pokeStore[1] === 'dark')) ||
              (pokeStore[0] === 'dragon' && (pokeStore[1] === 'steel')) ||
              (pokeStore[0] === 'dark' && (pokeStore[1] === 'fighting' || pokeStore[1] === 'dark' || pokeStore[1] === 'fairy')) ||
              (pokeStore[0] === 'steel' && (pokeStore[1] === 'fire' || pokeStore[1] === 'water' || pokeStore[1] === 'electric' || pokeStore[1] === 'steel')) ||
              (pokeStore[0] === 'fairy' && (pokeStore[1] === 'fire' || pokeStore[1] === 'poison' || pokeStore[1] === 'steel'))

            ) {
              document.querySelector('#pokeImg1').src = pokeImg[0];
              document.querySelector('#pokeImg2').src = pokeImg[1];
              document.querySelector('h2').innerText = 'Not very effective - 50% damage';

            
            // Check if Pokemon is Super effective against opponent type 2
            } else if (
              (pokeStore[0] === 'grass' && (pokeStore[2] === 'water' || pokeStore[2] === 'ground' || pokeStore[2] === 'rock')) ||
              (pokeStore[0] === 'water' && (pokeStore[2] === 'fire' || pokeStore[2] === 'ground' || pokeStore[2] === 'rock')) ||
              (pokeStore[0] === 'fire' && (pokeStore[2] === 'grass' || pokeStore[2] === 'ice' || pokeStore[2] === 'bug' || pokeStore[2] === 'steel')) ||
              (pokeStore[0] === 'electric' && (pokeStore[2] === 'water' || pokeStore[2] === 'flying')) ||
              (pokeStore[0] === 'ice' && (pokeStore[2] === 'grass' || pokeStore[2] === 'ground' || pokeStore[2] === 'flying' || pokeStore[2] === 'dragon')) ||
              (pokeStore[0] === 'fighting' && (pokeStore[2] === 'normal' || pokeStore[2] === 'ice' || pokeStore[2] === 'rock' || pokeStore[2] === 'dark' || pokeStore[2] === 'steel')) ||
              (pokeStore[0] === 'poison' && (pokeStore[2] === 'grass' || pokeStore[2] === 'fairy')) ||
              (pokeStore[0] === 'ground' && (pokeStore[2] === 'fire' || pokeStore[2] === 'electric' || pokeStore[2] === 'poison' || pokeStore[2] === 'rock' || pokeStore[2] === 'steel')) ||
              (pokeStore[0] === 'flying' && (pokeStore[2] === 'grass' || pokeStore[2] === 'fighting' || pokeStore[2] === 'bug')) ||
              (pokeStore[0] === 'psychic' && (pokeStore[2] === 'fighting' || pokeStore[2] === 'poison')) ||
              (pokeStore[0] === 'bug' && (pokeStore[2] === 'grass' || pokeStore[2] === 'psychic' || pokeStore[2] === 'dark')) ||
              (pokeStore[0] === 'rock' && (pokeStore[2] === 'fire' || pokeStore[2] === 'ice' || pokeStore[2] === 'flying' || pokeStore[2] === 'bug')) ||
              (pokeStore[0] === 'ghost' && (pokeStore[2] === 'psychic' || pokeStore[2] === 'ghost')) ||
              (pokeStore[0] === 'dragon' && pokeStore[1] === 'dragon') ||
              (pokeStore[0] === 'dark' && (pokeStore[2] === 'psychic' || pokeStore[2] === 'ghost')) ||
              (pokeStore[0] === 'steel' && (pokeStore[2] === 'ice' || pokeStore[2] === 'rock' || pokeStore[2] === 'fairy')) ||
              (pokeStore[0] === 'fairy' && (pokeStore[2] === 'fighting' || pokeStore[2] === 'dragon' || pokeStore[2] === 'dark'))
            ) {

              document.querySelector('#pokeImg1').src = pokeImg[0];
              document.querySelector('#pokeImg2').src = pokeImg[1];
              document.querySelector('h2').innerText = 'Super effective - 200% damage';
            

            // Check if Pokemon is Super effective against opponent type 1
            } else if (
              (pokeStore[0] === 'grass' && (pokeStore[1] === 'water' || pokeStore[1] === 'ground' || pokeStore[1] === 'rock')) ||
              (pokeStore[0] === 'water' && (pokeStore[1] === 'fire' || pokeStore[1] === 'ground' || pokeStore[1] === 'rock')) ||
              (pokeStore[0] === 'fire' && (pokeStore[1] === 'grass' || pokeStore[1] === 'ice' || pokeStore[1] === 'bug' || pokeStore[1] === 'steel')) ||
              (pokeStore[0] === 'electric' && (pokeStore[1] === 'water' || pokeStore[1] === 'flying')) ||
              (pokeStore[0] === 'ice' && (pokeStore[1] === 'grass' || pokeStore[1] === 'ground' || pokeStore[1] === 'flying' || pokeStore[1] === 'dragon')) ||
              (pokeStore[0] === 'fighting' && (pokeStore[1] === 'normal' || pokeStore[1] === 'ice' || pokeStore[1] === 'rock' || pokeStore[1] === 'dark' || pokeStore[1] === 'steel')) ||
              (pokeStore[0] === 'poison' && (pokeStore[1] === 'grass' || pokeStore[1] === 'fairy')) ||
              (pokeStore[0] === 'ground' && (pokeStore[1] === 'fire' || pokeStore[1] === 'electric' || pokeStore[1] === 'poison' || pokeStore[1] === 'rock' || pokeStore[1] === 'steel')) ||
              (pokeStore[0] === 'flying' && (pokeStore[1] === 'grass' || pokeStore[1] === 'fighting' || pokeStore[1] === 'bug')) ||
              (pokeStore[0] === 'psychic' && (pokeStore[1] === 'fighting' || pokeStore[1] === 'poison')) ||
              (pokeStore[0] === 'bug' && (pokeStore[1] === 'grass' || pokeStore[1] === 'psychic' || pokeStore[1] === 'dark')) ||
              (pokeStore[0] === 'rock' && (pokeStore[1] === 'fire' || pokeStore[1] === 'ice' || pokeStore[1] === 'flying' || pokeStore[1] === 'bug')) ||
              (pokeStore[0] === 'ghost' && (pokeStore[1] === 'psychic' || pokeStore[1] === 'ghost')) ||
              (pokeStore[0] === 'dragon' && pokeStore[1] === 'dragon') ||
              (pokeStore[0] === 'dark' && (pokeStore[1] === 'psychic' || pokeStore[1] === 'ghost')) ||
              (pokeStore[0] === 'steel' && (pokeStore[1] === 'ice' || pokeStore[1] === 'rock' || pokeStore[1] === 'fairy')) ||
              (pokeStore[0] === 'fairy' && (pokeStore[1] === 'fighting' || pokeStore[1] === 'dragon' || pokeStore[1] === 'dark'))
            ) {
              document.querySelector('#pokeImg1').src = pokeImg[0];
              document.querySelector('#pokeImg2').src = pokeImg[1];
              document.querySelector('h2').innerText = 'Super effective - 200% damage';

            // If Pokemon does not have any advantage nor disadvantage against opponent
            } else {
              document.querySelector('#pokeImg1').src = pokeImg[0];
              document.querySelector('#pokeImg2').src = pokeImg[1];
              document.querySelector('h2').innerText = 'Normal damage - 100% damage';
            }
            })
          .catch(err => {
            console.log(`error ${err}`);
          });
      })
      .catch(err => {
        console.log(`error ${err}`);
      });
  }

  // Adding event listeners to all elements with class 'inputValue'
  const inputValues = document.querySelectorAll('.inputValue');
  inputValues.forEach(inputValue => {
    inputValue.addEventListener('keypress', function(event) {
      if (event.key === 'Enter') {
        getFetch();
      }
    });
  });
});


// Updating the current code to Objects


// Function to calculate type effectiveness
function calculateTypeEffectiveness(pokeTypes) {
  // Type chart with effectiveness multipliers
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