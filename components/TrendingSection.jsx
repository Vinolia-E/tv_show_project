'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Calendar, Flame } from 'lucide-react';
import MovieCard from './MovieCard';
import LoadingSpinner from './LoadingSpinner';
import { getTrendingContent, mockTrendingMovies } from '@/lib/api';
import { useWatchlist } from '@/hooks/useWatchlist';

export default function TrendingSection({ onMovieSelect }) {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeWindow, setTimeWindow] = useState('week');
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();

  useEffect(() => {
    fetchTrendingMovies();
  }, [timeWindow]);

  const fetchTrendingMovies = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getTrendingContent(timeWindow);
      
      // Use mock data if API fails or returns empty results
      if (!data.results || data.results.length === 0) {
        setTrendingMovies(mockTrendingMovies);
      } else {
        setTrendingMovies(data.results);
      }
    } catch (err) {
      console.error('Error fetching trending movies:', err);
      setError('Failed to load trending content. Showing popular movies instead.');
      setTrendingMovies(mockTrendingMovies);
    } finally {
      setLoading(false);
    }
  };

  const timeWindows = [
    { value: 'day', label: 'Today', icon: Calendar },
    { value: 'week', label: 'This Week', icon: TrendingUp },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary/20 rounded-lg border border-primary/30">
            <Flame className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Trending Now</h2>
            <p className="text-muted-foreground">Popular movies and TV shows</p>
          </div>
        </div>

        {/* Time Window Selector */}
        <div className="flex items-center space-x-1 bg-card/50 backdrop-blur-sm rounded-lg p-1 border border-border/50">
          {timeWindows.map((window) => {
            const Icon = window.icon;
            return (
              <button
                key={window.value}
                onClick={() => setTimeWindow(window.value)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md transition-all duration-200 font-medium ${
                  timeWindow === window.value
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden sm:inline">{window.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-xl p-4 text-center">
          <p className="text-yellow-300">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading && <LoadingSpinner />}

      {/* Trending Movies Grid */}
      {!loading && trendingMovies.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {trendingMovies.map((movie, index) => (
            <div key={`${movie.id}-${movie.media_type}`} className="relative">
              {/* Trending Badge */}
              {index < 3 && (
                <div className="absolute -top-2 -left-2 z-10 bg-primary text-primary-foreground text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center border-2 border-background">
                  {index + 1}
                </div>
              )}
              <MovieCard
                movie={movie}
                onSelect={onMovieSelect}
                isInWatchlist={isInWatchlist(movie.id, movie.media_type)}
                onAddToWatchlist={addToWatchlist}
                onRemoveFromWatchlist={removeFromWatchlist}
              />
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && trendingMovies.length === 0 && (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📺</div>
          <h3 className="text-xl font-semibold text-foreground mb-2">No trending content available</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Unable to load trending movies and TV shows at the moment.
          </p>
          <button 
            onClick={fetchTrendingMovies}
            className="btn-primary mt-4"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}