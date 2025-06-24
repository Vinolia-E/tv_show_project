'use client';

import { useState, useEffect } from 'react';
import { Grid3X3, ChevronRight } from 'lucide-react';
import MovieCard from './MovieCard';
import LoadingSpinner from './LoadingSpinner';
import { getGenres, getMoviesByGenre, mockGenres } from '@/lib/api';
import { useWatchlist } from '@/hooks/useWatchlist';

export default function GenreSection({ onMovieSelect }) {
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMovies, setLoadingMovies] = useState(false);
  const [mediaType, setMediaType] = useState('movie');
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();

  useEffect(() => {
    fetchGenres();
  }, [mediaType]);

  useEffect(() => {
    if (selectedGenre) {
      fetchMoviesByGenre(selectedGenre.id);
    }
  }, [selectedGenre, mediaType]);

  const fetchGenres = async () => {
    setLoading(true);
    try {
      const data = await getGenres(mediaType);
      
      // Use mock data if API fails
      if (!data.genres || data.genres.length === 0) {
        setGenres(mockGenres);
      } else {
        setGenres(data.genres);
      }
      
      // Auto-select first genre
      const genreList = data.genres?.length > 0 ? data.genres : mockGenres;
      if (genreList.length > 0 && !selectedGenre) {
        setSelectedGenre(genreList[0]);
      }
    } catch (err) {
      console.error('Error fetching genres:', err);
      setGenres(mockGenres);
      if (!selectedGenre && mockGenres.length > 0) {
        setSelectedGenre(mockGenres[0]);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchMoviesByGenre = async (genreId) => {
    setLoadingMovies(true);
    try {
      const data = await getMoviesByGenre(genreId, mediaType);
      setMovies(data.results || []);
    } catch (err) {
      console.error('Error fetching movies by genre:', err);
      setMovies([]);
    } finally {
      setLoadingMovies(false);
    }
  };

  const handleGenreSelect = (genre) => {
    setSelectedGenre(genre);
    setMovies([]);
  };

  const mediaTypes = [
    { value: 'movie', label: 'Movies' },
    { value: 'tv', label: 'TV Shows' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary/20 rounded-lg border border-primary/30">
            <Grid3X3 className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Browse by Genre</h2>
            <p className="text-muted-foreground">Discover content by your favorite genres</p>
          </div>
        </div>

        {/* Media Type Selector */}
        <div className="flex items-center space-x-1 bg-card/50 backdrop-blur-sm rounded-lg p-1 border border-border/50">
          {mediaTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => setMediaType(type.value)}
              className={`px-4 py-2 rounded-md transition-all duration-200 font-medium ${
                mediaType === type.value
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Genre Navigation */}
      {!loading && (
        <div className="bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 overflow-hidden">
          <div className="p-4">
            <h3 className="font-semibold text-foreground mb-3">Select Genre</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {genres.map((genre) => (
                <button
                  key={genre.id}
                  onClick={() => handleGenreSelect(genre)}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200 font-medium text-sm ${
                    selectedGenre?.id === genre.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted/50 text-foreground hover:bg-muted'
                  }`}
                >
                  <span>{genre.name}</span>
                  {selectedGenre?.id === genre.id && <ChevronRight className="h-3 w-3" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Selected Genre Movies */}
      {selectedGenre && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-foreground">
            {selectedGenre.name} {mediaType === 'movie' ? 'Movies' : 'TV Shows'}
          </h3>

          {loadingMovies && <LoadingSpinner />}

          {!loadingMovies && movies.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {movies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={{ ...movie, media_type: mediaType }}
                  onSelect={onMovieSelect}
                  isInWatchlist={isInWatchlist(movie.id, mediaType)}
                  onAddToWatchlist={addToWatchlist}
                  onRemoveFromWatchlist={removeFromWatchlist}
                />
              ))}
            </div>
          )}

          {!loadingMovies && movies.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🎭</div>
              <h4 className="text-lg font-semibold text-foreground mb-2">No content found</h4>
              <p className="text-muted-foreground">
                No {mediaType === 'movie' ? 'movies' : 'TV shows'} found for this genre.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Loading State */}
      {loading && <LoadingSpinner />}
    </div>
  );
}