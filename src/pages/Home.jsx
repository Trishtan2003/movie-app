import React, { useState, useEffect } from "react";
import axios from "axios";
import MovieDetailPage from "./MovieDetailPage";
import dubflixLogo from "../assets/dubflix.png"; // Import your logo image

const Home = () => {
  const [movies, setMovies] = useState([]); // Movies displayed
  const [originalMovies, setOriginalMovies] = useState([]); // Original random movies list
  const [selectedMovie, setSelectedMovie] = useState(null); // Selected movie for full details
  const [searchQuery, setSearchQuery] = useState(""); // Current search input
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state
  const apiKey = "bb88e186"; // Replace with your OMDb API key
  const apiUrl = "https://www.omdbapi.com/";

  // Fetch random movies for initial display
  useEffect(() => {
    const fetchRandomMovies = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const moviePromises = [];
        for (let i = 1; i <= 3; i++) { // Fetch random pages of movies
          moviePromises.push(
            axios.get(apiUrl, {
              params: { s: "movie", apikey: apiKey, page: i },
            })
          );
        }

        const movieResponses = await Promise.all(moviePromises);
        const fetchedMovies = movieResponses
          .map((response) => response.data.Search)
          .flat()
          .filter(Boolean); // Remove null values

        setMovies(fetchedMovies);
        setOriginalMovies(fetchedMovies); // Save the original movies list
      } catch (error) {
        console.error("Error fetching random movies:", error);
        setError("Failed to fetch movies.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRandomMovies();
  }, []);

  // Fetch movies based on search query
  const fetchMoviesByQuery = async (query) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(apiUrl, {
        params: { s: query, apikey: apiKey },
      });

      if (response.data.Response === "True") {
        const sortedMovies = response.data.Search.sort((a, b) => {
          // Sorting movies from old to new based on year
          return a.Year - b.Year;
        });
        setMovies(sortedMovies);
      } else {
        setMovies([]); // Clear the movie list if no results
      }
    } catch (error) {
      console.error("Error fetching searched movies:", error);
      setError("Failed to fetch movies.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch full details of the selected movie
  const handleMovieClick = async (movie) => {
    try {
      const response = await axios.get(apiUrl, {
        params: { i: movie.imdbID, apikey: apiKey },
      });

      if (response.data) {
        setSelectedMovie(response.data);
      } else {
        console.error("No details found for this movie.");
      }
    } catch (error) {
      console.error("Error fetching movie details:", error);
    }
  };

  // Handle search input change
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() === "") {
      // If search input is cleared, reset to the original movies list
      setMovies(originalMovies);
    } else {
      // Fetch movies based on the query
      fetchMoviesByQuery(query);
    }
  };

  // Trigger search on pressing Enter
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && searchQuery.trim() !== "") {
      fetchMoviesByQuery(searchQuery.trim());
    }
  };

  // Close the movie details modal
  const handleCloseMovieDetails = () => {
    setSelectedMovie(null);
  };

  return (
    <div className="p-6 bg-gray-800 min-h-screen">
      {/* Logo */}
      <div className="flex items-center mb-4">
        <img src={dubflixLogo} alt="Dubflix Logo" className="h-12 mr-4" />
        <h1 className="text-3xl font-bold">
          <span className="text-red-500">Dub</span>
          <span className="text-white">flix</span>
        </h1>
      </div>

      {/* Search Bar */}
      <div className="flex justify-center mb-4">
        <input
          type="text"
          placeholder="Search for movies..."
          value={searchQuery}
          onChange={handleSearch}
          onKeyDown={handleKeyDown}
          className="p-2 rounded-md bg-gray-700 text-white"
        />
      </div>

      {/* Loading or Error States */}
      {isLoading && <p className="text-white text-center">Loading movies...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {/* Movie Display Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {movies.length > 0 ? (
          movies.map((movie) => (
            <div
              key={movie.imdbID}
              className="bg-gray-700 p-4 rounded-lg hover:bg-gray-600 cursor-pointer relative"
              onClick={() => handleMovieClick(movie)}
            >
              <img
                src={movie.Poster}
                alt={movie.Title}
                className="w-full h-auto rounded-md mb-2 aspect-h-1 aspect-w-1 object-cover"
              />
              <h3 className="text-white">{movie.Title}</h3>
              <p className="text-gray-400">{movie.Year}</p>
            </div>
          ))
        ) : (
          <p className="text-white text-center">No movies found.</p>
        )}
      </div>

      {/* Movie Details Modal */}
      {selectedMovie && (
        <MovieDetailPage movie={selectedMovie} onClose={handleCloseMovieDetails} />
      )}
    </div>
  );
};

export default Home;
