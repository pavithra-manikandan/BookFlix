# BookFlix

Our project focuses on building an interactive dashboard that allows users to explore and compare reviews of books and their corresponding movie adaptations. 

# Features
Key Features:


- Book Search Functionality: Users can search for books by title or author (and filter by various attributes like genre, authors, year_published), and retrieve detailed information (e.g., author, genre, ratings). Additionally, they can view the movies details, and see if a movie adaptation exists.
- Movie Search Functionality: Users can search for movies by title or genre (and filter by various attributes like genre, isadult, runtime minutes, average rating threshold), and retrieve detailed information (e.g. genre, runtime minutes, average ratings), view the movies details, and see if a movie adaptation exists.
- Movie/Book Adaptation Lookup: Once a book/movie is selected and if its adaptation exists, its corresponding adaptation will be displayed with relevant metadata.
- Review Comparison: A side-by-side comparison of books vs movies from platforms like Amazon for books, and IMDb for movies.
- Dashboard: Shows various different analytics about movies and books from our data
- Bing search: Users can use bing search to look for movies and books that they might not find on our website directly

# Running the Project
To run the project:

cd server
npm install
npm start

cd client
npm install
npm start

On running npm start on client, the webpage should open up on localhost with port 8080. 
