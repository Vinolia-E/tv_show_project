'use client';

import { useState, useEffect } from 'react';
import { X, Star, Calendar, Clock, Play, Bookmark, BookmarkCheck, ExternalLink, Users } from 'lucide-react';
import { getMovieDetails, getOMDBDetails } from '@/lib/api';
import { formatDate, formatRuntime, getRatingColor, getImageUrl, getBackdropUrl } from '@/lib/utils';
import { cn } from '@/lib/utils';
import LoadingSpinner from './LoadingSpinner';

export default function MovieModal({ 
  movie, 
  isOpen, 
  onClose, 
  watchlist, 
  onAddToWatchlist, 
  onRemoveFromWatchlist 
}) {
  const [movieDetails, setMovieDetails] = useState(null);
  const [omdbDetails, setOmdbDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const isInWatchlist = watchlist.some(
    item => item.id === movie.id && item.media_type === movie.media_type
  );

  useEffect(() => {
    if (isOpen && movie) {
      fetchMovieDetails();
    }
  }, [movie, isOpen]);

  const fetchMovieDetails = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch TMDB details
      const tmdbData = await getMovieDetails(movie.id, movie.media_type);
      setMovieDetails(tmdbData);

      // Fetch OMDB details for additional ratings
      if (tmdbData) {
        const title = tmdbData.title || tmdbData.name;
        const year = tmdbData.release_date || tmdbData.first_air_date;
        if (title && year) {
          const omdbData = await getOMDBDetails(title, new Date(year).getFullYear());
          setOmdbDetails(omdbData);
        }
      }
    } catch (err) {
      console.error('Error fetching movie details:', err);
      setError('Failed to load movie details');
    } finally {
      setLoading(false);
    }
  };

  const handleWatchlistClick = () => {
    if (isInWatchlist) {
      onRemoveFromWatchlist(movie.id, movie.media_type);
    } else {
      onAddToWatchlist(movie);
    }
  };

  const getTrailerUrl = () => {
    if (movieDetails?.videos?.results) {
      const trailer = movieDetails.videos.results.find(
        video => video.type === 'Trailer' && video.site === 'YouTube'
      );
      return trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null;
    }
    return null;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-card rounded-xl border border-border/50 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
        >
          <X className="h-5 w-5 text-white" />
        </button>

        {/* Content */}
        <div className="overflow-y-auto max-h-[90vh] scrollbar-hide">
          {loading && (
            <div className="p-8">
              <LoadingSpinner />
            </div>
          )}

          {error && (
            <div className="p-8 text-center">
              <p className="text-destructive-foreground">{error}</p>
              <button onClick={fetchMovieDetails} className="btn-primary mt-4">
                Try Again
              </button>
            </div>
          )}

          {movieDetails && (
            <>
              {/* Hero Section */}
              <div className="relative h-64 md:h-80">
                <img
                  src={getBackdropUrl(movieDetails.backdrop_path)}
                  alt={movieDetails.title || movieDetails.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
                
                {/* Play Button */}
                {getTrailerUrl() && (
                  <a
                    href={getTrailerUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 bg-primary/80 hover:bg-primary rounded-full transition-colors"
                  >
                    <Play className="h-8 w-8 text-primary-foreground" />
                  </a>
                )}
              </div>

              <div className="p-6 space-y-6">
                {/* Title and Basic Info */}
                <div className="flex flex-col md:flex-row md:items-start md:space-x-6">
                  <div className="flex-1">
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                      {movieDetails.title || movieDetails.name}
                    </h1>
                    
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-4">
                      {(movieDetails.release_date || movieDetails.first_air_date) && (
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(movieDetails.release_date || movieDetails.first_air_date)}
                        </div>
                      )}
                      
                      {movieDetails.runtime && (
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {formatRuntime(movieDetails.runtime)}
                        </div>
                      )}

                      <span className="capitalize px-2 py-1 bg-muted rounded text-muted-foreground">
                        {movie.media_type || 'movie'}
                      </span>
                    </div>

                    {/* Genres */}
                    {movieDetails.genres && movieDetails.genres.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {movieDetails.genres.map((genre) => (
                          <span key={genre.id} className="genre-tag">
                            {genre.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Poster */}
                  <div className="w-32 md:w-40 flex-shrink-0">
                    <img
                      src={getImageUrl(movieDetails.poster_path)}
                      alt={movieDetails.title || movieDetails.name}
                      className="w-full rounded-lg"
                    />
                  </div>
                </div>

                {/* Ratings */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {movieDetails.vote_average > 0 && (
                    <div className="text-center">
                      <div className={cn('rating-badge', getRatingColor(movieDetails.vote_average))}>
                        <Star className="h-3 w-3 mr-1" />
                        {movieDetails.vote_average.toFixed(1)}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">TMDB</p>
                    </div>
                  )}
                  
                  {omdbDetails?.imdbRating && omdbDetails.imdbRating !== 'N/A' && (
                    <div className="text-center">
                      <div className={cn('rating-badge', getRatingColor(parseFloat(omdbDetails.imdbRating)))}>
                        <Star className="h-3 w-3 mr-1" />
                        {omdbDetails.imdbRating}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">IMDb</p>
                    </div>
                  )}
                  
                  {omdbDetails?.Ratings?.find(r => r.Source === 'Rotten Tomatoes') && (
                    <div className="text-center">
                      <div className="rating-badge rating-medium">
                        🍅 {omdbDetails.Ratings.find(r => r.Source === 'Rotten Tomatoes').Value}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Rotten Tomatoes</p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center space-x-3">
                  <button
                    onClick={handleWatchlistClick}
                    className={cn(
                      'flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors',
                      isInWatchlist
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                        : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    )}
                  >
                    {isInWatchlist ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                    <span>{isInWatchlist ? 'In Watchlist' : 'Add to Watchlist'}</span>
                  </button>

                  {getTrailerUrl() && (
                    <a
                      href={getTrailerUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                    >
                      <Play className="h-4 w-4" />
                      <span>Watch Trailer</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>

                {/* Overview */}
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">Overview</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {movieDetails.overview || omdbDetails?.Plot || 'No overview available.'}
                  </p>
                </div>

                {/* Cast */}
                {movieDetails.credits?.cast && movieDetails.credits.cast.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center">
                      <Users className="h-5 w-5 mr-2" />
                      Cast
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {movieDetails.credits.cast.slice(0, 8).map((actor) => (
                        <div key={actor.id} className="flex items-center space-x-3 p-2 bg-muted/50 rounded-lg">
                          <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center text-xs font-semibold">
                            {actor.name.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{actor.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{actor.character}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommendations */}
                {movieDetails.recommendations?.results && movieDetails.recommendations.results.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-3">You might also like</h3>
                    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                      {movieDetails.recommendations.results.slice(0, 6).map((rec) => (
                        <div key={rec.id} className="cursor-pointer group">
                          <img
                            src={getImageUrl(rec.poster_path, 'w200')}
                            alt={rec.title || rec.name}
                            className="w-full aspect-[2/3] object-cover rounded-lg group-hover:scale-105 transition-transform duration-200"
                          />
                          <p className="text-xs text-foreground mt-1 text-center truncate">
                            {rec.title || rec.name}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}