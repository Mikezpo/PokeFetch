document.addEventListener('DOMContentLoaded', function() {
  
    // Function for handling the fetch and processing data
    function getFetch() {
      const poke1 = document.querySelector('#poke1').value;
      const poke2 = document.querySelector('#poke2').value;
      const url = `https://pokeapi.co/api/v2/pokemon/${poke1}`;
      const url2 = `https://pokeapi.co/api/v2/pokemon/${poke2}`;
    }
};