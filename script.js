const API_KEY = "2d45a920aa79fac52c47d563d7f2eeeb";
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/w500";

async function fetchMovies(endpoint, containerId) {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}?api_key=${API_KEY}`);
    const data = await res.json();
    displayMovies(data.results, containerId);
  } catch (error) {
    console.error("Error fetching movies:", error);
  }
}

async function searchMovies(query) {
  try {
    const res = await fetch(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}`
    );
    const data = await res.json();

    displayMovies(data.results, "main-movies");

    document.getElementById("main-title").textContent = "Search Results";

    document.getElementById("trending-section").style.display = "none";
    document.getElementById("recommended-section").style.display = "none";

  } catch (error) {
    console.error("Search error:", error);
  }
}

function displayMovies(movies, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  movies.forEach(movie => {
    if (!movie.poster_path) return;

    const card = document.createElement("div");
    card.classList.add("movie-card");

    card.innerHTML = `
    <img src="${IMG_URL + movie.poster_path}" alt="${movie.title}">
    <span class="rating">⭐ ${movie.vote_average.toFixed(1)}</span>
    `;

    card.addEventListener("click", () => {
      openModal(movie);
    });

    container.appendChild(card);
  });
}

function openModal(movie) {
  const modal = document.getElementById("movie-modal");
  modal.classList.add("active");
  document.getElementById("modal-img").src = IMG_URL + movie.poster_path;
  document.getElementById("modal-title").textContent = movie.title;
  document.getElementById("modal-rating").textContent =
    `⭐ ${movie.vote_average}`;
  document.getElementById("modal-overview").textContent = movie.overview;
}

function initSliders() {
  const sliders = document.querySelectorAll(".movie-slider");

  sliders.forEach((slider) => {
    const row = slider.querySelector(".movie-row");
    const left = slider.querySelector(".left");
    const right = slider.querySelector(".right");

    const scrollAmount = 420;

    right.addEventListener("click", () => {
      row.scrollBy({ left: scrollAmount, behavior: "smooth" });
    });

    left.addEventListener("click", () => {
      row.scrollBy({ left: -scrollAmount, behavior: "smooth" });
    });
  });
}

function initSearch() {
  const searchInput = document.getElementById("search");

  searchInput.addEventListener("keyup", (e) => {
    const query = e.target.value.trim();

    if (query.length > 2) {
      searchMovies(query);
    } else {
      document.getElementById("main-title").textContent = "Recently Watched";

      document.getElementById("trending-section").style.display = "block";
      document.getElementById("recommended-section").style.display = "block";
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  fetchMovies("/trending/movie/week", "main-movies");
  fetchMovies("/movie/popular", "popular");
  fetchMovies("/movie/top_rated", "top-rated");

  document.getElementById("close-btn").addEventListener("click", () => {
    document.getElementById("movie-modal").classList.add("hidden");
  });

  initSliders();
  initSearch();
});

const modal = document.getElementById("movie-modal");
const closeBtn = document.getElementById("close-btn");

closeBtn.addEventListener("click", () => {
  modal.classList.remove("active");
});

modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.remove("active");
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    modal.classList.remove("active");
  }
});