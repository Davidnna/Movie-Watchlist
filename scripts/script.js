const movie = document.getElementById("movie");
const movies = document.getElementById("movies");
const form = document.getElementById("form");
const watchlist = JSON.parse(localStorage.getItem("watchlist")) || [];
const onWatchListPage = window.location.pathname.includes("Watchlist");
const apiKey = "6fbf3a57";

function renderMovies (movieIds) {
    movies.innerHTML = "";
    movieIds.forEach(imdbID => {
        fetch(`https://www.omdbapi.com/?apikey=${apiKey}&i=${imdbID}`)
        .then(response => response.json())
        .then(data => {
            const inWatchlist = watchlist.includes(data.imdbID);
            movies.innerHTML += `
                <div class="movie-item">
                    <img class="movie-poster" src="${data.Poster}" alt="${data.Title} Poster">
                    <div>
                        <div class="movie-title">
                            <h3>${data.Title}</h3>
                            <img src="${onWatchListPage ? "../" : ""}images/star.png" alt="Rating of ${data.Title}" />
                            <!-- <img src="https://i.postimg.cc/B6VJS9Db/star.png" alt="Rating of ${data.Title}" /> -->
                            <span>${data.imdbRating}</span>
                        </div>
                        <div class="movie-title">
                            <span>${data.Runtime}</span>
                            <span>${data.Genre}</span>
                            <button type="button" class="add" data-movie-id="${data.imdbID}">
                                <img src="${onWatchListPage ? "../" : ""}images/${inWatchlist ? "remove" : "add"}.png" alt="${inWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}" />
                                <!-- <img src="https://i.postimg.cc/${inWatchlist ? "s2KVLZgp/remove" : "9MMWHFDs/add"}.png" alt="${inWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}" /> -->
                                ${inWatchlist ? "Remove" : "Watchlist"}
                            </button>
                        </div>
                        <p class="movie-plot">${data.Plot}</p>
                    </div>
                </div>
            `;
        });
    });
}

if (form) {
    form.addEventListener("submit", function(event) {
        event.preventDefault();
        fetch(`https://www.omdbapi.com/?apikey=${apiKey}&s=${movie.value}`)
            .then(response => response.json())
            .then(data => {
                const movieIds = data.Search.map(movie => movie.imdbID);
                renderMovies(movieIds);
            })
            .catch(() => {
                    movies.innerHTML = `
                        <h3 class="none">Unable to find what you are looking for:<br>
                        <b>"${movie.value}"</b>.</br>
                        Please try another search.</h3>
                    `;
            });
    });
}

function renderWatchlist() {
    if (!form) {
        if (watchlist.length > 0) {
            renderMovies(watchlist);
        } else {
            movies.innerHTML = `
                <div class="none">
                    <img src="../images/none.png" alt="No Movies Found">
                    <!-- <img src="https://i.postimg.cc/NGKH1QdN/none.png" alt="No Movies Found"> -->
                    <h3>Your watchlist is looking a little empty...</h3>
                    <a class="add" href="../">
                        <img src="../images/add.png" alt="Add to Watchlist" />
                        <!-- <img src="https://i.postimg.cc/9MMWHFDs/add.png" alt="Add to Watchlist" /> -->
                        Let's add some movies!
                    </a>
                </div>
            `;
        }
    }
}

renderWatchlist();

movies.addEventListener("click", function(event) {
    const button = event.target.closest(".add");
    if (button) {
        const movieId = button.dataset.movieId;
        if (!movieId) return; // Ensure movieId is defined
        let inWatchlist = watchlist.includes(movieId);
        if (inWatchlist) {
            watchlist.splice(watchlist.indexOf(movieId), 1);
        } else {
            watchlist.push(movieId);
        }
        inWatchlist = watchlist.includes(movieId);
        button.innerHTML = `
            <img src="${onWatchListPage ? "../" : ""}images/${inWatchlist ? "remove" : "add"}.png" alt="${inWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}" />
            <!-- <img src="https://i.postimg.cc/${inWatchlist ? "s2KVLZgp/remove" : "9MMWHFDs/add"}.png" alt="${inWatchlist ? "Remove from Watchlist" : "Add to Watchlist"}" /> -->
            ${inWatchlist ? "Remove" : "Watchlist"}
        `;
        localStorage.setItem("watchlist", JSON.stringify(watchlist));
        renderWatchlist();
    }
});