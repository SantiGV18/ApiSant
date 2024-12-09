let currentPage = 0;
const limit = 60;

// Mostrar Pokémon
async function fetchPokemon(offset) {
  const url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
  const response = await fetch(url);
  const data = await response.json();

  const container = document.getElementById("dataAlbum");
  container.innerHTML = "";

  for (const pokemon of data.results) {
    const pokemonData = await fetch(pokemon.url);
    const pokemonDetails = await pokemonData.json();

    const card = document.createElement("div");
    card.classList.add("col");

    card.innerHTML = `
      <div class="card h-100">
        <img
          src="${pokemonDetails.sprites.front_default || 'https://via.placeholder.com/150'}"
          class="card-img-top"
          alt="${pokemon.name}"
        />
        <div class="card-body text-center">
          <h5 class="card-title">${pokemon.name}</h5>
          <p class="card-text">HP: ${
            pokemonDetails.stats.find((stat) => stat.stat.name === "hp").base_stat
          }</p>
        </div>
      </div>
    `;

    container.appendChild(card);
  }

  updatePagination();
}

// Paginación
function updatePagination() {
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = "";

  const prevButton = document.createElement("button");
  prevButton.classList.add("btn", "btn-primary", "me-2");
  prevButton.textContent = "Anterior";
  prevButton.disabled = currentPage === 0;
  prevButton.addEventListener("click", () => {
    if (currentPage > 0) {
      currentPage--;
      fetchPokemon(currentPage * limit);
    }
  });

  const nextButton = document.createElement("button");
  nextButton.classList.add("btn", "btn-primary");
  nextButton.textContent = "Siguiente";
  nextButton.addEventListener("click", () => {
    currentPage++;
    fetchPokemon(currentPage * limit);
  });

  pagination.appendChild(prevButton);
  pagination.appendChild(nextButton);
}

// Iniciar con Pokémon
fetchPokemon(currentPage * limit);
