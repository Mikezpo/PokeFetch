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

// const typeEffectiveness = {
//   grass: {
//     superEffective: ['water', 'ground', 'rock'],
//     notVeryEffective: ['fire', 'grass', 'poison', 'flying', 'bug', 'dragon', 'steel'],
//     noEffect: []
//   },
//   water: {
//     superEffective: ['fire', 'ground', 'rock'],
//     notVeryEffective: ['water', 'grass', 'dragon'],
//     noEffect: []
//   },
//   // Add more types here...
// };

// // Function to determine type effectiveness
// function getTypeEffectiveness(attackingType, defendingType) {
//   if (typeEffectiveness[attackingType].superEffective.includes(defendingType)) {
//     return 'Super effective - 200% damage';
//   } else if (typeEffectiveness[attackingType].notVeryEffective.includes(defendingType)) {
//     return 'Not very effective - 50% damage';
//   } else if (typeEffectiveness[attackingType].noEffect.includes(defendingType)) {
//     return 'No effect - 0% damage';
//   } else {
//     return 'Normal damage - 100% damage';
//   }
// }