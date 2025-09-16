/**
 * AdaptationsPage Component
 *
 * This component displays the adaptation details of a book or movie. It handles both directions:
 * - A book adapted into a movie.
 * - A movie adapted from a book.
 *
 * **Purpose**:
 * - To provide detailed information about the book and its movie adaptation (or vice versa).
 * - Fetch and display data dynamically based on the route parameters (`book_id` or `tconst`).
 * - Compare and highlight which format (book or movie) is more highly rated.
 *
 * **Features**:
 * 1. **Dynamic Data Fetching**:
 *    - Fetches book or movie details from a server based on `book_id` or `tconst` (movie IMDb ID).
 *    - Uses the OMDB API to retrieve additional details about the movie, such as the plot, director, actors, and awards.
 *
 * 2. **Comparison Logic**:
 *    - Normalizes the book’s average rating (scaling it to match the movie's rating scale).
 *    - Determines if the book or movie is the "Recommended" adaptation based on ratings.
 *
 * 3. **Responsive Design**:
 *    - Uses Material-UI’s `Grid` and `Card` components to create a responsive layout with two cards: one for the book and one for the movie.
 *
 * 4. **Interactive UI**:
 *    - Hover effects on cards to enhance interactivity.
 *    - Displays a "Recommended" chip on the card with the higher rating.
 *
 * **How It Works**:
 * - **Route Parameters**:
 *   - The page uses `useParams` to read either `book_id` or `tconst` from the URL.
 *   - If `tconst` is provided (movie route), the book ID is fetched first, followed by its adaptations.
 * - **API Calls**:
 *   - Fetches book and movie adaptation data from a custom server.
 *   - Uses the OMDB API for detailed movie information (poster, actors, awards, etc.).
 * - **State Management**:
 *   - `adaptationData`: Stores the fetched adaptation data (book and movie details).
 *   - `movieDetailsOmdb`: Stores the detailed movie data from OMDB.
 *   - `loading`: Indicates if data is still being fetched.
 *   - `error`: Stores any errors encountered during API calls.
 *
 * **Key Components**:
 * 1. **Movie Card**:
 *    - Displays:
 *      - Movie title, IMDb ID, genre, runtime, and average rating.
 *      - Additional details from OMDB: plot, actors, director, language, and country.
 *    - Includes a "Recommended" chip if the movie rating exceeds the book rating.
 *
 * 2. **Book Card**:
 *    - Displays:
 *      - Book title, publisher, publication date, and average rating.
 *      - Book description and cover image.
 *    - Includes a "Recommended" chip if the book rating exceeds the movie rating.
 *
 * **Styling Highlights**:
 * - Pastel colors (`#e6ffe6` for movies, `#ffe6e6` for books) to differentiate sections.
 * - Subtle shadow and hover scaling effects on cards to enhance interactivity.
 * - Rounded corners and responsive layout ensure a modern, polished design.
 *
 * **Error Handling**:
 * - Displays an error message if:
 *   - The adaptation data cannot be fetched.
 *   - There are no adaptations available for the provided book or movie.
 *
 * **Loading State**:
 * - Displays a centered spinner while data is being fetched.

 * **Utility Functions**:
 * - `toTitleCase`: Converts text to title case for consistent formatting.
 * - `truncateText`: Shortens text to a specified length, appending ellipses if necessary.
 * <Route path="/adaptations/books/:book_id" element={<AdaptationsPage />} />
 * <Route path="/adaptations/movies/:tconst" element={<AdaptationsPage />} />
 */

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    Container,
    Grid,
    Card,
    CardContent,
    Typography,
    CircularProgress,
    Box,
    Chip,
    Alert,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import config from "../config.json";

const AdaptationsPage = () => {
    const { book_id, tconst } = useParams();
    const [adaptationData, setAdaptationData] = useState(null);
    const [movieDetailsOmdb, setMovieDetailsOmdb] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [noAdaptations, setNoAdaptations] = useState(false); // New state for no adaptations

    useEffect(() => {
        const fetchAdaptationDetails = async () => {
            try {
                setError("");
                setNoAdaptations(false); // Reset no adaptations state
                setLoading(true);
                let effectiveBookId = book_id;

                if (tconst) {
                    const bookFetchResponse = await fetch(
                        `http://${config.server_host}:${config.server_port}/adaptations/books/${tconst}`
                    );

                    if (!bookFetchResponse.ok) {
                        throw new Error("Failed to fetch book adaptation for the movie.");
                    }

                    const bookFetchData = await bookFetchResponse.json();
                    if (!bookFetchData.length) {
                        setNoAdaptations(true); // No adaptations found for the movie
                        return;
                    }

                    if (bookFetchData[0].book_id) {
                        effectiveBookId = bookFetchData[0].book_id;
                    } else {
                        setNoAdaptations(true); // No associated book for the movie adaptation
                        return;
                    }
                }

                const adaptationResponse = await fetch(
                    `http://${config.server_host}:${config.server_port}/adaptations/movies/${effectiveBookId}`
                );

                if (!adaptationResponse.ok) {
                    throw new Error("Failed to fetch movie adaptation for the book.");
                }

                const adaptationDataResult = await adaptationResponse.json();

                if (!adaptationDataResult.length) {
                    setNoAdaptations(true); // No adaptations found for the book
                    return;
                }

                const adaptation = adaptationDataResult[0];
                setAdaptationData(adaptation);

                if (adaptation.movie_id) {
                    const omdbResponse = await fetch(
                        `http://www.omdbapi.com/?i=${adaptation.movie_id}&apikey=ca0c24f7`
                    );

                    if (!omdbResponse.ok) {
                        throw new Error("Failed to fetch OMDB movie details.");
                    }

                    const omdbData = await omdbResponse.json();
                    setMovieDetailsOmdb(omdbData);
                }
            } catch (err) {
                setError(err.message || "An unexpected error occurred.");
            } finally {
                setLoading(false);
            }
        };

        fetchAdaptationDetails();
    }, [book_id, tconst]);

    const toTitleCase = (str) =>
        str
            ?.toLowerCase()
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");

    const truncateText = (text, maxLength) => {
        if (text?.length > maxLength) {
            return `${text.slice(0, maxLength)}...`;
        }
        return text;
    };

    const bookRatingNormalized = adaptationData?.book_average_rating ? adaptationData.book_average_rating * 2 : 0;
    const movieRating = parseFloat(adaptationData?.avg_movie_rating) || 0;
    const isBookRecommended = bookRatingNormalized > movieRating;

    if (loading) {
        return (
            <Container sx={{ textAlign: "center", mt: 4 }}>
                <CircularProgress />
            </Container>
        );
    }

    if (error) {
        return (
            <Container sx={{ textAlign: "center", mt: 4 }}>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    if (noAdaptations) {
        return (
            <Container sx={{ textAlign: "center", mt: 4 }}>
                <Alert severity="error">No adaptations exist for the provided book or movie.</Alert>
            </Container>
        );
    }

    return (
        <Container sx={{ mt: 4 }}>
            <Grid container spacing={6}>
                {/* Movie Card */}
                <Grid item xs={12} md={6}>
                    <Card
                        sx={{
                            backgroundColor: "#e6ffe6",
                            boxShadow: "0 6px 20px rgba(0, 0, 0, 0.15)",
                            borderRadius: "16px",
                            padding: 3,
                            height: "100%",
                            position: "relative",
                            transition: "transform 0.3s ease, box-shadow 0.3s ease",
                            "&:hover": {
                                transform: "scale(1.03)",
                                boxShadow: "0 12px 25px rgba(0, 0, 0, 0.3)",
                            },
                        }}
                    >
                        {!isBookRecommended && (
                            <Chip
                                icon={<StarIcon />}
                                label="Recommended"
                                color="primary"
                                sx={{
                                    position: "absolute",
                                    top: 16,
                                    right: 16,
                                    fontWeight: "bold",
                                    fontSize: "0.9rem",
                                }}
                            />
                        )}
                        <Box sx={{ textAlign: "center", mb: 3 }}>
                            <Box
                                component="img"
                                src={movieDetailsOmdb?.Poster || 'https://via.placeholder.com/400x600?text=No+Image'}
                                alt="Movie Poster"
                                sx={{
                                    width: "100%",
                                    maxWidth: "300px",
                                    aspectRatio: "2 / 3",
                                    borderRadius: "12px",
                                    boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.2)",
                                    objectFit: "cover",
                                }}
                            />
                        </Box>
                        <CardContent>
                            <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2, color: "#2e7d32" }}>
                                Movie
                            </Typography>
                            <Typography variant="body1"><strong>Title:</strong> {toTitleCase(adaptationData.movie_title)}</Typography>
                            <Typography variant="body1"><strong>IMDb ID:</strong> {adaptationData.movie_id}</Typography>
                            <Typography variant="body1"><strong>Genre:</strong> {movieDetailsOmdb?.Genre || "N/A"}</Typography>
                            <Typography variant="body1"><strong>Runtime:</strong> {movieDetailsOmdb?.Runtime || "N/A"}</Typography>
                            <Typography variant="body1"><strong>Average Rating:</strong> {movieRating}</Typography>
                            <Typography variant="body1"><strong>Awards:</strong> {movieDetailsOmdb?.Awards || "N/A"}</Typography>
                            <Typography variant="body1"><strong>Actors:</strong> {movieDetailsOmdb?.Actors || "N/A"}</Typography>
                            <Typography variant="body1"><strong>Director:</strong> {movieDetailsOmdb?.Director || "N/A"}</Typography>
                            <Typography variant="body1"><strong>Released:</strong> {movieDetailsOmdb?.Released || "N/A"}</Typography>
                            <Typography variant="body1"><strong>Language:</strong> {movieDetailsOmdb?.Language || "N/A"}</Typography>
                            <Typography variant="body1"><strong>Country:</strong> {movieDetailsOmdb?.Country || "N/A"}</Typography>
                            <Typography variant="body2" sx={{ mt: 2, textAlign: "justify" }}>
                                <strong>Plot:</strong> {truncateText(movieDetailsOmdb?.Plot || "No Plot Available", 200)}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Book Card */}
                <Grid item xs={12} md={6}>
                    <Card
                        sx={{
                            backgroundColor: "#ffe6e6",
                            boxShadow: "0 6px 20px rgba(0, 0, 0, 0.15)",
                            borderRadius: "16px",
                            padding: 3,
                            height: "100%",
                            position: "relative",
                            transition: "transform 0.3s ease, box-shadow 0.3s ease",
                            "&:hover": {
                                transform: "scale(1.03)",
                                boxShadow: "0 12px 25px rgba(0, 0, 0, 0.3)",
                            },
                        }}
                    >
                        {isBookRecommended && (
                            <Chip
                                icon={<StarIcon />}
                                label="Recommended"
                                color="primary"
                                sx={{
                                    position: "absolute",
                                    top: 16,
                                    right: 16,
                                    fontWeight: "bold",
                                    fontSize: "0.9rem",
                                }}
                            />
                        )}
                        <Box sx={{ textAlign: "center", mb: 3 }}>
                            <Box
                                component="img"
                                src={adaptationData.book_image_link || "https://via.placeholder.com/400x600?text=No+Image"}
                                alt={adaptationData.book_title || "No Image Available"}
                                onError={(e) => {
                                    e.target.onerror = null; // Prevent infinite loop if the placeholder also fails
                                    e.target.src = "https://via.placeholder.com/400x600?text=No+Image";
                                }}
                                sx={{
                                    width: "100%",
                                    maxWidth: "300px",
                                    aspectRatio: "2 / 3",
                                    borderRadius: "12px",
                                    boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.2)",
                                    objectFit: "cover",
                                }}
                            />
                        </Box>
                        <CardContent>
                            <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2, color: "#d32f2f" }}>
                                Book
                            </Typography>
                            <Typography variant="body1"><strong>Title:</strong> {toTitleCase(adaptationData.book_title)}</Typography>
                            <Typography variant="body1"><strong>Publisher:</strong> {adaptationData.book_publisher_name || "N/A"}</Typography>
                            <Typography variant="body1"><strong>Published Date:</strong> {adaptationData.book_published_date || "N/A"}</Typography>
                            <Typography variant="body1"><strong>Rating:</strong> {adaptationData.book_average_rating || "N/A"}</Typography>
                            <Typography variant="body2" sx={{ mt: 2, textAlign: "justify" }}>
                                <strong>Description:</strong> {truncateText(adaptationData.book_description || "No Description Available", 200)}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
};

export default AdaptationsPage;