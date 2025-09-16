/**
 * BookSearchPage Component
 *
 * This component provides an interface for users to search for books based on various filters,
 * such as title, author, genre, and publication year. It fetches and displays the results
 * in a paginated table using Material-UI's DataGrid.
 *
 * **Purpose**:
 * - To allow users to search and explore books with specific criteria.
 * - Display search results dynamically in a structured and interactive table.
 *
 * **Features**:
 * 1. **Search Filters**:
 *    - **Title**: Search for books by their title.
 *    - **Author**: Search for books by the author's name.
 *    - **Genre**: Select from predefined genres or search for all genres.
 *    - **Year Published**: Use a slider to specify a range of publication years.
 *
 * 2. **Dynamic Results**:
 *    - Fetches books matching the specified filters from the backend API.
 *    - Displays results in a paginated table with key details like title, author, genre, and year of publication.
 *
 * 3. **Interactive Table**:
 *    - Clicking on a Book ID navigates to the detailed page for that book.
 *    - Supports pagination and customizable rows per page.
 *
 * 4. **Loading and Error States**:
 *    - Displays a loading spinner while fetching results.
 *    - Shows an error message if no books are found or if the API call fails.
 *
 * **How It Works**:
 * - **API Calls**:
 *   - Sends a GET request to the `/books/search` endpoint with the selected filters as query parameters.
 *   - Parses and maps the API response to rows for display in the DataGrid.
 *
 * - **State Management**:
 *   - `title`, `author`, `genre`, `yearPublished`: Track the current search filters.
 *   - `rows`: Stores the list of books fetched from the API.
 *   - `pageSize`: Controls the number of rows displayed per page in the table.
 *   - `errorMessage`: Displays an error message if the search fails or no results are found.
 *   - `loading`: Tracks whether the search is in progress.
 *
 * **UI Design**:
 * - **Search Filters**:
 *   - Organized into a responsive grid layout for user-friendly navigation.
 *   - Includes Material-UI components like `TextField`, `Select`, and `Slider` for a consistent design.
 *
 * - **Results Table**:
 *   - Displays key book details like ID, title, author, genre, and publication year.
 *   - Clicking on a Book ID navigates to the book details page (`/book/details/:book_id`).
 *
 * - **Loading and Error Messages**:
 *   - Displays a loading spinner while results are being fetched.
 *   - Shows an error message if no results match the filters or if the API call fails.
 *
 * **Error Handling**:
 * - Displays appropriate error messages for network errors or empty results.
 * - Uses a loading spinner to indicate progress during API calls.
 *
 * **Customization**:
 * - Add more search filters by expanding the form inputs and updating the API query parameters.
 * - Modify the `columns` array in the DataGrid to include additional fields like ratings or reviews.
 *
 * **Example Search Workflow**:
 * 1. User enters "Harry Potter" in the title field, selects "Fiction" as the genre, and adjusts the year slider.
 * 2. Clicks the "Search" button.
 * 3. The component fetches matching books from the API and displays them in a paginated table.
 * 4. User clicks on a Book ID to navigate to the detailed page for that book.
 *
 * **Key Props**:
 * - `title`, `author`, `genre`, `yearPublished`: Define the user's search criteria.
 * - `rows`: Holds the results of the search to display in the DataGrid.
 * - `errorMessage`: Displays error messages if the search fails or no results are found.
 * - `loading`: Indicates the loading state while fetching results.
 */
import React, { useState } from 'react';
import {
    Container, TextField, Button, Select, MenuItem, FormControl, InputLabel, Slider, Typography, Grid, Box, CircularProgress
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
const config = require('../../config.json');


function BookSearchPage() {
    const [title, setTitle] = useState('');
    const [genre, setGenre] = useState('');
    const [author, setAuthor] = useState('');
    const [yearPublished, setYearPublished] = useState([1900, 2024]);
    const [rows, setRows] = useState([]);
    const [pageSize, setPageSize] = useState(5);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false); // New state for loader
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState([]);
    const subscriptionKey = 'da76a9c5c8ee4ade9f619372d8660c1d';
    const endpoint = 'https://api.bing.microsoft.com/v7.0/search';



   

  const columns = [
    {
      field: 'book_id',
      headerName: 'Book ID',
      flex: 0.5,
      renderCell: (params) => (
        <Button
          color="primary"
          onClick={() => navigate(`/book/details/${encodeURIComponent(params.row.book_id)}`)}
       
          style={{
            wordWrap: 'break-word', // Enable word wrapping
            whiteSpace: 'nowrap',   // Allow the button to wrap text
            overflow:'hidden',
            textOverflow: 'ellipsis', // Handle overflow with ellipsis
            display: 'block',
            textAlign: 'left'       
          }}
        >
          {params.value}
        </Button>
      ),
    },
    { field: "title", headerName: "Title", width: 500 },
    { field: 'author_name', headerName: 'Author', width: 200 },
    { field: 'genre_name', headerName: 'Genre', width: 250 },
    // { field: 'rating', headerName: 'Rating', width: 100 },
    { field: 'year_published', headerName: 'Year', width: 105 },

  ];


    const search = () => {
        setErrorMessage('');
        setLoading(true); // Show loader before API call
        const [yearLow, yearHigh] = yearPublished;


        fetch(`http://${config.server_host}:${config.server_port}/books/search?` +
            `title=${encodeURIComponent(title)}` +
            `&name=${encodeURIComponent(author)}` +
            `&genre=${encodeURIComponent(genre)}` +
            `&yearLow=${yearLow}&yearHigh=${yearHigh}`
        )
            .then(res => {
                if (!res.ok) {
                    throw new Error('Network response was not ok ' + res.statusText);
                }
                return res.json();
            })
            .then(resJson => {
                if (resJson.length === 0) {
                    setErrorMessage('No books found matching your search criteria.');
                    setRows([]);
                } else {
                    const booksWithId = resJson.map((book, index) => ({ id: index, ...book }));
                    setRows(booksWithId);
                }
            })
            .catch(error => {
                setErrorMessage('Error fetching book data: ' + error.message);
                console.error('Error fetching book data:', error);
            })
            .finally(() => setLoading(false));
            
    };

    return (
        <Container sx={{ padding: 4 }}>
            <Typography variant="h4" align="center" sx={{ mb: 4 }}>
                Search Books
            </Typography>
            <Grid container spacing={4}>
                <Grid item xs={12} md={4}>
                    <TextField
                        fullWidth
                        label="Title"
                        variant="outlined"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </Grid>

                <Grid item xs={12} md={4}>
                    <TextField
                        fullWidth
                        label="Author"
                        variant="outlined"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
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
                            <MenuItem value="">All</MenuItem>
                            <MenuItem value="Fiction">Fiction</MenuItem>
                            <MenuItem value="Religion">Religion</MenuItem>
                            <MenuItem value="History">History</MenuItem>
                            <MenuItem value="Juvenile Fiction">Juvenile Fiction</MenuItem>
                            <MenuItem value="Biography & Autobiography">Biography & Autobiography</MenuItem>
                            <MenuItem value="Business & Economics">Business & Economics</MenuItem>
                            <MenuItem value="Computers">Computers</MenuItem>
                            <MenuItem value="Social Science">Social Science</MenuItem>
                            <MenuItem value="Juvenile Nonfiction">Juvenile Nonfiction</MenuItem>
                            <MenuItem value="Education">Education</MenuItem>
                            <MenuItem value="Science">Science</MenuItem>
                            <MenuItem value="Cooking">Cooking</MenuItem>
                            <MenuItem value="Sports & Recreation">Sports & Recreation</MenuItem>
                            <MenuItem value="Family & Relationships">Family & Relationships</MenuItem>
                            <MenuItem value="Literary Criticism">Literary Criticism</MenuItem>
                            <MenuItem value="Art">Art</MenuItem>
                            <MenuItem value="Music">Music</MenuItem>
                            <MenuItem value="Medical">Medical</MenuItem>
                            <MenuItem value="Body">Body</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Typography gutterBottom>Year Published</Typography>
                    <Slider
                        value={yearPublished}
                        onChange={(e, newVal) => setYearPublished(newVal)}
                        valueLabelDisplay="auto"
                        min={1900}
                        max={2024}
                        step={1}
                    />
                </Grid>
            </Grid>

            <Box sx={{ mt: 3, mb: 3, display: 'flex', justifyContent: 'center' }}>
                <Button variant="contained" onClick={search}>Search</Button>
            </Box>

            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                    <CircularProgress />
                </Box>
            )}

            {errorMessage && (
                <Typography variant="body1" color="error" sx={{ mb: 2, textAlign: 'center' }}>
                    {errorMessage}
                </Typography>
            )}

            {!loading && !errorMessage && (
                <>
                    <Typography variant="h5" sx={{ mb: 2 }}>Results</Typography>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        pageSize={pageSize}
                        rowsPerPageOptions={[5, 10, 25]}
                        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                        autoHeight
                    />
                </>
            )}
        </Container>

    
    );

}


export default BookSearchPage;