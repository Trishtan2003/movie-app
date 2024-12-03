// src/utils/api.js

import axios from "axios";

const apiKey = "bb88e186"; // Replace with your OMDb API key
const apiUrl = "http://www.omdbapi.com/";

// Function to fetch movies based on random titles
export const fetchMovies = async () => {
  try {
    const randomTitles = [
      "Inception", "Avengers", "Titanic", "The Matrix", "The Lion King", 
      "Spider-Man", "Batman Begins", "Interstellar", "Avatar", "Shrek"
    ];

    // Get random movie title
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
