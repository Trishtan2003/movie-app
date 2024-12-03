import React from "react";

const MovieDetailPage = ({ movie, onClose }) => {
  
  const renderStars = (rating) => {
    const stars = Math.round(rating / 2); 
    let starElements = [];
    for (let i = 0; i < 5; i++) {
      starElements.push(
        <span
          key={i}
          className={`text-yellow-500 ${i < stars ? "fas fa-star" : "far fa-star"}`}
        ></span>
      );
    }
    return <div className="flex">{starElements}</div>;
  };

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-4/5 md:w-2/3 lg:w-1/2 text-white">
        <button onClick={onClose} className="text-white text-xl font-bold mb-4">
          X Close
        </button>
        <div className="flex flex-col md:flex-row">
          <img
            src={movie.Poster}
            alt={movie.Title}
            className="w-48 h-72 object-cover rounded-md mb-4 md:mb-0 md:mr-6"
          />
          <div className="flex-1">
            <h2 className="text-3xl font-semibold mb-2">{movie.Title}</h2>
            <p className="text-xl text-gray-400">{movie.Genre}</p>
            <p className="text-sm mt-4">{movie.Plot}</p>
            <div className="flex items-center mt-4">
              {movie.imdbRating && renderStars(Number(movie.imdbRating))} {}
              <span className="ml-2">{movie.imdbRating}</span>
            </div>
            <p className="mt-4">
              <strong>Release Date:</strong> {movie.Released}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailPage;
