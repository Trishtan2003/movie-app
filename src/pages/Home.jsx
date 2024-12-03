import React, { useState, useEffect } from "react";
import axios from "axios";
import MovieDetailPage from "./MovieDetailPage";
import dubflixLogo from "../assets/dubflix.png"; 

const Home = () => {
  const [movies, setMovies] = useState([]); 
  const [originalMovies, setOriginalMovies] = useState([]); 
  const [selectedMovie, setSelectedMovie] = useState(null); 
  const [searchQuery, setSearchQuery] = useState(""); 
  const [isLoading, setIsLoading] = useState(false); 
  const [error, setError] = useState(null); 

  const apiKey = "bb88e186"; 
  const apiUrl = "http://www.omdbapi.com/";

  
  useEffect(() => {
    const fetchRandomMovies = async () => {
      setIsLoading(true);
      setError(null);

      try {
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
        setMovies(fetchedMovies);
        setOriginalMovies(fetchedMovies); 
      } catch (error) {
        console.error("Error fetching random movies:", error);
        setError("Failed to fetch movies.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRandomMovies();
  }, []);

  
  const fetchMoviesByQuery = async (query) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.get(apiUrl, {
        params: { s: query, apikey: apiKey },
      });

      if (response.data.Response === "True") {
        const sortedMovies = response.data.Search.sort((a, b) => {
          
          return a.Year - b.Year;
        });
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

  
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() === "") {
      
      setMovies(originalMovies);
    } else {
      
      fetchMoviesByQuery(query);
    }
  };

  
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && searchQuery.trim() !== "") {
      fetchMoviesByQuery(searchQuery.trim());
    }
  };

  
  const handleCloseMovieDetails = () => {
    setSelectedMovie(null);
  };

  return (
    <div className="p-6 bg-gray-800 min-h-screen">
      {}
      <div className="flex items-center mb-4">
        <img src={dubflixLogo} alt="Dubflix Logo" className="h-12 mr-4" />
        <h1 className="text-white text-3xl font-bold">
          <span className="text-red-600">Dub</span>
          <span className="text-white">flix</span>
        </h1>
      </div>

      {}
      <div className="flex justify-center mb-4">
        <input
          type="text"
          placeholder="Search for a movie..."
          className="w-2/3 p-2 rounded-md text-black"
          value={searchQuery}
          onChange={handleSearch}
          onKeyDown={handleKeyDown}
        />
      </div>

      {}
      {isLoading && <p className="text-white text-center">Loading movies...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {movies.length > 0 ? (
          movies.map((movie) => (
            <div
              key={movie.imdbID}
              className="cursor-pointer"
              onClick={() => handleMovieClick(movie)}
            >
              <img
                src={movie.Poster}
                alt={movie.Title}
                className="w-full h-72 object-cover rounded-md"
              />
              <h3 className="mt-2 text-white text-center">{movie.Title}</h3>
            </div>
          ))
        ) : (
          !isLoading && searchQuery.trim() === "" && (
            <p className="text-white text-center">Showing random movies</p>
          )
        )}
      </div>

      {}
      {selectedMovie && (
        <MovieDetailPage movie={selectedMovie} onClose={handleCloseMovieDetails} />
      )}
    </div>
  );
};

export default Home;
