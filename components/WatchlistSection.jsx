'use client';

import { useState } from 'react';
import { Bookmark, Eye, EyeOff, Trash2, Filter } from 'lucide-react';
import MovieCard from './MovieCard';

export default function WatchlistSection({ 
  watchlist, 
  onMovieSelect, 
  onRemoveFromWatchlist, 
  onToggleWatched 
}) {
  const [filter, setFilter] = useState('all'); // all, watched, unwatched
  const [sortBy, setSortBy] = useState('added'); // added, title, rating

  const filteredWatchlist = watchlist.filter(movie => {
    switch (filter) {
      case 'watched':
        return movie.watched;
      case 'unwatched':
        return !movie.watched;
      default:
        return true;
    }
  });

  const sortedWatchlist = [...filteredWatchlist].sort((a, b) => {
    switch (sortBy) {
      case 'title':
        const titleA = a.title || a.name || '';
        const titleB = b.title || b.name || '';
        return titleA.localeCompare(titleB);
      case 'rating':
        return (b.vote_average || 0) - (a.vote_average || 0);
      default: // added
        return new Date(b.addedAt) - new Date(a.addedAt);
    }
  });

  const watchedCount = watchlist.filter(movie => movie.watched).length;
  const unwatchedCount = watchlist.length - watchedCount;

  const filters = [
    { value: 'all', label: `All (${watchlist.length})` },
    { value: 'unwatched', label: `To Watch (${unwatchedCount})` },
    { value: 'watched', label: `Watched (${watchedCount})` },
  ];

  const sortOptions = [
    { value: 'added', label: 'Date Added' },
    { value: 'title', label: 'Title' },
    { value: 'rating', label: 'Rating' },
  ];

  if (watchlist.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">📋</div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">Your Watchlist is Empty</h2>
        <p className="text-muted-foreground max-w-md mx-auto mb-6">
          Start building your watchlist by browsing movies and TV shows. Click the bookmark icon to add items to your list.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Bookmark className="h-4 w-4 mr-2" />
            Add to watchlist
          </div>
          <div className="flex items-center">
            <Eye className="h-4 w-4 mr-2" />
            Mark as watched
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary/20 rounded-lg border border-primary/30">
            <Bookmark className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">My Watchlist</h2>
            <p className="text-muted-foreground">
              {watchlist.length} {watchlist.length === 1 ? 'item' : 'items'} • {watchedCount} watched
            </p>
          </div>
        </div>
      </div>

      {/* Filters and Sorting */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 bg-card/50 backdrop-blur-sm rounded-xl p-4 border border-border/50">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <div className="flex items-center space-x-1">
            {filters.map((filterOption) => (
              <button
                key={filterOption.value}
                onClick={() => setFilter(filterOption.value)}
                className={`px-3 py-1.5 rounded-lg transition-all duration-200 font-medium text-sm ${
                  filter === filterOption.value
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                {filterOption.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1.5 bg-background border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Watchlist Grid */}
      {sortedWatchlist.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {sortedWatchlist.map((movie) => (
            <div key={`${movie.id}-${movie.media_type}`} className="relative">
              {/* Watched Status Indicator */}
              {movie.watched && (
                <div className="absolute -top-2 -right-2 z-10 bg-green-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center border-2 border-background">
                  ✓
                </div>
              )}
              <MovieCard
                movie={movie}
                onSelect={onMovieSelect}
                isInWatchlist={true}
                onRemoveFromWatchlist={onRemoveFromWatchlist}
                showWatchedStatus={true}
                onToggleWatched={onToggleWatched}
                isWatched={movie.watched}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-foreground mb-2">No items match your filter</h3>
          <p className="text-muted-foreground">
            Try adjusting your filter settings or add more items to your watchlist.
          </p>
        </div>
      )}
    </div>
  );
}