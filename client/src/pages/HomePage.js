/**
 * HomePage Component
 *
 * This component serves as the landing page for the application. It provides an introduction to
 * the app's purpose and lets users navigate to key features, such as book search, movie search,
 * and the analytics dashboard.
 *
 * **Purpose**:
 * - Acts as the entry point for users visiting the app.
 * - Highlights the app’s features and provides clear call-to-action buttons for navigation.
 * - Creates a visually appealing and responsive layout to ensure a good user experience.
 *
 * **Sections**:
 * 1. **Header**:
 *    - Includes the app’s name, "BookFlix," styled with a split color scheme (green for "Book" and red for "Flix").
 *    - Displays a tagline ("Your Gateway to the World of Books and Movies") and a brief description of the app's functionality.
 *
 * 2. **Main Content**:
 *    - Provides three main buttons for navigation:
 *      - **Search Books**: Takes the user to the book search page (`/search/books`).
 *      - **Search Movies**: Takes the user to the movie search page (`/search/movies`).
 *      - **Go to Dashboard**: Navigates to the analytics dashboard (`/dashboard`).
 *    - Buttons are styled with a consistent red theme and hover effects for better interactivity.
 *
 * 3. **Footer**:
 *    - Contains a "Contact Us" link that navigates to the contact page (`/contact-us`).
 *    - Styled with a subtle grey background and underlined text on hover.
 *
 * **Features**:
 * - Fully responsive layout, adjusting content placement and spacing for different screen sizes.
 * - Consistent use of Material-UI components for styling and layout.
 * - Clean and modern design with a focus on pastel colors and red accents.
 *
 * **Navigation Handlers**:
 * - `handleBookSearch`: Navigates to the book search page.
 * - `handleMovieSearch`: Navigates to the movie search page.
 * - `handleDashboard`: Navigates to the analytics dashboard.
 *
 * **Key Design Choices**:
 * - Used a light pastel pink header to create a welcoming and soft visual impression.
 * - Buttons and links are styled with red to align with the app's primary theme.
 * - Fonts are chosen for readability and elegance (e.g., "Georgia" for the app name, "Roboto" for body text).
 */

import React from 'react';
import { Box, Typography, Button, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function HomePage() {
    const navigate = useNavigate();

    const handleBookSearch = () => {
        navigate('/search/books');
    };

    const handleMovieSearch = () => {
        navigate('/search/movies');
    };

    const handleDashboard = () => {
        navigate('/dashboard');
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100vh',
                fontFamily: 'Roboto, sans-serif',
                backgroundColor: '#fefefe',
                margin: 0,
                padding: 0,
            }}
        >
            {/* Header Section */}
            <Box
                sx={{
                    textAlign: 'center',
                    padding: '50px',
                    backgroundColor: '#ffe6e9', // Light pastel pink
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '8px',
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: '48px',
                            fontWeight: 'bold',
                            fontFamily: 'Georgia, serif',
                            color: '#3cb371', // Light Green
                        }}
                    >
                        Book
                    </Typography>
                    <Typography
                        sx={{
                            fontSize: '48px',
                            fontWeight: 'bold',
                            fontFamily: 'Georgia, serif',
                            color: '#f44336', // Red
                        }}
                    >
                        Flix
                    </Typography>
                </Box>
                <Typography
                    sx={{
                        fontSize: '20px',
                        fontStyle: 'italic',
                        color: '#4f4f4f',
                        marginTop: '10px',
                    }}
                >
                    Your Gateway to the World of Books and Movies
                </Typography>
                <Typography
                    sx={{
                        maxWidth: '600px',
                        margin: '20px auto',
                        fontSize: '16px',
                        lineHeight: '1.8',
                        color: '#4f4f4f',
                        textAlign: 'justify',
                    }}
                >
                    Discover, compare, and explore the best of books and movies all in one
                    place. Whether you're searching for your next great read or a blockbuster
                    movie night, BookFlix has you covered. Dive into reviews, track adaptations,
                    and uncover new stories like never before!
                </Typography>
            </Box>

            {/* Button Section */}
            <Box
                sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px',
                }}
            >
                <Typography
                    sx={{
                        fontSize: '22px',
                        fontWeight: 'bold',
                        color: '#333',
                        marginBottom: '20px',
                    }}
                >
                    What would you like to do?
                </Typography>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '16px',
                        width: '100%',
                        maxWidth: '300px',
                    }}
                >
                    <Button
                        sx={{
                            backgroundColor: '#f44336',
                            color: 'white',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            textTransform: 'none',
                            padding: '10px 20px',
                            borderRadius: '8px',
                            transition: 'background-color 0.3s ease',
                            cursor: 'pointer',
                            '&:hover': {
                                backgroundColor: '#f44336',
                            },
                        }}
                        onClick={handleBookSearch}
                    >
                        Search Books
                    </Button>
                    <Button
                        sx={{
                            backgroundColor: '#f44336',
                            color: 'white',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            textTransform: 'none',
                            padding: '10px 20px',
                            borderRadius: '8px',
                            transition: 'background-color 0.3s ease',
                            cursor: 'pointer',
                            '&:hover': {
                                backgroundColor: '#c00000',
                            },
                        }}
                        onClick={handleMovieSearch}
                    >
                        Search Movies
                    </Button>
                    <Button
                        sx={{
                            backgroundColor: '#f44336',
                            color: 'white',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            textTransform: 'none',
                            padding: '10px 20px',
                            borderRadius: '8px',
                            transition: 'background-color 0.3s ease',
                            cursor: 'pointer',
                            '&:hover': {
                                backgroundColor: '#c00000',
                            },
                        }}
                        onClick={handleDashboard}
                    >
                        Go to Dashboard
                    </Button>
                </Box>
            </Box>

            {/* Footer Section */}
            <Box
                sx={{
                    textAlign: 'center',
                    padding: '20px',
                    backgroundColor: '#f7f7f7',
                    borderTop: '1px solid #e0e0e0',
                }}
            >
                <Link
                    href="/contact-us"
                    sx={{
                        fontSize: '16px',
                        fontWeight: 'bold',
                        color: '#f44336',
                        textDecoration: 'none',
                        '&:hover': {
                            textDecoration: 'underline',
                        },
                    }}
                >
                    Contact Us
                </Link>
            </Box>
        </Box>
    );
}

export default HomePage;