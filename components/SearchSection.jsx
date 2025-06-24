'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';
import MovieCard from './MovieCard';
import LoadingSpinner from './LoadingSpinner';
import { searchMovies } from '@/lib/api';
import { useDebounce } from '@/hooks/useDebounce';
import { useWatchlist } from '@/hooks/useWatchlist';

export default function SearchSection({ query, onMovieSelect }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [filters, setFilters] = useState({
    mediaType: 'all', // all, movie, tv
    sortBy: 'popularity', // popularity, rating, date
  });
  const [showFilters, setShowFilters] = useState(false);

  const debouncedQuery = useDebounce(query, 500);
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();

  useEffect(() => {
    if (debouncedQuery.trim()) {
      handleSearch(1);
    } else {
      setMovies([]);
      setTotalPages(0);
    }
  }, [debouncedQuery, filters]);

  const handleSearch = async (page = 1) => {
    if (!debouncedQuery.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const data = await searchMovies(debouncedQuery, page);
      
      let filteredResults = data.results || [];
      
      // Apply media type filter
      if (filters.mediaType !== 'all') {
        filteredResults = filteredResults.filter(item => item.media_type === filters.mediaType);
      }

      // Apply sorting
      switch (filters.sortBy) {
        case 'rating':
          filteredResults.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
          break;
        case 'date':
          filteredResults.sort((a, b) => {
            const dateA = new Date(a.release_date || a.first_air_date || 0);
            const dateB = new Date(b.release_date || b.first_air_date || 0);
            return dateB - dateA;
          });
          break;
        default: // popularity
          filteredResults.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
      }

      if (page === 1) {
        setMovies(filteredResults);
      } else {
        setMovies(prev => [...prev, ...filteredResults]);
      }

      setTotalPages(data.total_pages || 0);
      setCurrentPage(page);
    } catch (err) {
      setError('Failed to search movies. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (currentPage < totalPages && !loading) {
      handleSearch(currentPage + 1);
    }
  };

  const clearSearch = () => {
    setMovies([]);
    setTotalPages(0);
    setCurrentPage(1);
  };

  if (!query && movies.length === 0) {
    return (
      <div className="text-center py-16">
        <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
        <h2 className="text-2xl font-semibold text-foreground mb-2">Search Movies & TV Shows</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Discover your next favorite movie or TV show. Use the search bar above to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Search Results</h2>
          {query && (
            <p className="text-muted-foreground mt-1">
              {movies.length > 0 ? `Found ${movies.length} results for "${query}"` : `No results for "${query}"`}
            </p>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-secondary"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </button>
          {query && (
            <button onClick={clearSearch} className="btn-secondary">
              <X className="h-4 w-4 mr-2" />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-card/50 backdrop-blur-sm rounded-xl p-4 border border-border/50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Media Type</label>
              <select
                value={filters.mediaType}
                onChange={(e) => setFilters(prev => ({ ...prev, mediaType: e.target.value }))}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="all">All</option>
                <option value="movie">Movies</option>
                <option value="tv">TV Shows</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Sort By</label>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
                className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="popularity">Popularity</option>
                <option value="rating">Rating</option>
                <option value="date">Release Date</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-destructive/20 border border-destructive/30 rounded-xl p-4 text-center">
          <p className="text-destructive-foreground">{error}</p>
          <button 
            onClick={() => handleSearch(1)}
            className="btn-primary mt-2"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && movies.length === 0 && <LoadingSpinner />}

      {/* Results Grid */}
      {movies.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {movies.map((movie) => (
            <MovieCard
              key={`${movie.id}-${movie.media_type}`}
              movie={movie}
              onSelect={onMovieSelect}
              isInWatchlist={isInWatchlist(movie.id, movie.media_type)}
              onAddToWatchlist={addToWatchlist}
              onRemoveFromWatchlist={removeFromWatchlist}
            />
          ))}
        </div>
      )}

      {/* Load More */}
      {currentPage < totalPages && (
        <div className="text-center">
          <button
            onClick={loadMore}
            disabled={loading}
            className="btn-primary"
          >
            {loading ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}

      {/* No Results */}
      {query && movies.length === 0 && !loading && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-foreground mb-2">No results found</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Try searching with different keywords or check your spelling.
          </p>
        </div>
      )}
    </div>
  );
}