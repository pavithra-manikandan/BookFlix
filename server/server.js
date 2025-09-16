/**
 * Server Setup for BookFlix Application
 *
 * This file serves as the entry point for the backend server of the BookFlix application.
 * It is built using the Express framework and configured to handle API routes for the app.
 * The server facilitates communication between the frontend and the backend database
 * while providing endpoints for various functionalities.
 *
 * **Key Features**:
 * - **Cross-Origin Resource Sharing (CORS)**:
 *   - Configured to allow requests from any origin (`origin: '*'`).
 *   - Enables the frontend to make API calls to the backend server.
 *
 * - **REST API Endpoints**:
 *   - Implements multiple endpoints for user authentication, book and movie details,
 *     reviews, search, and analytics.
 *   - Endpoints are modularized through a `routes` object for maintainability.
 *
 * **Dependencies**:
 * - `express`: The framework used to create and configure the server.
 * - `cors`: Middleware to enable CORS for API calls.
 * - `config`: Custom configuration file containing server host and port details.
 * - `routes`: Modular routes handling the API logic for various endpoints.
 *
 * **Endpoints**:
 * - **User Authentication**:
 *   - `POST /signup`: Handles user sign-up.
 *   - `POST /login`: Handles user login.
 *
 * - **Book Endpoints**:
 *   - `GET /book/details/:book_id`: Fetches details for a specific book by its ID.
 *   - `GET /books/reviews`: Fetches reviews for a specific book.
 *   - `GET /books/search`: Searches books based on title, genre, author, and year.
 *   - `GET /adaptations/movies/:book_id`: Fetches movie adaptations for a specific book.
 *
 * - **Movie Endpoints**:
 *   - `GET /movies/details`: Fetches movie details.
 *   - `GET /movies/details/:tconst`: Fetches details for a specific movie using its IMDb ID.
 *   - `GET /search/movies`: Searches movies based on title, genre, runtime, and rating.
 *   - `GET /adaptations/books/:tconst`: Fetches book adaptations for a specific movie.
 *
 * - **Analytics Endpoints**:
 *   - `GET /analytics/movies/topMoviesByGenre`: Retrieves the top movies categorized by genre.
 *   - `GET /analytics/books/topAuthors`: Fetches analytics on the top authors based on reviews or ratings.
 *   - `GET /analytics/reviews-movie-ratings`: Retrieves correlation data between review lengths and movie ratings.
 *   - `GET /analytics/PositiveReviewsForBooksVSLowMovieRating`: Analyzes books with positive reviews but low movie ratings.
 */

const express = require('express');
const cors = require('cors');
const config = require('./config');
const routes = require('./routes');


const app = express();
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'], // Allowed methods
}));
// Middleware for parsing JSON bodies
app.use(express.json());

app.post('/signup',routes.signup);
app.post('/login', routes.login);
app.get('/book/details/:book_id', routes.get_book_details);
app.get('/books/reviews', routes.get_book_reviews);
app.get('/adaptations/books/:tconst', routes.get_book_adaptations_for_movie);
app.get('/adaptations/movies/:book_id', routes.get_movie_adaptations_for_book);
app.get('/movies/details', routes.moviesDetails);
app.get('/movies/details/:tconst', routes.moviesDetailsWithId);
app.get('/search/movies', routes.searchMovies);
app.get('/books/search',routes.search_books);
app.get('/analytics/movies/topMoviesByGenre', routes.topMoviesByGenre);
app.get('/analytics/books/topAuthors', routes.book_analytics_top_authors);
app.get('/analytics/reviews-movie-ratings', routes.correlationReviewsMovieRatings);
app.get('/analytics/PositiveReviewsForBooksVSLowMovieRating', routes.PositiveReviewsforBooksvsLowMovierating);
app.get('/analytics/BookAndMovieOutliers', routes.BookAndMovieOutliers);

app.listen(config.server_port, () => {
  console.log(`Server running at http://${config.server_host}:${config.server_port}/`)
});

module.exports = app;
