// components/WatchlistCard.js
import { useState } from 'react';

export default function WatchlistCard({ movie, onRemove }) {
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemove = async () => {
    setIsRemoving(true);
    await onRemove();
    setIsRemoving(false);
  };

  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg transition-transform hover:scale-105">
      <div className="relative">
        {movie.poster_url ? (
          <img 
            src={movie.poster_url} 
            alt={movie.title}
            className="w-full h-64 object-cover"
          />
        ) : (
          <div className="w-full h-64 bg-gray-700 flex items-center justify-center">
            <span className="text-4xl">🎬</span>
          </div>
        )}
        
        <div className="absolute top-0 right-0 m-2">
          {movie.imdb_rating && (
            <span className="bg-yellow-600 text-white text-xs font-bold px-2 py-1 rounded">
              IMDb: {movie.imdb_rating}
            </span>
          )}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-xl font-bold text-white mb-1">{movie.title}</h3>
        
        <div className="flex justify-between items-center text-sm text-gray-400 mb-3">
          <span>{movie.year}</span>
          {movie.rotten_tomatoes_rating && (
            <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
              RT: {movie.rotten_tomatoes_rating}
            </span>
          )}
        </div>
        
        {movie.genres && (
          <div className="flex flex-wrap gap-1 mb-3">
            {movie.genres.split(',').map((genre, index) => (
              <span key={index} className="bg-purple-900 text-purple-200 text-xs px-2 py-1 rounded">
                {genre.trim()}
              </span>
            ))}
          </div>
        )}
        
        <div className="flex justify-between items-center mt-4">
          <a 
            href={movie.imdb_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-purple-400 hover:text-purple-300 text-sm font-medium"
          >
            View on IMDb
          </a>
          
          <button
            onClick={handleRemove}
            disabled={isRemoving}
            className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors disabled:opacity-50"
          >
            {isRemoving ? 'Removing...' : 'Remove'}
          </button>
        </div>
      </div>
    </div>
  );
}