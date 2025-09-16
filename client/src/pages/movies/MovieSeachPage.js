/**
 * MovieSearchPage Component
 *
 * This component provides a search interface for finding movies based on various filters,
 * such as title, genre, rating, runtime, and adult content. It fetches data dynamically
 * from an API and displays the results in a paginated table.
 *
 * **Purpose**:
 * - To enable users to perform advanced movie searches with customizable filters.
 * - Display results in a structured and interactive table using Material-UI's DataGrid.
 *
 * **Features**:
 * 1. **Search Filters**:
 *    - Movie Title: Allows users to search for movies by their title.
 *    - Genre: Dropdown to select the genre (e.g., Action, Comedy, Drama).
 *    - Adult Content: Dropdown to filter for adult or non-adult movies.
 *    - Rating Range: Slider to specify a rating range (1 to 10).
 *    - Runtime Range: Slider to filter movies by runtime in minutes.
 *
 * 2. **Dynamic Results**:
 *    - Fetches matching movies from the backend API based on the selected filters.
 *    - Results are displayed in a paginated table with key details such as title, genre,
 *      runtime, rating, and IMDb ID.
 *
 * 3. **Interactive Table**:
 *    - Clicking on an IMDb ID navigates the user to the movie's details page.
 *    - Supports pagination and customizable rows per page.
 *
 * 4. **Loading and Error States**:
 *    - Displays a loading spinner while the API call is in progress.
 *    - Shows an error message if no movies are found or if the API call fails.
 *
 * **How It Works**:
 * - **State Management**:
 *   - `title`: Tracks the user-inputted movie title.
 *   - `genre`: Stores the selected genre.
 *   - `isAdult`: Indicates if the user wants to filter adult content.
 *   - `rating` and `runTimeMinutes`: Store the selected rating and runtime ranges.
 *   - `rows`: Stores the fetched movie data to display in the table.
 *   - `pageSize`: Controls the number of rows displayed per page in the table.
 *   - `errorMessage`: Displays an error if the search fails or no results are found.
 *   - `loading`: Tracks whether the API call is in progress.
 *
 * - **API Integration**:
 *   - Sends a GET request to the `/search/movies` endpoint with the selected filters.
 *   - Maps the API response to rows for display in the DataGrid.
 *
 * **UI Design**:
 * - **Search Filters**:
 *   - Organized into a responsive grid for a clean and user-friendly layout.
 *   - Material-UI components (TextField, Select, Slider) are used for consistency.
 *
 * - **Results Table**:
 *   - Displays key movie information like title, runtime, genre, and rating.
 *   - Clicking on an IMDb ID navigates to the movie details page (`/movies/details/:tconst`).
 *
 * **Error Handling**:
 * - Displays a loading spinner while fetching results.
 * - Shows an error message if the API call fails or if no results match the filters.
 *
 * **Customization**:
 * - Add or remove search filters by modifying the `genres` array or the sliders for ratings and runtime.
 * - Update the DataGrid columns to include additional movie details if needed.
 */

import React, { useState } from "react";
import {
    Box,
    Button,
    Container,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    Slider,
    TextField,
    Typography,
    CircularProgress,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";

const config = require("../../config.json");

function MovieSearchPage() {
    const [title, setTitle] = useState("");
    const [isAdult, setIsAdult] = useState(false);
    const [genre, setGenre] = useState("");
    const [rating, setRating] = useState([1, 10]);
    const [runTimeMinutes, setRunTimeMinutes] = useState([0, 60000]);
    const [rows, setRows] = useState([]);
    const [pageSize, setPageSize] = useState(5);
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false); // New state for loader
    const navigate = useNavigate();

    const genres = [
        "All",
        "Action",
        "Adult",
        "Adventure",
        "Animation",
        "Biography",
        "Comedy",
        "Crime",
        "Documentary",
        "Drama",
        "Family",
        "Fantasy",
        "Film-Noir",
        "Game-Show",
        "History",
        "Horror",
        "Music",
        "Musical",
        "Mystery",
        "News",
        "Reality-TV",
        "Romance",
        "Sci-Fi",
        "Short",
        "Sport",
        "Talk-Show",
        "Thriller",
        "War",
        "Western",
    ];

    const columns = [
        {
            field: "tconst",
            headerName: "IMDB ID",
            flex: 0.5,
            renderCell: (params) => (
                <Button
                    color="primary"
                    onClick={() =>
                        navigate(`/movies/details/${encodeURIComponent(params.row.tconst)}`)
                    }
                >
                    {params.value}
                </Button>
            ),
        },
        { field: "primarytitle", headerName: "Primary Movie Title", flex: 2 },
        { field: "originaltitle", headerName: "Original Movie Title", flex: 2 },
        { field: "genres", headerName: "Genre", flex: 1 },
        { field: "isadult", headerName: "Adult", flex: 0.5 },
        { field: "runtimeminutes", headerName: "Runtime (Min)", flex: 1 },
        { field: "averagerating", headerName: "Rating", flex: 1 },
        { field: "numvotes", headerName: "Number of Votes", flex: 1 },
    ];

    const search = () => {
        setErrorMessage("");
        setLoading(true); // Show loader before API call
        fetch(
            `http://${config.server_host}:${config.server_port}/search/movies?` +
            `movieTitle=${encodeURIComponent(title)}` +
            `&genre=${encodeURIComponent(genre)}` +
            `&isAdult=${encodeURIComponent(isAdult)}` +
            `&minRunTimeMinutes=${runTimeMinutes[0]}&maxRunTimeMinutes=${runTimeMinutes[1]}` +
            `&minRating=${rating[0]}&maxRating=${rating[1]}`
        )
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Network response was not ok " + res.statusText);
                }
                return res.json();
            })
            .then((resJson) => {
                if (resJson.length === 0) {
                    setErrorMessage("No movies found matching your search criteria.");
                    setRows([]);
                } else {
                    const moviesWithId = resJson.map((movie, index) => ({
                        id: index,
                        ...movie,
                    }));
                    setRows(moviesWithId);
                }
            })
            .catch((error) => {
                setErrorMessage("Error fetching movie data: " + error.message);
                console.error("Error fetching movie data:", error);
            })
            .finally(() => setLoading(false)); // Hide loader after API call
    };

    return (
        <Container sx={{ padding: 4 }}>
            <Typography variant="h4" align="center" sx={{ mb: 4 }}>
                Search Movies
            </Typography>

            <Grid container spacing={4}>
                <Grid item xs={12} md={4}>
                    <TextField
                        fullWidth
                        label="Movie Title"
                        variant="outlined"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </Grid>

                <Grid item xs={12} md={4}>
                    <FormControl fullWidth variant="outlined">
                        <InputLabel>Genre</InputLabel>
                        <Select
                            label="Genre"
                            value={genre}
                            onChange={(e) => setGenre(e.target.value)}
                        >
                            {genres.map((g) => (
                                <MenuItem key={g} value={g === "All" ? "" : g}>
                                    {g}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={12} md={4}>
                    <FormControl fullWidth variant="outlined">
                        <InputLabel>Adult</InputLabel>
                        <Select
                            label="Adult"
                            value={isAdult}
                            onChange={(e) => setIsAdult(e.target.value)}
                        >
                            <MenuItem value={false}>No</MenuItem>
                            <MenuItem value={true}>Yes</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Typography gutterBottom>Rating Range (1 to 10)</Typography>
                    <Slider
                        value={rating}
                        onChange={(e, newVal) => setRating(newVal)}
                        valueLabelDisplay="auto"
                        min={1}
                        max={10}
                        step={0.1}
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <Typography gutterBottom>
                        Runtime Minutes Range (1 to 60000)
                    </Typography>
                    <Slider
                        value={runTimeMinutes}
                        onChange={(e, newVal) => setRunTimeMinutes(newVal)}
                        valueLabelDisplay="auto"
                        min={1}
                        max={60000}
                        step={1}
                    />
                </Grid>
            </Grid>

            <Box sx={{ mt: 3, mb: 3, textAlign: "center" }}>
                <Button variant="contained" size="large" onClick={search}>
                    Search
                </Button>
            </Box>

            {loading && (
                <Box sx={{ textAlign: "center", mt: 4 }}>
                    <CircularProgress />
                </Box>
            )}

            {errorMessage && (
                <Typography
                    variant="body1"
                    color="error"
                    align="center"
                    sx={{ mb: 2 }}
                >
                    {errorMessage}
                </Typography>
            )}

            {!loading && !errorMessage && (
                <>
                    <Typography variant="h5" sx={{ mb: 2 }}>
                        Results
                    </Typography>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        pageSize={pageSize}
                        rowsPerPageOptions={[5, 10, 25]}
                        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                        autoHeight
                        sx={{
                            border: "1px solid #ddd",
                            borderRadius: 2,
                            "& .MuiDataGrid-row:hover": {
                                backgroundColor: "#f5f5f5",
                                cursor: "pointer",
                            },
                            "& .MuiDataGrid-row.Mui-selected": {
                                backgroundColor: "#e3f2fd",
                            },
                        }}
                    />
                </>
            )}
        </Container>
    );
}

export default MovieSearchPage;