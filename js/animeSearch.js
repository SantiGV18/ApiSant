document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById("animeSearchInput");
  const searchButton = document.getElementById("searchButton");
  const resultsContainer = document.getElementById("animeResults");

  searchButton.addEventListener("click", () => {
    const query = searchInput.value.trim();

    if (query) {
      fetchAnime(query);
    } else {
      // Mostrar mensaje en el contenedor de resultados en lugar de una alerta
      resultsContainer.innerHTML = `
        <div class="col">
          <div class="alert alert-warning" role="alert">
            Por favor, escribe el nombre de un anime.
          </div>
        </div>
      `;
    }
  });

  // Agregar evento para buscar al presionar Enter
  searchInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      const query = searchInput.value.trim();
      if (query) {
        fetchAnime(query);
      }
    }
  });

  async function fetchAnime(query) {
    const url = `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=10`;

    // Mostrar mensaje de carga
    resultsContainer.innerHTML = `
      <div class="col">
        <div class="text-center">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Cargando...</span>
          </div>
          <p>Buscando anime...</p>
        </div>
      </div>
    `;

    try {
      const response = await fetch(url);
      const data = await response.json();

      displayAnimeResults(data.data);
    } catch (error) {
      console.error("Error al buscar anime:", error);
      // Mostrar mensaje de error en el contenedor de resultados
      resultsContainer.innerHTML = `
        <div class="col">
          <div class="alert alert-danger" role="alert">
            Hubo un error al buscar el anime. Por favor, intenta nuevamente.
          </div>
        </div>
      `;
    }
  }

  function displayAnimeResults(animeList) {
    // Limpiar resultados anteriores
    resultsContainer.innerHTML = "";

    if (animeList.length === 0) {
      resultsContainer.innerHTML = `
        <div class="col">
          <div class="alert alert-info" role="alert">
            No se encontraron resultados.
          </div>
        </div>
      `;
      return;
    }

    animeList.forEach((anime) => {
      const card = document.createElement("div");
      card.classList.add("col");

      card.innerHTML = `
        <div class="card h-100">
          <img src="${anime.images.jpg.image_url}" class="card-img-top" alt="${anime.title}">
          <div class="card-body">
            <h5 class="card-title">${anime.title}</h5>
            <p class="card-text">
              Tipo: ${anime.type || "Desconocido"}
              <br>Episodios: ${anime.episodes || "Desconocido"}
              <br>Calificación: ${anime.score || "Sin calificar"}
            </p>
            <a href="${anime.url}" target="_blank" class="btn btn-primary">Más información</a>
          </div>
        </div>
      `;

      resultsContainer.appendChild(card);
    });
  }
});