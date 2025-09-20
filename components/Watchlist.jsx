// components/Watchlist.js
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import WatchlistCard from './WatchlistCard';

export default function Watchlist({ userId }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWatchlist();
  }, [userId]);

  const fetchWatchlist = async () => {
    try {
      const { data, error } = await supabase
        .from('watchlist')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching watchlist:', error);
      } else {
        setMovies(data || []);
      }
    } catch (err) {
      console.error('Error fetching watchlist:', err);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWatchlist = async (id) => {
    try {
      const { error } = await supabase
        .from('watchlist')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error removing from watchlist:', error);
      } else {
        setMovies(movies.filter(movie => movie.id !== id));
      }
    } catch (err) {
      console.error('Error removing from watchlist:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">My Watchlist</h2>
      
      {movies.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <div className="text-6xl mb-4">📺</div>
          <p>Your watchlist is empty. Search for movies and TV shows to add them!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {movies.map((movie) => (
            <WatchlistCard 
              key={movie.id} 
              movie={movie} 
              onRemove={() => removeFromWatchlist(movie.id)} 
            />
          ))}
        </div>
      )}
    </div>
  );
}