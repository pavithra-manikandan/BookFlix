/**
 * App Component
 *
 * This is the root component of the application, responsible for setting up the overall structure,
 * theming, and routing. It uses Material-UI for theming and React Router for navigation between pages.
 *
 * **Key Features**:
 * 1. **Theming**:
 *    - Uses Material-UI's `ThemeProvider` to apply a global theme across the app.
 *    - The theme includes a primary color (red) and a secondary color (grey).
 *    - `CssBaseline` is used to provide a consistent baseline for styling (e.g., removing default margins and paddings).
 *
 * 2. **Routing**:
 *    - Implements navigation between different pages using `react-router-dom`.
 *    - Each page is mapped to a specific route (`path`) using the `<Route>` component.
 *    - The `NavBar` component is always rendered, providing a consistent navigation menu across all pages.
 *
 * 3. **Authentication**:
 *    - The `AuthProvider` wraps the application to manage user authentication context.
 *    - Includes a `ProtectedRoute` component for securing specific routes (e.g., pages that require the user to be logged in).
 *
 * **Pages and Routes**:
 * - **Auth Pages**:
 *   - `/` (LoginPage): Default page for user login.
 *   - `/signup`: User registration page.
 *
 * - **Search Pages**:
 *   - `/search/books`: Book search page.
 *   - `/search/movies`: Movie search page.
 *   - `/book/details/:book_id`: Detailed view of a book.
 *   - `/movies/details/:tconst`: Detailed view of a movie.
 *
 * - **Adaptations**:
 *   - `/adaptations/books/:tconst`: View movie adaptations of a book.
 *   - `/adaptations/movies/:book_id`: View book adaptations of a movie.
 *
 * - **Utility Pages**:
 *   - `/home`: The home page of the application.
 *   - `/contact-us`: Contact information page.
 *   - `/dashboard`: Dashboard showcasing analytics and insights.
 *   - `/bing`: A Bing search page (for custom searches).
 *
 * **Structure**:
 * - `BrowserRouter`: Wraps the app to enable React Router functionalities.
 * - `NavBar`: A consistent navigation bar rendered across all pages.
 * - `Routes`: Contains all route definitions.
 * - `ThemeProvider`: Applies the Material-UI theme globally.
 *
 * **Custom Theme**:
 * - The `theme` object customizes Material-UI's default theme:
 *   - `primary`: Red (`@mui/material/colors/red`).
 *   - `secondary`: Grey (`@mui/material/colors/grey`).
 *
 * **How It Works**:
 * - When the app starts, React Router handles the navigation based on the URL.
 * - The theme ensures a consistent look and feel across the app.
 * - The `AuthProvider` manages authentication context, ensuring secure access to certain routes.
 *
 */
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CssBaseline, ThemeProvider } from '@mui/material';
import { red, grey } from '@mui/material/colors';
import { createTheme } from "@mui/material/styles";

import ProtectedRoute from './components/ProtectedRoute';
import NavBar from './components/NavBar';

import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import HomePage from './pages/HomePage';
import BookSearchPage from "./pages/books/BookSearchPage";
import BookDetailsPage from "./pages/books/BookDetailsPage";
import MovieDetailsPage from "./pages/movies/MovieDetailsPage";
import MovieSearchPage from "./pages/movies/MovieSeachPage";
import ContactPage from "./pages/Contact";
import AdaptationsPage from "./pages/Adaptations";
import Dashboard from "./pages/Dashboard";
import BingSearchPage from "./pages/BingSearch";

// Theme customization
export const theme = createTheme({
  palette: {
    primary: red,
    secondary: grey,
  },
});

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <NavBar />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/contact-us" element={<ContactPage />} />

          {/* Protected Routes */}
          <Route
            path="/search/books"
            element={
              <ProtectedRoute>
                <BookSearchPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/search/movies"
            element={
              <ProtectedRoute>
                <MovieSearchPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/book/details/:book_id"
            element={
              <ProtectedRoute>
                <BookDetailsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/movies/details/:tconst"
            element={
              <ProtectedRoute>
                <MovieDetailsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/adaptations/books/:tconst"
            element={
              <ProtectedRoute>
                <AdaptationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/adaptations/movies/:book_id"
            element={
              <ProtectedRoute>
                <AdaptationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bing"
            element={
              <ProtectedRoute>
                <BingSearchPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
