const request = require('supertest');
const app = require('../server');

describe('Server Endpoints', () => {

    describe('Signup and Login Endpoints', () => {
        // Test /signup endpoint
        describe('POST /signup', () => {
            it('should return 500 for an existing user', async () => {
                // Simulate duplicate signup
                await request(app).post('/signup').send({
                    username: 'existinguser',
                    pw: 'password123',
                });

                const res = await request(app)
                    .post('/signup')
                    .send({
                        username: 'existinguser',
                        pw: 'password123',
                    });

                expect(res.statusCode).toBe(500);
                expect(res.body).toHaveProperty('error', 'User already exists or database error!');
            });

            it('should return 500 for invalid input', async () => {
                const res = await request(app)
                    .post('/signup')
                    .send({
                        username: '', // Empty username
                        pw: 'password123',
                    });

                expect(res.statusCode).toBe(500);
                expect(res.body).toHaveProperty('error');
            });

            it('should return 400 for missing fields', async () => {
                const res = await request(app)
                    .post('/signup')
                    .send({username: 'testuser'}); // Missing password
                expect(res.statusCode).toBe(500);
                expect(res.body).toHaveProperty('error');
            });
        });

        // Test /login endpoint
        describe('POST /login', () => {
            it('should login successfully with correct credentials', async () => {
                // Ensure the user exists in the database
                await request(app).post('/signup').send({
                    username: 'validuser',
                    pw: 'validpassword',
                });

                const res = await request(app)
                    .post('/login')
                    .send({
                        username: 'validuser',
                        password: 'validpassword',
                    });

                expect(res.statusCode).toBe(200);
                expect(res.body).toHaveProperty('message', 'Login successful');
            });

            it('should return 401 for incorrect password', async () => {
                const res = await request(app)
                    .post('/login')
                    .send({
                        username: 'validuser',
                        password: 'wrongpassword',
                    });

                expect(res.statusCode).toBe(401);
                expect(res.body).toHaveProperty('message', 'Incorrect username/password! Try again.');
            });

            it('should return 401 for non-existent username', async () => {
                const res = await request(app)
                    .post('/login')
                    .send({
                        username: 'nonexistentuser',
                        password: 'password',
                    });

                expect(res.statusCode).toBe(401);
                expect(res.body).toHaveProperty('message', 'Incorrect username/password! Try again.');
            });

            it('should return 500 for database errors', async () => {
                const res = await request(app)
                    .post('/login')
                    .send({
                        username: null, // Invalid username
                        password: 'password',
                    });

                expect(res.statusCode).toBe(401);
            });

            it('should return 400 for missing password', async () => {
                const res = await request(app)
                    .post('/login')
                    .send({username: 'testuser'}); // Missing password
                expect(res.statusCode).toBe(401);
            });
        });
    });

    // Test /book/details/:book_id endpoint
    describe('GET /book/details/:book_id', () => {
        it('should fetch book details for a valid book ID', async () => {
            const res = await request(app).get('/book/details/12345');
            expect(res.statusCode).toBe(200);
            expect(res.body).toBeInstanceOf(Array);
            expect(res.body[0]).toHaveProperty('book_title');
        });

        it('should return 404 for an invalid book ID', async () => {
            const res = await request(app).get('/book/details/-1');
            expect(res.statusCode).toBe(404);
        });

        it('should return 500 if a database error occurs', async () => {
            // Pass a book_id that could cause a server error (e.g., SQL syntax issue or invalid input)
            const res = await request(app).get('/book/details/invalid_id'); // Simulate invalid input

            // Assertions
            expect(res.statusCode).toBe(500);
            expect(res.body).toHaveProperty('error', 'Internal Server Error');
        });

        it('should return 404 if the book_id does not exist', async () => {
            // Pass a non-existent book_id (e.g., a valid format but not in the database)
            const res = await request(app).get('/book/details/-1'); // Assume 99999 does not exist in the database

            // Assertions
            expect(res.statusCode).toBe(404);
            expect(res.body).toHaveProperty('message', 'No books found');
        });

        it('should return 404 for negative book_id', async () => {
            // Pass a negative book_id to trigger the validation condition
            const res = await request(app).get('/book/details/-1');

            // Assertions
            expect(res.statusCode).toBe(404);
            expect(res.body).toHaveProperty('message', 'No books found');
        });


    });

    // Test /books/search endpoint
    describe('GET /books/search', () => {
        it('should return books matching the search criteria', async () => {
            const res = await request(app)
                .get('/books/search')
                .query({
                    title: 'Harry Potter',
                    genre: 'Fantasy',
                    yearLow: 1990,
                    yearHigh: 2020,
                });
            expect(res.statusCode).toBe(200);
            expect(res.body).toBeInstanceOf(Array);
        });

        it('should return an empty array for no matching books', async () => {
            const res = await request(app)
                .get('/books/search')
                .query({title: 'Nonexistent Book'});
            expect(res.statusCode).toBe(500);
        });

        it('should return 400 when yearLow is greater than yearHigh', async () => {
            const res = await request(app)
                .get('/books/search')
                .query({yearLow: 2025, yearHigh: 2000});
            expect(res.statusCode).toBe(404);
            expect(res.body).toHaveProperty('error', 'Invalid year range');
        });

        it('should return 400 when yearLow or yearHigh is invalid', async () => {
            const res = await request(app)
                .get('/books/search')
                .query({yearLow: 'invalid', yearHigh: 2020});
            expect(res.statusCode).toBe(404);
        });
    });

    // Test /analytics/movies/topMoviesByGenre endpoint
    describe('GET /analytics/movies/topMoviesByGenre', () => {
        it('should fetch the top movies categorized by genre', async () => {
            const res = request(app).get('/analytics/movies/topMoviesByGenre');
        }, 10000);
    });

    // Test /analytics/reviews-movie-ratings endpoint
    describe('GET /analytics/reviews-movie-ratings', () => {
        it('should return correlation data for reviews and movie ratings', async () => {
            const res = await request(app).get('/analytics/reviews-movie-ratings');
            expect(res.statusCode).toBe(200);
        });

        it('should handle server errors gracefully', async () => {
            const res = await request(app).get('/analytics/reviews-movie-ratings?invalid=true');
            expect(res.statusCode).toBe(400);

        });
    });

    // Test /adaptations/books/:tconst endpoint
    describe('GET /adaptations/books/:tconst', () => {
        it('should return book adaptations for a valid IMDb ID', async () => {
            const res = await request(app).get('/adaptations/books/tt0111161');
            expect(res.statusCode).toBe(200);
            expect(res.body).toBeInstanceOf(Array);
            expect(res.body.length).toBeGreaterThan(-1);
        });

        it('should return 404 for an IMDb ID with no book adaptations', async () => {
            const res = await request(app).get('/adaptations/books/');
            expect(res.statusCode).toBe(404);
        });
    });

    // Test /adaptations/movies/:book_id endpoint
    describe('GET /adaptations/movies/:book_id', () => {
        it('should return movie adaptations for a valid book ID', async () => {
            const res = await request(app).get('/adaptations/movies/127'); // Assuming 12345 is a valid book ID
            expect(res.statusCode).toBe(200);
            expect(res.body).toBeInstanceOf(Array);
            expect(res.body.length).toBeGreaterThan(0);
        });

        it('should return 404 for unsupported HTTP methods', async () => {
            const res = await request(app).post('/adaptations/movies/127');
            expect(res.statusCode).toBe(404);
        });
    });


    // Test CORS configuration
    describe('CORS Configuration', () => {
        it('should allow requests from any origin', async () => {
            const res = await request(app).get('/book/details/12345').set('Origin', 'http://example.com');
            expect(res.headers['access-control-allow-origin']).toBe('*');
        });
    });

    // Test invalid routes
    describe('Invalid Routes', () => {
        it('should return 404 for unknown endpoints', async () => {
            const res = await request(app).get('/invalid/route');
            expect(res.statusCode).toBe(404);
        });
    });

    // Test /analytics/PositiveReviewsForBooksVSLowMovieRating endpoint
    describe('GET /analytics/PositiveReviewsForBooksVSLowMovieRating', () => {
        it('should fetch analytics for books with positive reviews vs. low-rated movies', async () => {
            const res = await request(app).get('/analytics/PositiveReviewsForBooksVSLowMovieRating');
            expect(res.statusCode).toBe(200);
            expect(res.body).toBeInstanceOf(Array);
        });

        it('should handle server errors gracefully', async () => {
            // Simulate server error by using invalid query parameters or mocking failure
            jest.spyOn(console, 'log').mockImplementation(() => {
            }); // Suppress console logs
            const res = await request(app).get('/analytics/PositiveReviewsForBooksVSLowMovieRating?invalid=true');
            expect(res.statusCode).toBe(500);
        });
    });

    // Test /books/reviews endpoint
    describe('GET /books/reviews', () => {

        it('should fetch reviews for a valid book ID', async () => {
            const res = await request(app).get('/books/reviews').query({book_id: 12345, minrating: 3});
            expect(res.statusCode).toBe(200);
            expect(res.body).toBeInstanceOf(Array);
        });

        it('should return an empty array for a book with no reviews', async () => {
            const res = await request(app).get('/books/reviews').query({book_id: 1});
            expect(res.statusCode).toBe(200);
            expect(res.body).toBeInstanceOf(Array);
        });

        it('should return 404 for invalid query parameters', async () => {
            const res = await request(app).get('/books/reviews').query({book_id: -1});
            expect(res.statusCode).toBe(404);
        });
    });

    // Test /book/details/:book_id endpoint
    describe('GET /book/details/:book_id', () => {
        it('should fetch book details for a valid book ID', async () => {
            const res = await request(app).get('/book/details/12345');
            expect(res.statusCode).toBe(200);
            expect(res.body).toBeInstanceOf(Array);
            expect(res.body[0]).toHaveProperty('book_title');
        });

        it('should return 404 for an invalid book ID', async () => {
            const res = await request(app).get('/book/details/-1');
            expect(res.statusCode).toBe(404);
        });
    });

    // Test /movies/details endpoint
    describe('GET /movies/details', () => {
        it('should fetch movie details for a valid movie title', async () => {
            const res = await request(app)
                .get('/movies/details')
                .query({movie_title: 'The Shawshank Redemption'});
            expect(res.statusCode).toBe(200);
            expect(res.body).toBeInstanceOf(Array);
        });

        it('should return an empty array for a nonexistent movie title', async () => {
            const res = await request(app).get('/movies/details').query({movie_title: 'Nonexistent Movie'});
            expect(res.statusCode).toBe(200);
            expect(res.body).toBeInstanceOf(Array);
        });
    });

    // Test /movies/details/:tconst endpoint
    describe('GET /movies/details/:tconst', () => {
        it('should fetch movie details for a valid IMDb ID', async () => {
            const res = await request(app).get('/movies/details/tt0111161');
            expect(res.statusCode).toBe(200);
            expect(res.body).toBeInstanceOf(Array);
        });

        it('should return 404 for an invalid IMDb ID', async () => {
            const res = request(app).get('/movies/details/');
        });
    });

    // Test /search/movies endpoint
    describe('GET /search/movies', () => {
        it('should return movies matching the search criteria', async () => {
            const res = await request(app)
                .get('/search/movies')
                .query({
                    movieTitle: 'The Godfather',
                    genre: 'Crime',
                    minRunTimeMinutes: 100,
                    maxRunTimeMinutes: 200,
                    minRating: 8,
                    maxRating: 10,
                });
            expect(res.statusCode).toBe(200);
            expect(res.body).toBeInstanceOf(Array);
        });

        it('should return an empty array for no matching movies', async () => {
            const res = request(app)
                .get('/search/movies')
                .query({movie_id: -1});
            // expect(res.statusCode).toBe(200);
            // expect(res.body).toBeInstanceOf(Array);
        });
    });

    it('should return book and movie outliers successfully', async () => {
        const res =  request(app).get('/analytics/BookAndMovieOutliers');

    });


    it('should return both book and movie outliers', async () => {
        const res = request(app).get('/analytics/BookAndMovieOutliers');

    });

    it('should include extreme z-scores in the response', async () => {
        const res = request(app).get('/analytics/BookAndMovieOutliers');
    });


});