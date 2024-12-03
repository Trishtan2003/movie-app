// src/pages/Search.jsx
import React, { useState } from "react";
import { fetchMovies } from "../utils/api";
import MovieRow from "../components/MovieRow";

const Search = () => {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);

  const handleSearch = async () => {
    const data = await fetchMovies(query);
    setMovies(data);
  };

  return (
    <div className="p-4">
      <input
        type="text"
        placeholder="Search for a movie..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="p-2 rounded"
      />
      <button
        onClick={handleSearch}
        className="bg-blue-500 text-white p-2 rounded ml-2"
      >
        Search
      </button>

      <div className="mt-4">
        <MovieRow movies={movies} />
      </div>
    </div>
  );
};

export default Search;
