'use client';

import { useState } from 'react';
import { Star, Calendar, Eye, EyeOff, Bookmark, BookmarkCheck } from 'lucide-react';
import { getImageUrl, getRatingColor } from '@/lib/utils';
import { cn } from '@/lib/utils';

export default function MovieCard({ 
  movie, 
  onSelect, 
  isInWatchlist = false, 
  onAddToWatchlist, 
  onRemoveFromWatchlist,
  showWatchedStatus = false,
  onToggleWatched,
  isWatched = false 
}) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const title = movie.title || movie.name;
  const releaseDate = movie.release_date || movie.first_air_date;
  const mediaType = movie.media_type || 'movie';
  
  const handleWatchlistClick = (e) => {
    e.stopPropagation();
    if (isInWatchlist) {
      onRemoveFromWatchlist?.(movie.id, mediaType);
    } else {
      onAddToWatchlist?.(movie);
    }
  };

  const handleWatchedClick = (e) => {
    e.stopPropagation();
    onToggleWatched?.(movie.id, mediaType);
  };

  return (
    <div 
      className="movie-card group cursor-pointer"
      onClick={() => onSelect(movie)}
    >
      {/* Poster */}
      <div className="relative overflow-hidden rounded-t-xl">
        {!imageError ? (
          <img
            src={getImageUrl(movie.poster_path)}
            alt={title}
            className={cn(
              'movie-poster transition-opacity duration-300',
              imageLoaded ? 'opacity-100' : 'opacity-0'
            )}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full aspect-[2/3] bg-muted/50 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <div className="text-4xl mb-2">🎬</div>
              <p className="text-sm">No Image</p>
            </div>
          </div>
        )}
        
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-muted/50 flex items-center justify-center">
            <div className="loader"></div>
          </div>
        )}

        {/* Rating Badge */}
        {movie.vote_average > 0 && (
          <div className="absolute top-2 left-2">
            <div className={cn('rating-badge', getRatingColor(movie.vote_average))}>
              <Star className="h-3 w-3 mr-1" />
              {movie.vote_average.toFixed(1)}
            </div>
          </div>
        )}

        {/* Media Type Badge */}
        <div className="absolute top-2 right-2">
          <span className="px-2 py-1 bg-black/70 text-white text-xs rounded-md font-medium capitalize">
            {mediaType}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-2">
          {onAddToWatchlist && (
            <button
              onClick={handleWatchlistClick}
              className={cn(
                'p-2 rounded-full transition-colors',
                isInWatchlist 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-white/20 hover:bg-white/30 text-white'
              )}
              title={isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
            >
              {isInWatchlist ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
            </button>
          )}
          {showWatchedStatus && onToggleWatched && (
            <button
              onClick={handleWatchedClick}
              className={cn(
                'p-2 rounded-full transition-colors',
                isWatched 
                  ? 'bg-green-500 text-white' 
                  : 'bg-white/20 hover:bg-white/30 text-white'
              )}
              title={isWatched ? 'Mark as Unwatched' : 'Mark as Watched'}
            >
              {isWatched ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-foreground mb-2 line-clamp-2 leading-tight">
          {title}
        </h3>
        
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
          {releaseDate && (
            <div className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              {new Date(releaseDate).getFullYear()}
            </div>
          )}
        </div>

        {movie.overview && (
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {movie.overview}
          </p>
        )}
      </div>
    </div>
  );
}