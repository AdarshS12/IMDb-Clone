document.addEventListener('DOMContentLoaded', () => {
    const apiKey = '6a567fc3';//API KEY
    const searchInput = document.getElementById('search-input');
    const searchResultsContainer = document.getElementById('search-results');
    const favoritesLink = document.getElementById('favorites-link');
    const moviePage = document.getElementById('movie-page');
    const favoritesPage = document.getElementById('favorites-page');
    const favoritesList = document.getElementById('favorites-list');

    let favorites = [];

    // Function to fetch search results from OMDB API
    const fetchSearchResults = async (query) => {
        try {
            const response = await fetch(`http://www.omdbapi.com/?apikey=${apiKey}&s=${query}`);
            const data = await response.json();
            return data.Search || [];
        } catch (error) {
            console.error('Error fetching data:', error);
            return [];
        }
    };

    // Function to display search results
    const displaySearchResults = (results) => {
        searchResultsContainer.innerHTML = '';
        results.forEach((result) => {
            const resultDiv = document.createElement('div');
            resultDiv.classList.add('search-result');
            resultDiv.innerHTML = `
                <img src="${result.Poster}" alt="${result.Title}">
                <p>${result.Title}</p>
                <button class="favorite-btn" data-id="${result.imdbID}">Add to Favorites</button>
            `;
            resultDiv.addEventListener('click', () => showMovieDetails(result.imdbID));
            searchResultsContainer.appendChild(resultDiv);

            const favoriteBtn = resultDiv.querySelector('.favorite-btn');
            favoriteBtn.addEventListener('click', (e) => addToFavorites(e, result));
        });
    };

    // Function to show movie details on a separate page
    const showMovieDetails = async (id) => {
        try {
            const response = await fetch(`http://www.omdbapi.com/?apikey=${apiKey}&i=${id}`);
            const movieData = await response.json();

            moviePage.innerHTML = `
                <h2>${movieData.Title}</h2>
                <img src="${movieData.Poster}" alt="${movieData.Title}">
                <p>${movieData.Plot}</p>
            `;
            moviePage.style.display = 'block';
            favoritesPage.style.display = 'none';
        } catch (error) {
            console.error('Error fetching movie details:', error);
        }
    };

    // Function to add a movie to favorites
    const addToFavorites = (e, movie) => {
        e.stopPropagation();
        if (!favorites.find((fav) => fav.imdbID === movie.imdbID)) {
            favorites.push(movie);
            updateFavoritesList();
        }
    };

    // Function to update favorites list
    const updateFavoritesList = () => {
        favoritesList.innerHTML = '';
        favorites.forEach((fav) => {
            const favDiv = document.createElement('div');
            favDiv.classList.add('favorite-movie');
            favDiv.innerHTML = `
                <img src="${fav.Poster}" alt="${fav.Title}">
                <p>${fav.Title}</p>
                <button class="remove-btn" data-id="${fav.imdbID}">Remove from Favorites</button>
            `;
            favoritesList.appendChild(favDiv);

            const removeBtn = favDiv.querySelector('.remove-btn');
            removeBtn.addEventListener('click', (e) => removeFromFavorites(e, fav.imdbID));
        });
    };

    // Function to remove a movie from favorites
    const removeFromFavorites = (e, id) => {
        e.stopPropagation();
        favorites = favorites.filter((fav) => fav.imdbID !== id);
        updateFavoritesList();
    };

    // Event listener for search input
    searchInput.addEventListener('input', async () => {
        const query = searchInput.value.trim();
        const results = await fetchSearchResults(query);
        displaySearchResults(results);
    });

    // Event listener for favorites link
    favoritesLink.addEventListener('click', () => {
        favoritesPage.style.display = 'block';
        moviePage.style.display = 'none';
        updateFavoritesList();
    });
});