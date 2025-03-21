/* Wait for DOM to fully load before running JavaScript */
document.addEventListener('DOMContentLoaded', () => {
    /* Get references to DOM elements we'll interact with */
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const loadingIndicator = document.getElementById('loadingIndicator');

    // Focus on search input when page loads
    searchInput.focus();

    /* Search button click event listener */
    searchButton.addEventListener('click', () => {
        const searchTerm = searchInput.value.toLowerCase().trim();
        if (searchTerm) {
            showLoading();
            fetchMovie(searchTerm);
        }
    });

    /* Allow users to press Enter to search */
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const searchTerm = searchInput.value.trim();
            if (searchTerm) {
                showLoading();
                fetchMovie(searchTerm);
            }
        }
    });

    /* Display loading spinner and clear previous results */
    function showLoading() {
        loadingIndicator.classList.remove('hidden');
        const resultsContainer = document.getElementById('resultsContainer');
        if (resultsContainer) {
            resultsContainer.innerHTML = '';
        }
    }

    /* Hide loading spinner when operation completes */
    function hideLoading() {
        loadingIndicator.classList.add('hidden');
    }
});

/* API configuration for OMDB (Open Movie Database) */
const apiKey = 'a0107aec';
const apiUrl = 'http://www.omdbapi.com/';

/* Fetch movie data from the OMDB API */
async function fetchMovie(title) {
    try {
        /* Make API request with the movie title */
        const response = await fetch(`${apiUrl}?apikey=${apiKey}&t=${encodeURIComponent(title)}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        /* Parse JSON response */
        const data = await response.json();
        console.log(data);
        
        /* Hide loading indicator whether successful or not */
        document.getElementById('loadingIndicator').classList.add('hidden');
        
        /* Handle case where movie is not found */
        if (data.Response === 'False') {
            displayNoResults();
            return;
        }
        
        /* Display movie data in the UI */
        displayMovieData(data);
        
    } catch (error) {
        /* Handle any errors that occur during fetch */
        console.error('Error fetching movie data:', error);
        document.getElementById('loadingIndicator').classList.add('hidden');
        displayError(error);
    }
}

/* Create and display the movie card with all details */
function displayMovieData(movie) {
    /* Get or create container for results */
    let resultsContainer = document.getElementById('resultsContainer');
    if (!resultsContainer) {
        resultsContainer = document.createElement('div');
        resultsContainer.id = 'resultsContainer';
        document.querySelector('.container').appendChild(resultsContainer);
    }
    
    // Clear previous results
    resultsContainer.innerHTML = '';
    
    /* Create the movie card structure */
    const movieCard = document.createElement('div');
    movieCard.className = 'movie-card';
    
    /* Add movie poster with fallback image */
    const posterContainer = document.createElement('div');
    posterContainer.className = 'poster-container';
    
    const poster = document.createElement('img');
    poster.src = movie.Poster !== 'N/A' ? movie.Poster : 'images/default.png';
    poster.alt = `${movie.Title} poster`;
    posterContainer.appendChild(poster);
    
    /* Create container for all textual movie information */
    const detailsContainer = document.createElement('div');
    detailsContainer.className = 'movie-details';
    
    /* Add movie title and year */
    const titleYear = document.createElement('h2');
    titleYear.textContent = `${movie.Title} (${movie.Year})`;
    detailsContainer.appendChild(titleYear);
    
    /* Add movie metadata (rating, runtime, genre) */
    const subInfo = document.createElement('p');
    subInfo.className = 'sub-info';
    subInfo.innerHTML = `<span class="rated">${movie.Rated}</span> | <span class="runtime">${movie.Runtime}</span> | <span class="genre">${movie.Genre}</span>`;
    detailsContainer.appendChild(subInfo);
    
    /* Add director information */
    const director = document.createElement('p');
    director.innerHTML = `<strong>Director:</strong> ${movie.Director}`;
    detailsContainer.appendChild(director);
    
    /* Add cast information */
    const actors = document.createElement('p');
    actors.innerHTML = `<strong>Actors:</strong> ${movie.Actors}`;
    detailsContainer.appendChild(actors);
    
    /* Add movie plot/description */
    const plot = document.createElement('p');
    plot.className = 'plot';
    plot.innerHTML = `<strong>Plot:</strong> ${movie.Plot}`;
    detailsContainer.appendChild(plot);
    
    /* Add IMDB rating */
    const rating = document.createElement('div');
    rating.className = 'rating';
    rating.innerHTML = `<strong>IMDB:</strong> <span class="imdb-rating">${movie.imdbRating}/10</span>`;
    detailsContainer.appendChild(rating);
    
    /* Combine poster and details into card */
    movieCard.appendChild(posterContainer);
    movieCard.appendChild(detailsContainer);
    
    /* Add completed card to the page */
    resultsContainer.appendChild(movieCard);
}

/* Display a message when no movie is found */
function displayNoResults() {
    let resultsContainer = document.getElementById('resultsContainer');
    if (!resultsContainer) {
        resultsContainer = document.createElement('div');
        resultsContainer.id = 'resultsContainer';
        document.querySelector('.container').appendChild(resultsContainer);
    }
    
    resultsContainer.innerHTML = '<div class="error-message">No movie found with that title. Please try another search.</div>';
}

/* Display errors from API or network issues */
function displayError(error) {
    let resultsContainer = document.getElementById('resultsContainer');
    if (!resultsContainer) {
        resultsContainer = document.createElement('div');
        resultsContainer.id = 'resultsContainer';
        document.querySelector('.container').appendChild(resultsContainer);
    }
    
    resultsContainer.innerHTML = `<div class="error-message">Error: ${error.message}</div>`;
}

// Example usage:
// fetchMovie('Inception');


