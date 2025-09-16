/**
 * BookDetailsPage Component
 *
 * This component displays detailed information about a specific book and its reviews.
 * It provides a way to view and filter reviews by rating and navigate to the movie adaptation
 * of the book (if available).
 *
 * **Purpose**:
 * - To serve as a detailed book information page.
 * - Fetch and display book reviews with filtering functionality.
 * - Allow navigation to the movie adaptation of the book.
 *
 * **Features**:
 * 1. **Book Details**:
 *    - Displays the book's title, author, publisher, publication date, average rating, and description.
 *    - Shows a cover image or a placeholder if the image is not available.
 *
 * 2. **Reviews Section**:
 *    - Fetches and displays user reviews for the book.
 *    - Allows filtering reviews by rating range using a slider.
 *    - Reviews are displayed in a carousel for better user experience.
 *
 * 3. **Interactive Navigation**:
 *    - Provides a button to navigate to the movie adaptation of the book.
 *
 * **How It Works**:
 * - **API Calls**:
 *   - Fetches book details using the book ID (`book_id`) from the route parameter.
 *   - Fetches reviews related to the book when the user toggles the "Show Reviews" button.
 *
 * - **State Management**:
 *   - `bookDetails`: Stores the fetched details of the book.
 *   - `reviews`: Stores the list of all reviews fetched from the API.
 *   - `filteredReviews`: Stores the reviews filtered based on the rating slider.
 *   - `ratingFilter`: Tracks the selected range of ratings for filtering.
 *   - `loading` and `reviewsLoading`: Track whether the book details or reviews are still being fetched.
 *   - `showReviews`: Toggles the visibility of the reviews section.
 *
 * **UI Design**:
 * - **Book Details Section**:
 *   - Displays the book cover image on the left and detailed information on the right.
 *   - Uses Material-UI `Typography` for structured text presentation.
 *
 * - **Reviews Section**:
 *   - A toggleable section that fetches and displays reviews when expanded.
 *   - Includes a slider to filter reviews based on their rating.
 *   - Reviews are displayed in a responsive carousel using `react-slick`.
 *   - Each review card includes the reviewer's name, review text, rating, and vote count.
 *
 * - **Navigation Button**:
 *   - Provides a button to navigate to the movie adaptation page for the book.
 *
 * **Error Handling**:
 * - Displays a loading spinner while fetching data.
 * - Shows an error message if the book details or reviews cannot be fetched.
 * - Displays a message if no reviews are available for the selected rating range.
 *
 * **Customization**:
 * - Update the `fetchBookDetails` or `fetchReviews` API calls to include additional data fields if needed.
 * - Customize the styles of the review cards or book details using Material-UI's `sx` property.
 */
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, CircularProgress, Button, Grid, Paper, Slider } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import SliderCarousel from "react-slick";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const config = require("../../config.json");

function BookDetailsPage() {
    const { book_id } = useParams();
    const navigate = useNavigate();
    const [bookDetails, setBookDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [reviews, setReviews] = useState([]);
    const [filteredReviews, setFilteredReviews] = useState([]);
    const [reviewsLoading, setReviewsLoading] = useState(true);
    const [showReviews, setShowReviews] = useState(false);
    const [ratingFilter, setRatingFilter] = useState([1, 5]); // Initial range from 1 to 5

    const fetchBookDetails = async () => {
        try {
            const response = await fetch(
                `http://${config.server_host}:${config.server_port}/book/details/${encodeURIComponent(book_id)}`
            );
            if (!response.ok) {
                throw new Error("Failed to fetch book details");
            }
            const data = await response.json();
            setBookDetails(data[0]);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchReviews = async () => {
        setReviewsLoading(true);
        try {
            const response = await fetch(
                `http://${config.server_host}:${config.server_port}/books/reviews?book_id=${encodeURIComponent(book_id)}`
            );
            if (!response.ok) {
                throw new Error("Failed to fetch reviews");
            }
            const data = await response.json();
            const uniqueReviews = Array.from(
                new Map(data.map((review) => [review.review_id || review.book_review, review])).values()
            );
            setReviews(uniqueReviews);
            setFilteredReviews(uniqueReviews); // Default filtered reviews are all reviews
        } catch (error) {
            console.error(error);
        } finally {
            setReviewsLoading(false);
        }
    };

    const handleShowReviews = () => {
        setShowReviews(!showReviews);
        if (!showReviews) fetchReviews();
    };

    const handleRatingFilterChange = (event, newRange) => {
        setRatingFilter(newRange);
        const filtered = reviews.filter(
            (review) => review.book_rating >= newRange[0] && review.book_rating <= newRange[1]
        );
        setFilteredReviews(filtered);
    };

    useEffect(() => {
        fetchBookDetails();
    }, [book_id]);

    const CustomPrevArrow = ({ onClick }) => (
        <IconButton
            onClick={onClick}
            sx={{
                position: "absolute",
                top: "50%",
                left: "-40px",
                transform: "translateY(-50%)",
                backgroundColor: "#fff",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                zIndex: 1,
                "&:hover": { backgroundColor: "#f3f3f3" },
            }}
        >
            <ArrowBackIosIcon />
        </IconButton>
    );

    const CustomNextArrow = ({ onClick }) => (
        <IconButton
            onClick={onClick}
            sx={{
                position: "absolute",
                top: "50%",
                right: "-40px",
                transform: "translateY(-50%)",
                backgroundColor: "#fff",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                zIndex: 1,
                "&:hover": { backgroundColor: "#f3f3f3" },
            }}
        >
            <ArrowForwardIosIcon />
        </IconButton>
    );

    const reviewSliderSettings = {
        dots: true,
        dotsClass: "slick-dots",
        infinite: filteredReviews.length > 1, // Prevent looping if only one review
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        prevArrow: <CustomPrevArrow />,
        nextArrow: <CustomNextArrow />,
        appendDots: (dots) => (
            <div
                style={{
                    position: "absolute",
                    bottom: "10px",
                    display: "flex",
                    justifyContent: "center",
                    padding: "0",
                    width: "100%",
                }}
            >
                <ul style={{ margin: "0", padding: "0", display: "flex" }}>{dots}</ul>
            </div>
        ),
        customPaging: () => (
            <div
                style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    backgroundColor: "#000",
                    opacity: 0.5,
                    transition: "opacity 0.3s ease",
                }}
            />
        ),
    };

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!bookDetails) {
        return (
            <Typography variant="h6" color="error" sx={{ textAlign: "center", mt: 5 }}>
                No details available for this book.
            </Typography>
        );
    }

    return (
        <Box sx={{ padding: 4 }}>
            <Paper sx={{ padding: 3, borderRadius: 2, boxShadow: 3 }}>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={4}>
                        <Box
                            component="img"
                            src={bookDetails.book_image_link || 'https://via.placeholder.com/400x600?text=No+Image'}
                            alt={bookDetails.book_title || "No Image Available"}
                            onError={(e) => {
                                e.target.onerror = null; // Prevents infinite loop
                                e.target.src = 'https://via.placeholder.com/400x600?text=No+Image';
                            }}
                            sx={{
                                width: "100%",
                                aspectRatio: "2 / 3",
                                borderRadius: "8px",
                                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                                objectFit: "cover",
                            }}
                        />
                    </Grid>

                    <Grid item xs={12} md={8}>
                        <Typography variant="h4" gutterBottom>
                            {bookDetails.book_title}
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                            <strong>Author:</strong> {bookDetails.authors || "Unknown"}
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                            <strong>Publisher:</strong> {bookDetails.book_publisher_name || "Unknown"}
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                            <strong>Published Date:</strong> {bookDetails.book_published_date || "Unknown"}
                        </Typography>
                        <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
                            <strong>Description:</strong> {bookDetails.book_description || "No description available."}
                        </Typography>
                    </Grid>
                </Grid>

                <Box sx={{ mt: 5 }}>
                    <Button variant="contained" onClick={handleShowReviews} sx={{ mb: 2 }}>
                        {showReviews ? "Hide Reviews" : "Show Reviews"}
                    </Button>

                    {showReviews && reviewsLoading && (
                        <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                            <CircularProgress />
                        </Box>
                    )}

                    {showReviews && !reviewsLoading && reviews.length > 0 && (
                        <>
                            <Typography variant="h6" gutterBottom>
                                Filter Reviews by Rating:
                            </Typography>
                            <Slider
                                value={ratingFilter}
                                onChange={handleRatingFilterChange}
                                valueLabelDisplay="auto"
                                min={1}
                                max={5}
                                sx={{ mb: 3 }}
                            />
                            <SliderCarousel {...reviewSliderSettings} style={{ minHeight: "300px" }}>
                                {filteredReviews.map((review, index) => (
                                    <Box
                                        key={review.review_id || index}
                                        sx={{
                                            backgroundColor: "#ffe6f0",
                                            padding: 3,
                                            borderRadius: 2,
                                            textAlign: "center",
                                            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                                            height: "300px",
                                            overflow: "hidden",
                                            display: "flex",
                                            flexDirection: "column",
                                            justifyContent: "center",
                                        }}
                                    >
                                        <Typography variant="body2" color="text.secondary">
                                            {review.reviewer_profile_name}
                                        </Typography>
                                        <Typography
                                            variant="body1"
                                            sx={{
                                                mt: 1,
                                                whiteSpace: "nowrap",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                            }}
                                        >
                                            "{review.book_review}"
                                        </Typography>
                                        <Typography variant="body2" sx={{ mt: 1 }}>
                                            Rating: {review.book_rating} | Votes: {review.book_review_votes}
                                        </Typography>
                                    </Box>
                                ))}
                            </SliderCarousel>
                        </>
                    )}

                    {showReviews && !reviewsLoading && filteredReviews.length === 0 && (
                        <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", mt: 2 }}>
                            No reviews available for the selected rating range.
                        </Typography>
                    )}
                </Box>

                <Box sx={{ textAlign: "center", mt: 4 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate(`/adaptations/movies/${book_id}`)}
                    >
                        Show Movie Adaptation
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
}

export default BookDetailsPage;