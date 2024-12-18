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
  const [selectedMovie, setSelectedMovie] = useState(null); // Declare selectedMovie and its state setter

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

  const handleMovieClick = async (movie) => {
    try {
      if (isOffline) {
        const cache = await caches.open('movie-details-cache');
        const cachedResponse = await cache.match(`movie-${movie.imdbID}`);
        
        if (cachedResponse) {
          const cachedMovieDetails = await cachedResponse.json();
          setSelectedMovie(cachedMovieDetails); // Corrected the issue here
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

  return (
    <div className="p-6 bg-gray-800 min-h-screen">
      {isOffline && (
        <div className="bg-yellow-500 text-black text-center p-2 mb-4 rounded">
          You are currently offline. Some features may be limited.
        </div>
      )}

      {/* Rest of the existing return remains the same */}
    </div>
  );
};

export default Home;
