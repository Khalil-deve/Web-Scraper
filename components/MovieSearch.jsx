// components/MovieSearch.js
import { useState, useMemo } from 'react';
import { 
  FiSearch, 
  FiX, 
  FiAlertCircle, 
  FiCheck,
  FiCalendar,
  FiFilter,
  FiStar
} from 'react-icons/fi';
import { 
  HiOutlineSearch, 
  HiOutlineDatabase,
  HiOutlineFilter,
  HiOutlineBookmark
} from 'react-icons/hi';
import MovieCard from './MovieCard';

export default function MovieSearch({ userId }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [filterYear, setFilterYear] = useState("");
  const [filterName, setFilterName] = useState("");
  const [searchPerformed, setSearchPerformed] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    setResults([]);
    setSearchPerformed(true);

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();

      if (response.ok) {
        // Handle array of movies or single movie
        if (Array.isArray(data)) {
          setResults(data);
        } else {
          setResults([data]);
        }
      } else {
        setError(data.error || 'Failed to search movies');
      }
    } catch (err) {
      setError('An error occurred while searching');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Extract movies from results
  const movies = results.length > 0 
  ? Object.values(results[0]).filter(item => typeof item === "object") 
  : [];

  // Filter movies based on filter criteria
  const filteredMovies = useMemo(() => {
    return movies.filter(movie => { 
      const nameMatch = movie.title.toLowerCase().includes(filterName.toLowerCase());
      const yearMatch = filterYear ? movie.year === filterYear : true;
      return nameMatch && yearMatch;
    });
  })

  const clearFilters = () => {
    setFilterName("");
    setFilterYear("");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Search Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-white mb-4">Discover Movies & TV Shows</h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Search across multiple databases to find your next favorite movie or show. 
          Save them to your personal watchlist to track what you want to watch.
        </p>
      </div>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="mb-10">
        <div className="flex flex-col md:flex-row gap-4 items-stretch">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for movies, TV shows, actors..."
              className="w-full pl-10 pr-4 py-4 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                <span>Searching...</span>
              </>
            ) : (
              <>
                <HiOutlineSearch className="h-5 w-5" />
                <span>Search</span>
              </>
            )}
          </button>
        </div>
      </form>

      {error && (
        <div className="mb-8 p-4 bg-red-900/30 border border-red-700 rounded-xl text-red-200 flex items-center">
          <FiAlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Filters Section */}
      {movies.length > 0 && (
        <div className="mb-8 bg-gray-800/50 rounded-xl p-4 md:p-6 border border-gray-700">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center">
              <HiOutlineFilter className="w-5 h-5 mr-2 text-purple-400" />
              Filter Results
            </h3>
            {(filterName || filterYear) && (
              <button
                onClick={clearFilters}
                className="text-sm text-purple-400 hover:text-purple-300 flex items-center"
              >
                <FiX className="w-4 h-4 mr-1" />
                Clear Filters
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Title contains</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Filter by name"
                  value={filterName}
                  onChange={(e) => setFilterName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Release year</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiCalendar className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="number"
                  placeholder="Filter by year"
                  value={filterYear}
                  onChange={(e) => setFilterYear(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results Section */}
      {filteredMovies.length > 0 ? (
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">
              Search Results <span className="text-purple-400">({filteredMovies.length})</span>
            </h2>
            <span className="text-sm text-gray-400">
              Showing {filteredMovies.length} of {movies.length} results
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredMovies.map((movie, index) => (
              <MovieCard key={`${movie.title}-${index}`} movie={movie} userId={userId} />
            ))}
          </div>
        </div>
      ) : searchPerformed && !loading && movies.length === 0 ? (
        <div className="text-center py-16 bg-gray-800/30 rounded-xl border border-gray-700">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-700 rounded-full mb-6">
            <FiAlertCircle className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No results found</h3>
          <p className="text-gray-400 max-w-md mx-auto">
            We couldn't find any movies or shows matching your search. Try different keywords or check your spelling.
          </p>
        </div>
      ) : !searchPerformed && !loading ? (
        <div className="text-center py-20">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-full mb-6">
            <HiOutlineSearch className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">Start Exploring</h3>
          <p className="text-gray-400 max-w-2xl mx-auto mb-6">
            Search for movies, TV shows, or actors across multiple databases including IMDb, Rotten Tomatoes, and TMDB.
            Save your favorites to your personal watchlist.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="flex items-center text-sm text-gray-400">
              <HiOutlineDatabase className="w-4 h-4 mr-2 text-purple-400" />
              Search across multiple databases
            </div>
            <div className="flex items-center text-sm text-gray-400">
              <HiOutlineFilter className="w-4 h-4 mr-2 text-purple-400" />
              Filter and sort results
            </div>
            <div className="flex items-center text-sm text-gray-400">
              <HiOutlineBookmark className="w-4 h-4 mr-2 text-purple-400" />
              Save to your watchlist
            </div>
          </div>
        </div>
      ) : null}

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <HiOutlineSearch className="w-8 h-8 text-purple-500" />
            </div>
          </div>
          <p className="mt-4 text-gray-400">Searching across multiple databases...</p>
        </div>
      )}
    </div>
  );
}