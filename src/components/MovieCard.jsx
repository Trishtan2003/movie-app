// src/components/MovieCard.jsx

import React from "react";
import { Link } from "react-router-dom";  // Link to navigate to movie details

const MovieCard = ({ movie }) => {
  return (
    <Link to={`/movie/${movie.imdbID}`}>
      <div className="w-48 cursor-pointer">
        <img
          src={movie.Poster}
          alt={movie.Title}
          className="w-full h-64 object-cover rounded-lg"
        />
        <h3 className="text-sm mt-2">{movie.Title}</h3>
      </div>
    </Link>
  );
};

export default MovieCard;
