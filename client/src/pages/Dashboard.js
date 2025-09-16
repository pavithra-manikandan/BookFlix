/**
 * Dashboard Component
 *
 * This is a React component  built to display a dashboard with various data visualizations for movies,
 * reviews, and books. The main purpose is to show analytics fetched from APIs and organize them in a
 * user-friendly way. Here's what it includes:
 *
 * 1. **Top Movies by Genre**:
 *    - Displays movies grouped by genre in a responsive grid.
 *    - For each genre, there’s a slider showing cards with details like title, genre, and rating.
 *
 * 2. **Correlation between Review Length and Movie Ratings**:
 *    - This section shows the relationship between the length of reviews and movie ratings.
 *    - The data is displayed in cards with labels and counts.
 *
 * 3. **Contrasting Data (Books vs. Movies)**:
 *    - A table that highlights books with high positive reviews but movies with lower ratings.
 *    - The table supports pagination and shows book titles, movie titles, positive review counts, and ratings.
 *
 * **What we Focused On**:
 * - Making it easy to read and visually clean using Material-UI for components like grids, cards, and tables.
 * - Adding sliders (React-Slick) to make the movie genre section more dynamic and interactive.
 * - Using consistent colors (pastel pinks and subtle reds) for a modern and clean look.
 * - Making the table paginated so it can handle a lot of data smoothly.
 *
 * **How It Works**:
 * - Data is fetched from APIs, and the component is designed to display this data in three sections.
 * - I added a utility function, `toTitleCase`, to make sure text formatting is consistent.
 * - The component handles loading states and errors gracefully with spinners and alerts.
 *
 * **Endpoints Used**:
 * - `/analytics/movies/topMoviesByGenre`: Gets the movies grouped by genre.
 * - `/analytics/reviews-movie-ratings`: Gets data for the correlation between review lengths and ratings.
 * - `/analytics/PositiveReviewsForBooksVSLowMovieRating`: Fetches data for books vs. movies.
 */

import React, { useState, useEffect, useRef } from "react";
import {
    Card,
    CardContent,
    Typography,
    CircularProgress,
    Alert,
    Container,
    Grid,
    Divider,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TablePagination,
} from "@mui/material";
import Slider from "react-slick";
import config from "../config.json";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Dashboard = () => {
    const [movies, setMovies] = useState([]);
    const [reviewRatingData, setReviewRatingData] = useState([]);
    const [ContrastingData, setContrastingData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [page, setPage] = useState(0);
    const [outliers, setOutliers] = useState([]);
    const [outliersPage, setOutliersPage] = useState(0);
    const [loadingOutliers, setLoadingOutliers] = useState(false);
    const [errorOutliers, setErrorOutliers] = useState("");
    const rowsPerPageOutliers = 10;
    const rowsPerPage = 25;

    const isFetched = useRef(false);
    const fetchOutliersData = async () => {
        setLoadingOutliers(true);
        try {
            const response = await fetch(
                `http://${config.server_host}:${config.server_port}/analytics/BookAndMovieOutliers`
            );
            if (!response.ok) {
                throw new Error("Failed to fetch outliers data");
            }
            const data = await response.json();
            setOutliers(data);
        } catch (error) {
            setErrorOutliers(error.message);
        } finally {
            setLoadingOutliers(false);
        }
    };

    useEffect(() => {
        fetchOutliersData();
    }, []);

    const handleOutliersPageChange = (event, newPage) => {
        setOutliersPage(newPage);
    };

    const paginatedOutliers = outliers.slice(
        outliersPage * rowsPerPageOutliers,
        outliersPage * rowsPerPageOutliers + rowsPerPageOutliers
    );
    // Function to capitalize the first letter of each word
    const toTitleCase = (str) => {
        return str
            ?.toLowerCase()
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    };

    const fetchData = async () => {
        try {
            const response = await fetch(
                `http://${config.server_host}:${config.server_port}/analytics/movies/topMoviesByGenre`
            );
            if (!response.ok) {
                throw new Error("Failed to fetch movie details");
            }
            const data = await response.json();
            setMovies(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isFetched.current) return;
        isFetched.current = true;
        fetchData();
    }, []);

    const fetchReviewRatingData = async () => {
        try {
            const response = await fetch(
                `http://${config.server_host}:${config.server_port}/analytics/reviews-movie-ratings`
            );
            if (!response.ok) {
                throw new Error("Failed to fetch correlation data");
            }
            const data = await response.json();
            setReviewRatingData(data);
        } catch (error) {
            setError(error.message);
        }
    };

    useEffect(() => {
        fetchReviewRatingData();
    }, []);

    const fetchContrastingData = async () => {
        try {
            const response = await fetch(
                `http://${config.server_host}:${config.server_port}/analytics/PositiveReviewsForBooksVSLowMovieRating`
            );
            if (!response.ok) {
                throw new Error("Failed to fetch contrasting data");
            }
            const rawData = await response.json();
            setContrastingData(rawData);
        } catch (error) {
            setError(error.message);
        }
    };

    useEffect(() => {
        fetchContrastingData();
    }, []);

    const ArrowButton = ({ direction, onClick }) => (
        <div
            onClick={onClick}
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#f8cdd3", // Light pink background
                color: "#e57373", // Subtle red color for arrows
                width: "20px", // Smaller size
                height: "20px",
                cursor: "pointer",
                zIndex: 2,
                position: "absolute",
                [direction === "left" ? "left" : "right"]: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                fontSize: "12px",
                fontWeight: "bold",
                transition: "all 0.3s ease",
                ":hover": {
                    backgroundColor: "#fab8c2", // Slightly darker pink on hover
                },
            }}
        >
            {direction === "left" ? "‹" : "›"}
        </div>
    );

    const sliderSettings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        nextArrow: <ArrowButton direction="right" />,
        prevArrow: <ArrowButton direction="left" />,
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    if (loading) {
        return (
            <Container sx={{ mt: 4, textAlign: "center" }}>
                <CircularProgress />
            </Container>
        );
    }

    if (error) {
        return (
            <Container sx={{ mt: 4 }}>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    // Group movies by genre
    const genresArray = Object.entries(
        movies.reduce((acc, movie) => {
            if (!acc[movie.genre]) {
                acc[movie.genre] = [];
            }
            acc[movie.genre].push(movie);
            return acc;
        }, {})
    );

    const paginatedData = ContrastingData.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    return (
        <Container sx={{ mt: 4 }}>
            <Typography
                variant="h4"
                align="center"
                gutterBottom
                sx={{ fontWeight: "bold", color: "#333" }}
            >
                Top Movies by Genre
            </Typography>
            <Divider sx={{ mb: 4, borderBottomWidth: 2, borderColor: "#e57373" }} />

            <Grid container spacing={4}>
                {genresArray.map(([genre, genreMovies]) => (
                    <Grid item xs={12} md={6} lg={4} key={genre}>
                        <Typography
                            variant="h5"
                            gutterBottom
                            sx={{
                                textAlign: "center",
                                fontWeight: "bold",
                                color: "#333", // Black text for genre headings
                            }}
                        >
                            {genre.charAt(0).toUpperCase() + genre.slice(1)} Movies
                        </Typography>
                        <Slider {...sliderSettings}>
                            {genreMovies.slice(0, 5).map((movie, idx) => (
                                <Card
                                    key={idx}
                                    sx={{
                                        height: "300px",
                                        width: "100%",
                                        margin: "auto",
                                        borderRadius: "16px",
                                        boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)",
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "space-between",
                                        backgroundColor: "#fff4f5", // Light pastel pink
                                        padding: "16px",
                                    }}
                                >
                                    <CardContent
                                        sx={{
                                            textAlign: "center",
                                            flexGrow: 1,
                                        }}
                                    >
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                fontWeight: "bold",
                                                color: "#e57373", // Subtle red text
                                                marginBottom: "8px",
                                            }}
                                        >
                                            {movie.primarytitle}
                                        </Typography>
                                        <Typography
                                            variant="body1"
                                            sx={{ color: "#555", marginBottom: "8px" }}
                                        >
                                            Genre: {toTitleCase(genre)}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{ color: "#777" }}
                                        >
                                            Rating: {movie.averagerating}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            ))}
                        </Slider>
                    </Grid>
                ))}
            </Grid>

            <Divider sx={{ my: 6, borderBottomWidth: 2, borderColor: "#e57373" }} />
            <Typography
                variant="h4"
                align="center"
                gutterBottom
                sx={{ fontWeight: "bold", color: "#333" }}
            >
                Correlation between Review Length and Movie Ratings
            </Typography>
            <Grid container spacing={4} sx={{ mt: 4 }}>
                {reviewRatingData.map((item, idx) => (
                    <Grid item xs={12} sm={6} md={4} key={idx}>
                        <Card
                            sx={{
                                height: "200px",
                                borderRadius: "16px",
                                boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)",
                                backgroundColor: "#fff4f5", // Light pastel pink
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                                textAlign: "center",
                                padding: "16px",
                            }}
                        >
                            <Typography
                                variant="h6"
                                sx={{ fontWeight: "bold", color: "#e57373", mb: 1 }}
                            >
                                {item.label}
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{ color: "#555" }}
                            >
                                Count: {item.record_count}
                            </Typography>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Divider sx={{ my: 6, borderBottomWidth: 2, borderColor: "#e57373" }} />
            <Typography
                variant="h4"
                align="center"
                gutterBottom
                sx={{ fontWeight: "bold", color: "#333" }}
            >
                Contrasting Data (Books vs. Movies)
            </Typography>
            {ContrastingData.length > 0 ? (
                <Container>
                    <Table
                        sx={{
                            width: "100%",
                            borderCollapse: "collapse",
                            mt: 4,
                            backgroundColor: "#fff", // White table rows
                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                            borderRadius: "12px",
                            overflow: "hidden",
                        }}
                    >
                        <TableHead>
                            <TableRow>
                                {["Book Title", "Movie Title", "Positive Reviews", "Movie Rating"].map(
                                    (header, idx) => (
                                        <TableCell
                                            key={idx}
                                            align="center"
                                            sx={{
                                                fontWeight: "bold",
                                                backgroundColor: "#e57373", // Subtle red header
                                                color: "white",
                                                padding: "10px",
                                            }}
                                        >
                                            {toTitleCase(header)}
                                        </TableCell>
                                    )
                                )}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginatedData.map((item, idx) => (
                                <TableRow
                                    key={idx}
                                    sx={{
                                        backgroundColor: idx % 2 === 0 ? "#f8f8f8" : "#fff", // Alternating row colors
                                    }}
                                >
                                    <TableCell align="center">{toTitleCase(item.movie_title)}</TableCell>
                                    <TableCell align="center">{toTitleCase(item.movie_title)}</TableCell>
                                    <TableCell align="center">
                                        {item.positive_review_count}
                                    </TableCell>
                                    <TableCell align="center">{item.avg_movie_rating}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <TablePagination
                        component="div"
                        count={ContrastingData.length}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        rowsPerPageOptions={[25]}
                    />
                </Container>
            ) : (
                <Typography align="center">No data available</Typography>
            )}
            <Container>
            {/* Book and Movie Outliers */}
            <Divider sx={{ my: 6, borderBottomWidth: 2, borderColor: "#e57373" }} />
            <Typography
                variant="h4"
                align="center"
                gutterBottom
                sx={{ fontWeight: "bold", color: "#333" }}
            >
                Book and Movie Outliers
            </Typography>
            {loadingOutliers ? (
                <Container sx={{ textAlign: "center", mt: 4 }}>
                    <CircularProgress />
                </Container>
            ) : errorOutliers ? (
                <Container sx={{ mt: 4 }}>
                    <Alert severity="error">{errorOutliers}</Alert>
                </Container>
            ) : outliers.length > 0 ? (
                <Grid container spacing={4} sx={{ mt: 4 }}>
                    {paginatedOutliers.map((item, idx) => (
                        <Grid item xs={12} sm={6} md={4} key={idx}>
                            <Card
                                sx={{
                                    borderRadius: "16px",
                                    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)",
                                    backgroundColor: "#fff4f5",
                                    padding: "16px",
                                    textAlign: "center",
                                }}
                            >
                                <CardContent>
                                    <Typography
                                        variant="h6"
                                        sx={{ fontWeight: "bold", color: "#e57373" }}
                                    >
                                        {item.media_type}
                                    </Typography>
                                    <Typography variant="body1" sx={{ color: "#555", mt: 1 }}>
                                        {item.media_title}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: "#777", mt: 1 }}>
                                        Average Rating: {item.avg_rating.toFixed(2)}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: "#777", mt: 1 }}>
                                        Z-Score: {item.z_score.toFixed(2)}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Typography align="center" sx={{ mt: 4 }}>
                    No outliers data available.
                </Typography>
            )}
            <TablePagination
                component="div"
                count={outliers.length}
                page={outliersPage}
                onPageChange={handleOutliersPageChange}
                rowsPerPage={rowsPerPageOutliers}
                rowsPerPageOptions={[10]}
                sx={{ mt: 4 }}
            />
        </Container>
            
        </Container>
    );
};

export default Dashboard;