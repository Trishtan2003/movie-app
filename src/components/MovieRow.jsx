
import React from "react";

const MovieRow = ({ movies, onClickMovie }) => {

  const renderStars = (rating) => {
    const stars = Math.round(rating / 2); 
    let starElements = [];
    for (let i = 0; i < 5; i++) {
      starElements.push(
        <span key={i} className={`text-yellow-500 ${i < stars ? "fas fa-star" : "far fa-star"}`}></span>
      );
    }
    return <div className="flex">{starElements}</div>;
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {movies.map((movie) => (
        <div
          key={movie.imdbID}
          className="bg-gray-800 rounded-lg overflow-hidden cursor-pointer"
          onClick={() => onClickMovie(movie)} 
        >
          <img src={movie.Poster} alt={movie.Title} className="w-full h-64 object-cover" />
          <div className="p-2">
            <h3 className="text-lg font-semibold">{movie.Title}</h3>
            <p className="text-sm">{movie.Year}</p>
            {movie.imdbRating && renderStars(movie.imdbRating)} {}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MovieRow;
