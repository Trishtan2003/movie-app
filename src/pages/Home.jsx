import React, { useState, useEffect } from "react";
import axios from "axios";
import MovieDetailPage from "./MovieDetailPage";
import dubflixLogo from "../assets/dubflix.png"; 

const Home = () => {
  const [movies, setMovies] = useState([]); 
  const [searchQuery, setSearchQuery] = useState(""); 
  const [isLoading, setIsLoading] = useState(false); 
  const [error, setError] = useState(null); 
  const [isOffline, setIsOffline] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null); 
  const apiKey = "bb88e186"; 
  const apiUrl = "https://www.omdbapi.com/";

  // Offline detection and caching
  useEffect(() => {
    const checkNetworkStatus = () => {
      setIsOffline(!navigator.onLine);
    };
    window.addEventListener('online', checkNetworkStatus);
    window.addEventListener('offline', checkNetworkStatus);
    checkNetworkStatus();
    return () => {
      window.removeEventListener('online', checkNetworkStatus);
      window.removeEventListener('offline', checkNetworkStatus);
    };
  }, []);

  // Fetch random movies for initial display
  useEffect(() => {
    const fetchRandomMovies = async () => {
      setIsLoading(true);
      setError(null);

      try {
        if (isOffline) {
          const cache = await caches.open('movies-cache');
          const cachedResponse = await cache.match('random-movies');
          
          if (cachedResponse) {
            const cachedMovies = await cachedResponse.json();
            setMovies(cachedMovies);
            setIsLoading(false);
            return;
          }
        }
        const moviePromises = [];
        for (let i = 1; i <= 3; i++) {
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
          .filter(Boolean); 

        if (!isOffline) {
          const cache = await caches.open('movies-cache');
          await cache.put('random-movies', new Response(JSON.stringify(fetchedMovies)));
        }

        setMovies(fetchedMovies);
      } catch (error) {
        console.error("Error fetching random movies:", error);
        setError("Failed to fetch movies.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRandomMovies();
  }, [isOffline]);

  // Fetch movies based on search query
  const fetchMoviesByQuery = async (query) => {
    setIsLoading(true);
    setError(null);

    try {
      if (isOffline) {
        const cache = await caches.open('movies-cache');
        const cachedResponse = await cache.match(`search-${query}`);
        
        if (cachedResponse) {
          const cachedMovies = await cachedResponse.json();
          setMovies(cachedMovies);
          setIsLoading(false);
          return;
        }
      }
      const response = await axios.get(apiUrl, {
        params: { s: query, apikey: apiKey },
      });

      if (response.data.Response === "True") {
        const sortedMovies = response.data.Search.sort((a, b) => {
          return a.Year - b.Year;
        });
        
        if (!isOffline) {
          const cache = await caches.open('movies-cache');
          await cache.put(`search-${query}`, new Response(JSON.stringify(sortedMovies)));
        }
        setMovies(sortedMovies);
      } else {
        setMovies([]); 
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
      if (isOffline) {
        const cache = await caches.open('movie-details-cache');
        const cachedResponse = await cache.match(`movie-${movie.imdbID}`);
        
        if (cachedResponse) {
          const cachedMovieDetails = await cachedResponse.json();
          setSelectedMovie(cachedMovieDetails); 
          return;
        }
      }
      const response = await axios.get(apiUrl, {
        params: { i: movie.imdbID, apikey: apiKey },
      });

      if (response.data) {
        if (!isOffline) {
          const cache = await caches.open('movie-details-cache');
          await cache.put(`movie-${movie.imdbID}`, new Response(JSON.stringify(response.data)));
        }
        
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
      setMovies(movies); 
    } else {
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
      {isOffline && (
        <div className="bg-yellow-500 text-black text-center p-2 mb-4 rounded">
          You are currently offline. Some features may be limited.
        </div>
      )}
      {/* Logo */}
      <div className="flex items-center mb-4">
        <img src={dubflixLogo} alt="Dubflix Logo" className="h-12 mr-4" />
        <h1 className="text-white text-3xl font-bold">
          <span className="text-red-500">Dub</span><span className="text-white">flix</span>
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
              className="bg-gray-700 p-4 rounded-lg hover:bg-gray-600 cursor-pointer"
              onClick={() => handleMovieClick(movie)}
            >
              <img
                src={movie.Poster}
                alt={movie.Title}
                className="w-full h-48 object-cover rounded-md mb-2"
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
