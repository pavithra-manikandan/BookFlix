/**
 * BingSearch Component
 *
 * This component provides a simple search interface for the Bing Search API.
 * It allows users to enter a query, fetch results dynamically, and display them
 * in a clean, responsive UI.
 *
 * **Purpose**:
 * - To demonstrate the integration of the Bing Search API.
 * - Provide users with a search bar to fetch web search results and display them in a styled format.
 *
 * **Features**:
 * 1. **Search Functionality**:
 *    - Users can input a query and trigger a search by clicking the "Search" button.
 *    - Results are fetched from the Bing Search API and displayed dynamically.
 *
 * 2. **Loading State**:
 *    - A spinner is displayed while the search is in progress, along with a "Searching..." message.
 *
 * 3. **Error Handling**:
 *    - Displays an error message if the search fails or the API call encounters an issue.
 *
 * 4. **Styled Results**:
 *    - Each search result includes a title (link to the webpage) and a snippet.
 *    - Results are styled with a white card-like background and hover effects.
 *
 * **How It Works**:
 * - **State Management**:
 *   - `searchQuery`: Tracks the user’s input.
 *   - `results`: Stores the list of search results fetched from the API.
 *   - `loading`: Indicates whether the search is in progress.
 *   - `error`: Stores any error message from the API call.
 *
 * - **API Integration**:
 *   - Fetches data from the Bing Search API (`https://api.bing.microsoft.com/v7.0/search`).
 *   - The `subscriptionKey` variable is used for authentication.
 *
 * **Styling**:
 * - Uses inline styles for all UI elements, ensuring a modern and clean design.
 * - Components like the search bar, results, and loader are styled consistently.
 * - Spinner animation is implemented using `@keyframes`.
 *
 * **Components**:
 * - **Search Bar**:
 *   - Input field for entering queries.
 *   - Button to trigger the search.
 *
 * - **Results Section**:
 *   - Displays search results in a list format.
 *   - Each result card shows the title (as a clickable link) and a short snippet.
 *
 * - **Loader**:
 *   - A circular spinner displayed during the API call.
 *
 * **How to Use**:
 * 1. Replace the `subscriptionKey` variable with your own Bing Search API key.
 * 2. Import and use this component in your application.
 */

import React, { useState } from 'react';

const BingSearch = () => {
  // State variables
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Bing Search API Key
  const subscriptionKey = 'da76a9c5c8ee4ade9f619372d8660c1d';
  const endpoint = 'https://api.bing.microsoft.com/v7.0/search';

  // Function to handle search request
  const searchBing = async () => {
    if (!searchQuery) {
      alert('Please enter a search query!');
      return;
    }

    setLoading(true);
    setError('');
    setResults([]);

    try {
      const response = await fetch(`${endpoint}?q=${encodeURIComponent(searchQuery)}`, {
        method: 'GET',
        headers: {
          'Ocp-Apim-Subscription-Key': subscriptionKey,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch results');
      }

      const data = await response.json();
      setResults(data.webPages?.value || []);
    } catch (err) {
      setError('An error occurred while fetching results.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="bing-search-container" style={styles.container}>
        <h1 style={styles.header}>Bing Web Search</h1>
        <div style={styles.searchBar}>
          <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter search query"
              style={styles.input}
          />
          <button onClick={searchBing} style={styles.button}>
            Search
          </button>
        </div>

        {loading && (
            <div style={styles.loader}>
              <div className="spinner" style={styles.spinner}></div>
              <p style={styles.loaderText}>Searching...</p>
            </div>
        )}

        {error && <p style={styles.error}>{error}</p>}

        <div style={styles.resultsContainer}>
          {results.map((result, index) => (
              <div key={index} style={styles.resultItem}>
                <a
                    href={result.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={styles.resultTitle}
                >
                  {result.name}
                </a>
                <p style={styles.resultSnippet}>{result.snippet}</p>
              </div>
          ))}
        </div>
      </div>
  );
};

const styles = {
  container: {
    fontFamily: "'Roboto', sans-serif",
    padding: '20px',
    backgroundColor: '#f7f9fc',
    maxWidth: '800px',
    margin: '40px auto',
    borderRadius: '10px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
  },
  header: {
    fontSize: '28px',
    textAlign: 'center',
    marginBottom: '20px',
    color: '#333',
  },
  searchBar: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
  },
  input: {
    flex: '1',
    padding: '12px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    transition: 'all 0.3s ease',
    boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.1)',
    outline: 'none',
  },
  button: {
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: 'bold',
    borderRadius: '5px',
    backgroundColor: '#f44336',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  loader: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '20px',
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '6px solid #f3f3f3',
    borderTop: '6px solid #f44336',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  loaderText: {
    marginTop: '10px',
    fontSize: '16px',
    color: '#555',
  },
  resultsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  resultItem: {
    padding: '15px',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
    border: '1px solid #f0f0f0',
  },
  resultTitle: {
    fontSize: '18px',
    color: '#f44336',
    textDecoration: 'none',
    fontWeight: 'bold',
    transition: 'color 0.3s ease',
  },
  resultSnippet: {
    fontSize: '14px',
    color: '#555',
    marginTop: '5px',
  },
  error: {
    color: '#f44336',
    textAlign: 'center',
    marginTop: '20px',
    fontWeight: 'bold',
  },
};

// Adding animation for spinner in global CSS
const spinnerStyle = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}`;

const styleSheet = document.createElement('style');
styleSheet.type = 'text/css';
styleSheet.innerText = spinnerStyle;
document.head.appendChild(styleSheet);

export default BingSearch;