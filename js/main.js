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
    const poke1 = document.querySelector('#poke1').value;
    const poke2 = document.querySelector('#poke2').value;
    const url = `https://pokeapi.co/api/v2/pokemon/${poke1}`;
    const url2 = `https://pokeapi.co/api/v2/pokemon/${poke2}`;
    let pokeStore = [];
    let pokeImg = [];

    fetch(url)
      .then(res => res.json()) // parse response as JSON
      .then(data => {
        pokeStore.push(data.types[0].type.name.toLowerCase()); // Convert to lowercase
        if (data.types[1]) {
          pokeStore.push(data.types[1].type.name.toLowerCase()); // Convert to lowercase
        }
        pokeImg.push(data.sprites.front_shiny);

        fetch(url2)
          .then(res => res.json()) // parse response as JSON
          .then(data => {
            pokeStore.push(data.types[0].type.name.toLowerCase()); // Convert to lowercase
            if (data.types[1]) {
              pokeStore.push(data.types[1].type.name.toLowerCase()); // Convert to lowercase
            }
            pokeImg.push(data.sprites.front_shiny);

            // Check both possible type combinations for each Pokémon
            if (
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
              (pokeStore[0] === 'ghost' && pokeStore[2] === 'psychic')


            ) {
              document.querySelector('#pokeImg1').src = pokeImg[0];
              document.querySelector('#pokeImg2').src = pokeImg[1];
              document.querySelector('h2').innerText = ' 2x > ';


            } else if (
              (pokeStore[0] === 'grass' && (pokeStore[1] === 'water' || pokeStore[1] === 'ground' || pokeStore[1] === 'rock')) ||
              (pokeStore[0] === 'water' && (pokeStore[1] === 'fire' || pokeStore[1] === 'ground' || pokeStore[1] === 'rock')) ||
              (pokeStore[0] === 'fire' && (pokeStore[1] === 'grass' || pokeStore[1] === 'ice' || pokeStore[1] === 'bug' || pokeStore[1] === 'steel')) ||
              (pokeStore[0] === 'electric' && (pokeStore[1] === 'water' || pokeStore[1] === 'flying')) ||
              (pokeStore[0] === 'ice' && (pokeStore[1] === 'grass' || pokeStore[1] === 'ground' || pokeStore[1] === 'flying' || pokeStore[1] === 'dragon')) ||
              (pokeStore[0] === 'fighting' && (pokeStore[2] === 'normal' || pokeStore[1] === 'ice' || pokeStore[1] === 'rock' || pokeStore[1] === 'dark' || pokeStore[1] === 'steel')) ||
              (pokeStore[0] === 'poison' && (pokeStore[1] === 'grass' || pokeStore[1] === 'fairy')) ||
              (pokeStore[0] === 'ground' && (pokeStore[1] === 'fire' || pokeStore[1] === 'electric' || pokeStore[1] === 'poison' || pokeStore[1] === 'rock' || pokeStore[1] === 'steel')) ||
              (pokeStore[0] === 'flying' && (pokeStore[1] === 'grass' || pokeStore[1] === 'fighting' || pokeStore[1] === 'bug')) ||
              (pokeStore[0] === 'psychic' && (pokeStore[1] === 'fighting' || pokeStore[1] === 'poison')) ||
              (pokeStore[0] === 'flying' && (pokeStore[1] === 'grass' || pokeStore[1] === 'fighting' || pokeStore[1] === 'bug')) ||
              (pokeStore[0] === 'rock' && (pokeStore[1] === 'fire' || pokeStore[1] === 'ice' || pokeStore[1] === 'flying' || pokeStore[1] === 'bug')) ||
              (pokeStore[0] === 'ghost' && pokeStore[1] === 'psychic')



            ) {
              document.querySelector('#pokeImg1').src = pokeImg[0];
              document.querySelector('#pokeImg2').src = pokeImg[1];
              document.querySelector('h2').innerText = ' 2x > ';

              // Check if Pokemon are the same type
            } else if(
              (pokeStore[0] === 'grass' && pokeStore[2] === 'grass') ||
              (pokeStore[0] === 'water' && pokeStore[2] === 'water') ||
              (pokeStore[0] === 'fire' && pokeStore[2] === 'fire') ||
              (pokeStore[0] === 'electric' && pokeStore[2] === 'electric') ||
              (pokeStore[0] === 'ice' && pokeStore[2] === 'ice') ||
              (pokeStore[0] === 'fighting' && pokeStore[2] === 'fighting') ||
              (pokeStore[0] === 'poison' && pokeStore[2] === 'poison') ||
              (pokeStore[0] === 'gound' && pokeStore[2] === 'gound') ||
              (pokeStore[0] === 'flying' && pokeStore[2] === 'flying') ||
              (pokeStore[0] === 'psychic' && pokeStore[2] === 'psychic') ||
              (pokeStore[0] === 'flying' && pokeStore[2] === 'flying') ||
              (pokeStore[0] === 'rock' && pokeStore[2] === 'rock')


            ) {
              document.querySelector('#pokeImg1').src = pokeImg[0];
              document.querySelector('#pokeImg2').src = pokeImg[1];
              document.querySelector('h2').innerText = '=';
            
            } else if(
              (pokeStore[0] === 'grass' && pokeStore[1] === 'grass') ||
              (pokeStore[0] === 'water' && pokeStore[1] === 'water') ||
              (pokeStore[0] === 'fire' && pokeStore[1] === 'fire') ||
              (pokeStore[0] === 'electric' && pokeStore[1] === 'electric') ||
              (pokeStore[0] === 'ice' && pokeStore[1] === 'ice') ||
              (pokeStore[0] === 'fighting' && pokeStore[1] === 'fighting') ||
              (pokeStore[0] === 'poison' && pokeStore[1] === 'poison') ||
              (pokeStore[0] === 'gound' && pokeStore[1] === 'gound') ||
              (pokeStore[0] === 'flying' && pokeStore[1] === 'flying') ||
              (pokeStore[0] === 'psychic' && pokeStore[1] === 'psychic') ||
              (pokeStore[0] === 'flying' && pokeStore[1] === 'flying') ||
              (pokeStore[0] === 'rock' && pokeStore[1] === 'rock')


            ) {
              document.querySelector('#pokeImg1').src = pokeImg[0];
              document.querySelector('#pokeImg2').src = pokeImg[1];
              document.querySelector('h2').innerText = '=';

            } else if(
              (pokeStore[0] === 'ghost' && pokeStore[2] === 'ghost')
              

            ) {
              document.querySelector('#pokeImg1').src = pokeImg[0];
              document.querySelector('#pokeImg2').src = pokeImg[1];
              document.querySelector('h2').innerText = '2x < >';

            
            } else if(
              (pokeStore[0] === 'ghost' && pokeStore[1] === 'ghost')
              

            ) {
              document.querySelector('#pokeImg1').src = pokeImg[0];
              document.querySelector('#pokeImg2').src = pokeImg[1];
              document.querySelector('h2').innerText = '2x < >';
              
              // If none aplies then if has weakness against the other type
            } else {
              document.querySelector('#pokeImg1').src = pokeImg[0];
              document.querySelector('#pokeImg2').src = pokeImg[1];
              document.querySelector('h2').innerText = ' 2x < ';
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