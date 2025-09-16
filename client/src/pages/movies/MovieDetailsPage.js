/**
 * MovieDetailsPage Component
 *
 * This component displays detailed information about a specific movie. It fetches data from both
 * a custom backend and the OMDB API to provide comprehensive movie details, including title, director,
 * cast, genre, ratings, plot, and more.
 *
 * **Purpose**:
 * - To serve as a dedicated movie details page that provides both basic and advanced movie data.
 * - To allow users to navigate to the book adaptation of the movie, if available.
 *
 * **Features**:
 * 1. **Dynamic Data Fetching**:
 *    - Fetches movie details from:
 *      - A custom server using the movie's `tconst` identifier.
 *      - OMDB API for extended information like the plot, awards, and box office details.
 *
 * 2. **Responsive Layout**:
 *    - Uses Material-UI’s `Grid` and `Paper` components for a clean, responsive layout.
 *    - Displays the movie poster alongside its details in a two-column format.
 *
 * 3. **Interactive Navigation**:
 *    - Includes a button that allows users to navigate to the book adaptation of the movie, if applicable.
 *
 * **How It Works**:
 * - **Route Parameter**:
 *   - Extracts the movie's `tconst` (IMDb ID) from the route parameters using `useParams`.
 *
 * - **API Calls**:
 *   - `fetchMovieDetails`: Fetches basic movie details (e.g., genres, average rating) from the backend.
 *   - `fetchMovieData`: Fetches detailed movie data (e.g., plot, actors, director) from the OMDB API.
 *
 * - **State Management**:
 *   - `movieDetails`: Stores the movie details fetched from the backend.
 *   - `movieDetailsFromIMDB`: Stores detailed movie information from the OMDB API.
 *   - `loading`: Indicates whether the data is being fetched.
 *   - `posterUrl`: Stores the URL of the movie poster.
 *
 * **UI Design**:
 * - **Movie Poster**:
 *   - Displays the movie poster on the left side of the page.
 *   - Uses a placeholder image if no poster is available.
 *
 * - **Movie Details**:
 *   - Displays detailed information such as:
 *     - Title, director, actors, release date, runtime, genre, average rating, language, country, awards, box office, and plot.
 *
 * - **Button**:
 *   - A button at the bottom of the page allows users to navigate to the book adaptation page.
 *
 * **Error Handling**:
 * - Displays a loading spinner while fetching data.
 * - Shows an error message if movie details cannot be fetched.
 * - Defaults to a placeholder image if the poster URL is unavailable.
 *
 * **Styling Highlights**:
 * - Movie Poster:
 *   - Styled with rounded corners and a subtle shadow for a polished look.
 *
 * - Movie Details Section:
 *   - Typography components are used for consistent text styling.
 *   - Key details are highlighted using bold labels (e.g., "Directed By:", "Actors:").
 */

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, CircularProgress, Button, Grid, Paper } from "@mui/material";
const config = require('../../config.json');

function MovieDetailsPage() {
  const { tconst } = useParams();
  const navigate = useNavigate();
  const [movieDetails, setMovieDetails] = useState('');
  const [movieDetailsFromIMDB, setMovieDetailsFromIMDB] = useState('');
  const [loading, setLoading] = useState(true);
  const [posterUrl, setPosterUrl] = useState('');

  const fetchMovieDetails = async () => {
    try {
      const response = await fetch(
          `http://${config.server_host}:${config.server_port}/movies/details/${encodeURIComponent(tconst)}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch movie details");
      }
      const data = await response.json();
      setMovieDetails(data[0]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMovieData = async () => {
    const response = await fetch(`http://www.omdbapi.com/?i=${tconst}&apikey=ca0c24f7`);
    const data = await response.json();
    setMovieDetailsFromIMDB(data);
    setPosterUrl(data.Poster || 'https://via.placeholder.com/300x450?text=No+Image');
  };

  useEffect(() => {
    fetchMovieData();
    fetchMovieDetails();
  }, [tconst]);

  if (loading) {
    return (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <CircularProgress />
        </Box>
    );
  }

  if (!movieDetails) {
    return (
        <Typography variant="h6" color="error" sx={{ textAlign: "center", mt: 5 }}>
          No details available for this movie.
        </Typography>
    );
  }

  return (
      <Box sx={{ padding: 4 }}>
        <Paper sx={{ padding: 3, borderRadius: 2, boxShadow: 3 }}>
          <Grid container spacing={4}>
            {/* Movie Poster */}
            <Grid item xs={12} md={4}>
              <img
                  src={posterUrl}
                  alt="Movie Poster"
                  style={{width: "100%", borderRadius: "8px", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)"}}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/300x450?text=No+Image';
                  }}
              />
            </Grid>

            {/* Movie Information */}
            <Grid item xs={12} md={8}>
              <Typography variant="h4" gutterBottom>
                {movieDetails.primarytitle
                    .toLowerCase()
                    .replace(/\b\w/g, (char) => char.toUpperCase())
                    .replace(/'\w/g, (char) => char.toLowerCase())}
              </Typography>

              {movieDetailsFromIMDB.Director && (
                  <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                    <strong>Directed By:</strong> {movieDetailsFromIMDB.Director}
                  </Typography>
              )}

              {movieDetailsFromIMDB.Actors && (
                  <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                    <strong>Actors:</strong> {movieDetailsFromIMDB.Actors}
                  </Typography>
              )}
              {movieDetailsFromIMDB.Released && (
                  <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                    <strong>Released:</strong> {movieDetailsFromIMDB.Released}
                  </Typography>
              )}
              {movieDetailsFromIMDB.Runtime && (
                  <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                    <strong>Runtime (Minutes):</strong> {movieDetailsFromIMDB.Runtime}
                  </Typography>
              )}

              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                <strong>Genre:</strong> {movieDetails.genres
                  .toLowerCase()
                  .replace(/\b\w/g, (char) => char.toUpperCase())
                  .replace(/'\w/g, (char) => char.toLowerCase())}
              </Typography>

              {movieDetails.averagerating && (
                  <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                    <strong>Average Rating:</strong> {movieDetails.averagerating}
                  </Typography>
              )}

              {movieDetailsFromIMDB.Language && (
                  <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                    <strong>Language:</strong> {movieDetailsFromIMDB.Language}
                  </Typography>
              )}

              {movieDetailsFromIMDB.Country && (
                  <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                    <strong>Country:</strong> {movieDetailsFromIMDB.Country}
                  </Typography>
              )}

              {movieDetailsFromIMDB.Awards && (
                  <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                    <strong>Awards:</strong> {movieDetailsFromIMDB.Awards}
                  </Typography>
              )}

              {movieDetailsFromIMDB.BoxOffice && (
                  <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                    <strong>BoxOffice:</strong> {movieDetailsFromIMDB.BoxOffice}
                  </Typography>
              )}

              {movieDetailsFromIMDB.Plot && (
                  <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                    <strong>Plot:</strong> {movieDetailsFromIMDB.Plot}
                  </Typography>
              )}
            </Grid>
          </Grid>
          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Button
                variant="contained"
                color="primary"
                onClick={() => navigate(`/adaptations/books/${tconst}`)}
            >
              Show Book Adaptation
            </Button>
          </Box>
        </Paper>
      </Box>
  );
}

export default MovieDetailsPage;