

import axios from "axios";

const apiKey = process.env.REACT_APP_OMDB_API_KEY;

const apiUrl = "https://www.omdbapi.com/";




export const fetchMovies = async () => {
  try {
    const randomTitles = [
      "Inception", "Avengers", "Titanic", "The Matrix", "The Lion King", 
      "Spider-Man", "Batman Begins", "Interstellar", "Avatar", "Shrek"
    ];


    const randomMovie = randomTitles[Math.floor(Math.random() * randomTitles.length)];

    const response = await axios.get(apiUrl, {
      params: { s: randomMovie, apikey: apiKey },
    });

    return response.data.Search || [];
  } catch (error) {
    console.error("Error fetching movies:", error);
    return [];
  }
};
