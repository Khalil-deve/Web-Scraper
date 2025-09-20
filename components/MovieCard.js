// components/MovieCard.js
import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function MovieCard({ movie, userId }) {
  const [isAdded, setIsAdded] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const addToWatchlist = async () => {
    setIsAdding(true);

    try {
      const { data, error } = await supabase
        .from("watchlist")
        .insert([
          {
            user_id: userId,
            title: movie.title,
            genres: movie.genres || "Unknown Genre",
            year: movie.year,
            poster_url: movie.posterUrl,
            imdb_url: movie.imdbUrl,
            description: movie.description,
            ratings: {
              imdb: movie.imdbRating || null,
              rotten_tomatoes: movie.rottenTomatoesRating || null,
              meta_score: movie.metaScore || null,
            },
            source: movie.source,
          },
        ])
        .select();

      if (error) {
        console.error("Error adding to watchlist:", error);
      } else {
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
      }
    } catch (err) {
      console.error("Error adding to watchlist:", err);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg transition-transform hover:scale-105">
      <div className="relative">
        {movie.posterUrl ? (
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="w-full h-64 object-cover"
          />
        ) : (
          <div className="w-full h-64 bg-gray-700 flex items-center justify-center">
            <span className="text-4xl">🎬</span>
          </div>
        )}

        <div className="absolute top-0 right-0 m-2 flex flex-col gap-1">
          {movie.source && (
            <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">
              {movie.source}
            </span>
          )}
        </div>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">
          {movie.title || "Unknown Title"}
        </h3>

        <div className="flex justify-between items-center text-sm text-gray-400 mb-3">
          <span>{movie.year || "Unknown Year"}</span>
          {movie.rating && movie.rating !== "N/A" && (
            <span className="bg-yellow-500 text-gray-900 px-2 py-1 rounded font-semibold">
              {movie.rating} / 10
            </span>
          )}
        </div>

        {movie.genres && movie.genres !== "Unknown Genre" && (
          <div className="flex flex-wrap gap-1 mb-3">
            {movie.genres.split(",").map((genre, index) => (
              <span
                key={index}
                className="bg-purple-900 text-purple-200 text-xs px-2 py-1 rounded"
              >
                {genre.trim()}
              </span>
            ))}
          </div>
        )}

        {movie.description &&
          movie.description !== "No description available" && (
            <p className="text-gray-300 text-sm mb-4 line-clamp-3">
              {movie.description}
            </p>
          )}

        <button
          onClick={addToWatchlist}
          disabled={isAdded || isAdding}
          className={`w-full py-2 rounded-lg font-medium transition-colors ${
            isAdded
              ? "bg-green-600 text-white"
              : "bg-purple-600 hover:bg-purple-700 text-white"
          }`}
        >
          {isAdded
            ? "Added to Watchlist!"
            : isAdding
            ? "Adding..."
            : "Add to Watchlist"}
        </button>
      </div>
    </div>
  );
}
