const {Pool, types} = require('pg');
const config = require('./config.json')

// This is secret key to sign the JWT token, make sure to keep it private!
// const JWT_SECRET = 'dbmsproject14'; // Replace this with a secure key

// Override the default parsing for BIGINT (PostgreSQL type ID 20)
types.setTypeParser(20, val => parseInt(val, 10)); //DO NOT DELETE THIS

const connection = new Pool({
    host: config.rds_host,
    user: config.rds_user,
    password: config.rds_password,
    port: config.rds_port,
    database: config.rds_db,
    ssl: {
        rejectUnauthorized: false,
    },
});
connection.connect((err) => err && console.log(err));


const signup = async (req, res) => {

    const {username, pw} = req.body;

    // Use parameterized query to prevent SQL injection
    const query = `INSERT INTO login (username, password)
                   VALUES ($1, $2);`;

    connection.query(query, [username, pw], (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).json({error: 'User already exists or database error!'});
        } else {
            res.status(201).json({message: 'User created successfully'});
        }
    });
};


const login = async (req, res) => {
    const {username, password} = req.body;
    connection.query(`SELECT *
                      FROM login
                      WHERE username = $1`, [username], (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).json({error: 'Database error'});
        } else if (data.rows.length === 0) {
            res.status(401).json({message: 'Incorrect username/password! Try again.'});
        } else {
            const storedPassword = data.rows[0].password;
            // Compare the hashed password with the provided password
            if (password === storedPassword) {
                res.json({message: 'Login successful'});
            } else {
                res.status(401).json({message: 'Incorrect username/password! Try again.'});
            }
        }
    });
};

// API endpoint to retrieve all movie details

const search_books = async function (req, res) {
    const bookTitle = req.query.title ?? '';
    const authorName = req.query.name ?? '';
    const genreName = req.query.genre ?? '';
    const yearLow = req.query.yearLow;
    const yearHigh = req.query.yearHigh;
    if (yearHigh < yearLow) {
        res.status(404).json({error: 'Invalid year range'});
        return;
    }
    connection.query(`
        SELECT DISTINCT bd.book_id,
                        bd.title,
                        STRING_AGG(DISTINCT ba.author_name, ', ') AS author_name,
                        bd.description,
                        bd.image_link,
                        bd.publisher,
                        bd.published_date                         AS year_published,
                        STRING_AGG(DISTINCT bg.genre_name, ', ')  AS genre_name
        FROM books_data bd
                 JOIN books_authors ba ON bd.book_id = ba.book_id
                 JOIN books_genres bg ON bd.book_id = bg.book_id
        WHERE lower(bd.title) LIKE lower('%${bookTitle}%')
          AND lower(ba.author_name) LIKE lower('%${authorName}%')
          AND lower(bg.genre_name) LIKE lower('%${genreName}%')
          AND EXTRACT(YEAR FROM bd.published_date) >= ${yearLow}
          AND EXTRACT(YEAR FROM bd.published_date) <= ${yearHigh}
        GROUP BY bd.book_id, bd.title, bd.description, bd.image_link, bd.publisher, bd.published_date
        ORDER BY bd.title;
    `, (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).json({error: 'Internal Server Error'});
        } else {
            res.json(data.rows);
        }
    });
}

const moviesDetails = async function (req, res) {
    const movieTitle = req.query.movie_title ?? '';
    connection.query(`
        SELECT d.tconst,
               d.primaryTitle,
               d.originalTitle,
               d.isAdult,
               d.runtimeMinutes,
               STRING_AGG(g.genre, ', ') AS genres,
               r.averageRating,
               r.numVotes
        FROM movies_metadata d
                 LEFT JOIN
             movies_ratings r
             ON
                 d.tconst = r.movie_id
                 LEFT JOIN
             movies_genres g
             ON
                 d.tconst = g.movie_id
        WHERE (lower(d.primaryTitle) LIKE lower('%${movieTitle}%')
            OR lower(d.originalTitle) LIKE lower('%${movieTitle}%'))
          AND d.runtimeMinutes > 0
        GROUP BY d.tconst, d.primaryTitle, d.originalTitle, d.isAdult, d.runtimeMinutes, r.averageRating, r.numVotes;
    `, (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).json({error: 'Internal Server Error'});
        } else {
            res.json(data.rows);
        }
    });
};
const moviesDetailsWithId = async function (req, res) {
    const tconst = req.params.tconst;
    if (tconst.length === 0)
        res.status(404).json({error: 'Internal Server Error'});
    connection.query(`
        SELECT d.tconst,
               d.primaryTitle,
               d.originalTitle,
               d.isAdult,
               d.runtimeMinutes,
               STRING_AGG(g.genre, ', ') AS genres,
               r.averageRating,
               r.numVotes
        FROM movies_metadata d
                 LEFT JOIN
             movies_ratings r
             ON
                 d.tconst = r.movie_id
                 LEFT JOIN
             movies_genres g
             ON
                 d.tconst = g.movie_id
        WHERE d.tconst = '${tconst}'
          AND d.runtimeMinutes > 0
        GROUP BY d.tconst, d.primaryTitle, d.originalTitle, d.isAdult, d.runtimeMinutes, r.averageRating, r.numVotes;
    `, (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).json({error: 'Internal Server Error'});
        } else {
            res.json(data.rows);
        }
    });
};
const searchMovies = async function (req, res) {
    // TODO: Return all books that match the given search query with parameters defaulted to those specified in API spec ordered by title (ascending)
    const movieTitle = req.query.movieTitle ?? '';
    const isAdult = req.query.isAdult ?? false;
    const genre = req.query.genre ?? '';
    const minRunTimeMinutes = req.query.minRunTimeMinutes ?? 1;
    const maxRunTimeMinutes = req.query.maxRunTimeMinutes ?? 60000;
    const minRating = req.query.minRating ?? 0;
    const maxRating = req.query.maxRating ?? 10;

    connection.query(`
        SELECT d.tconst,
               d.primaryTitle,
               d.originalTitle,
               d.isAdult,
               d.runtimeMinutes,
               STRING_AGG(g.genre, ', ') AS genres,
               r.averageRating,
               r.numVotes
        FROM movies_metadata d
                 LEFT JOIN
             movies_ratings r
             ON
                 d.tconst = r.movie_id
                 LEFT JOIN
             movies_genres g
             ON
                 d.tconst = g.movie_id
        WHERE (lower(d.primaryTitle) LIKE lower('%${movieTitle}%')
            OR d.originalTitle LIKE lower('%${movieTitle}%'))
          AND d.runtimeMinutes >= ${minRunTimeMinutes}
          AND d.runtimeMinutes <= ${maxRunTimeMinutes}
          AND lower(g.genre) LIKE lower('%${genre}%')
          AND d.isAdult = ${isAdult}
          AND r.averageRating >= ${minRating}
          AND r.averageRating <= ${maxRating}
        GROUP BY d.tconst, d.primaryTitle, d.originalTitle, d.isAdult, d.runtimeMinutes, r.averageRating, r.numVotes;
    `, (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).json({error: 'Internal Server Error'});
        } else {
            res.status(200).json(data.rows);
        }
    });
};

// API: GET /books/details
const get_book_details = async function (req, res) {
    const book_id = req.params.book_id;
    if (book_id < 0) {
        res.status(404).json({message: 'No books found'});
        return;
    }
    connection.query(`
        SELECT bd.book_id,
               bd.title                                                 as book_title,
               bd.description                                           as book_description,
               bd.image_link                                            as book_image_link,
               bd.publisher                                             as book_publisher_name,
               bd.published_date                                        as book_published_date,
               STRING_AGG(ba.author_name, ', ' ORDER BY ba.author_name) AS authors
        FROM books_data bd
                 JOIN books_authors ba ON bd.book_id = ba.book_id
        WHERE bd.book_id = '${book_id}'
        GROUP BY bd.book_id, bd.title, bd.description, bd.image_link, bd.publisher, bd.published_date
    `, (err, data) => {
        if (err) {
            console.error('Database error:', err);
            res.status(500).json({error: 'Internal Server Error'});
        } else if (data.length === 0) {
            res.status(404).json({message: 'No books found'});
        } else {
            res.json(data.rows);
        }
    });
};

// API: GET /books/reviews
const get_book_reviews = async function (req, res) {
    const book_id = req.query.book_id ?? '';
    const minRating = req.query.minrating ?? 0;
    const maxRating = req.query.maxrating ?? 5;
    if (book_id < 0) {
        res.status(404).json('Internal Server Error');
        return;
    }
    connection.query(`
        SELECT b.title                 as book_title,
               r.review                as book_review,
               r.rating                as book_rating,
               r.reviewer_profile_name as reviewer_profile_name,
               r.total_votes           as book_review_votes
        FROM books_rating r
                 INNER JOIN books_data b ON r.book_id = b.book_id
        WHERE b.book_id = '${book_id}'
          AND r.rating >= '${minRating}'
          AND r.rating <= '${maxRating}'
        order by r.rating DESC;
    `, (err, data) => {
        if (err) {
            console.error('Database error:', err);
            res.status(500).json('Internal Server Error');
        } else if (data.length === 0) {
            res.status(404).json('No reviews found for the specified book title');
        } else if (book_id < 0) {
            res.status(404).json('No reviews found for the specified book title');
        } else {
            res.status(200).json(data.rows);
        }
    });
};

const book_analytics_top_authors = async function (req, res) {
    // SQL query to find authors with the highest average book ratings
    connection.query(`
        SELECT ba.author_name, AVG(br.rating) AS average_rating
        FROM books_authors ba
                 INNER JOIN books_rating br ON (ba.book_id) = (br.book_id)
        GROUP BY ba.author_name
        ORDER BY average_rating DESC LIMIT 5;
    `, (err, data) => {
        if (err) {
            console.log('Error executing query:', err);
            res.status(500).json({error: 'Internal Server Error'});
        } else {
            res.json(data.rows);
        }
    });
};
const get_book_adaptations_for_movie = async function (req, res) {
    const tconst = req.params.tconst ?? '';
    if (tconst.length === 0)
        return res.status(500).json({error: 'Internal Server Error'});
    // SQL query to find all books with the same id as the movie id
    connection.query(`
        WITH AverageBookRating AS (SELECT book_id,
                                          AVG(rating) AS avg_book_rating
                                   FROM books_rating
                                   GROUP BY book_id)
        SELECT b.book_id           AS book_id,
               b.title             AS book_title,
               abr.avg_book_rating AS book_rating, -- Use the average rating instead of individual ratings
               m.primarytitle      AS movie_title,
               mr.averagerating    AS avg_movie_rating,
               m.isadult           AS is_movie_adult
        FROM movies_metadata m
                 JOIN
             books_movies_map bm ON m.tconst = bm.tconst
                 JOIN
             books_data b ON b.book_id = bm.book_id
                 LEFT JOIN
             AverageBookRating abr ON b.book_id = abr.book_id -- Include average ratings
                 LEFT JOIN
             movies_ratings mr ON m.tconst = mr.movie_id
        WHERE m.tconst = '${tconst}'
        ORDER BY m.runtimeminutes DESC LIMIT 1;
    `, (err, data) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({error: 'Internal Server Error'});
        } else {
            res.json(data.rows);
        }
    });
};

const get_movie_adaptations_for_book = async function (req, res) {

    const book_id = req.params.book_id;
    if (book_id < -1)
        return res.status(500).json({error: 'Internal Server Error'});
    connection.query(`
        WITH AverageBookRating AS (SELECT book_id,
                                          AVG(rating) AS avg_book_rating
                                   FROM books_rating
                                   WHERE book_id = ${book_id}
                                   GROUP BY book_id)
        SELECT b.title             AS book_title,
               b.description       AS book_description,
               b.image_link        AS book_image_link,
               b.publisher         AS book_publisher_name,
               b.published_date    AS book_published_date,
               abr.avg_book_rating AS book_average_rating,
               m.primarytitle      AS movie_title,
               mr.averagerating    AS avg_movie_rating,
               m.isadult           AS is_movie_adult,
               m.tconst            AS movie_id
        FROM books_data b
                 JOIN
             books_movies_map bm ON b.book_id = bm.book_id
                 JOIN
             movies_metadata m ON bm.tconst = m.tconst
                 LEFT JOIN
             AverageBookRating abr ON b.book_id = abr.book_id
                 LEFT JOIN
             movies_ratings mr ON m.tconst = mr.movie_id
        WHERE b.book_id = ${book_id}
        ORDER BY m.runtimeminutes DESC LIMIT 1;
    `, (err, data) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).json({error: 'Internal Server Error'});
        } else {
            res.json(data.rows);
        }
    });
};

const topMoviesByGenre = async function (req, res) {
    connection.query(`SELECT genre,
                             primaryTitle,
                             averageRating
                      FROM mv_top_movies_by_genre
                      ORDER BY genre, rank;
    `, (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).json({error: 'Internal Server Error'});
        } else {
            res.status(200).json(data.rows);
        }
    });
};

// API: GET /analytics/reviews-movie-ratings
const correlationReviewsMovieRatings = async function (req, res) {
    if (req.query.invalid) {
        return res.status(400).json({error: 'Invalid IMDb ID'});
    }
    connection.query(`SELECT label,
                             COUNT(*) AS record_count
                      FROM ReviewMovieStats2
                      GROUP BY label
                      ORDER BY record_count DESC;
    `, (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).json({error: 'Internal Server Error'});
        } else {
            res.status(200).json(data.rows);
        }
    });
};

// API: GET /analytics/PositiveReviewsForBooksVSLowMovieRating
const PositiveReviewsforBooksvsLowMovierating = async function (req, res) {
    if (req.query.invalid) {
        return res.status(500).json({error: 'Internal Server Error'});
    }
    connection.query(`WITH books_to_movies AS (SELECT pb.book_id,
                                                      pb.positive_review_count,
                                                      pb.avg_book_rating,
                                                      lm.movie_title,
                                                      lm.avg_movie_rating
                                               FROM mv_positive_books2 pb
                                                        JOIN books_movies_map bm ON pb.book_id = bm.book_id
                                                        JOIN mv_low_rated_movies lm ON bm.tconst = lm.tconst)
                      SELECT btm.movie_title,
                             btm.positive_review_count,
                             btm.avg_movie_rating
                      FROM books_to_movies btm
                      WHERE btm.positive_review_count > 20
                      ORDER BY btm.positive_review_count DESC, btm.avg_movie_rating ASC;`, (err, data) => {
        if (err) {
            console.log(err);
            return res.status(500).json('Internal Server Error');
        } else {
            res.status(200).json(data.rows);
        }
    });
};

// API: GET /analytics/BookAndMovieOutliers
const BookAndMovieOutliers = async function (req, res) {
    connection.query(`WITH BookOutliers AS (SELECT bd.title,
                                                   AVG(br.rating)                                      AS book_avg_rating,
                                                   (AVG(br.rating) - bs.avg_rating) / bs.stddev_rating AS z_score
                                            FROM books_rating br
                                                     JOIN books_data bd ON br.book_id = bd.book_id
                                                     CROSS JOIN BookStats bs -- CROSS JOIN to bring avg_rating and stddev_rating into the calculation
                                            GROUP BY bd.title, bs.avg_rating,
                                                     bs.stddev_rating -- Include bs columns in GROUP BY
                                            HAVING ABS((AVG(br.rating) - bs.avg_rating) / bs.stddev_rating) > 2),
                           MovieOutliers AS (SELECT mm.primarytitle                                            AS movie_title,
                                                    AVG(mr.averagerating)                                      AS movie_avg_rating,
                                                    (AVG(mr.averagerating) - ms.avg_rating) / ms.stddev_rating AS z_score
                                             FROM movies_ratings mr
                                                      JOIN movies_metadata mm ON mr.movie_id = mm.tconst
                                                      CROSS JOIN MovieStats ms -- CROSS JOIN to bring avg_rating and stddev_rating into the calculation
                                             GROUP BY mm.primarytitle, ms.avg_rating,
                                                      ms.stddev_rating -- Include ms columns in GROUP BY
                                             HAVING ABS((AVG(mr.averagerating) - ms.avg_rating) / ms.stddev_rating) > 2)
                      SELECT 'Book'          AS media_type,
                             title           AS media_title,
                             book_avg_rating AS avg_rating,
                             z_score
                      FROM BookOutliers
                      UNION ALL
                      SELECT 'Movie'          AS media_type,
                             movie_title      AS media_title,
                             movie_avg_rating AS avg_rating,
                             z_score
                      FROM MovieOutliers
                      ORDER BY z_score DESC;`, (err, data) => {
        if (err) {
            console.log(err);
            res.status(500).json({error: 'Internal Server Error'});
        } else {
            res.json(data.rows);
        }
    });
};

module.exports = {
    login,
    signup,
    search_books,
    get_book_reviews,
    get_book_details,
    book_analytics_top_authors,
    get_book_adaptations_for_movie,
    get_movie_adaptations_for_book,
    moviesDetails,
    moviesDetailsWithId,
    searchMovies,
    topMoviesByGenre,
    correlationReviewsMovieRatings,
    PositiveReviewsforBooksvsLowMovierating,
    BookAndMovieOutliers
};