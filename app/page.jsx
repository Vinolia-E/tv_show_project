'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import SearchSection from '@/components/SearchSection';
import TrendingSection from '@/components/TrendingSection';
import GenreSection from '@/components/GenreSection';
import WatchlistSection from '@/components/WatchlistSection';
import MovieModal from '@/components/MovieModal';
import { useWatchlist } from '@/hooks/useWatchlist';

export default function Home() {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [activeTab, setActiveTab] = useState('trending');
  const [searchQuery, setSearchQuery] = useState('');
  const { watchlist, addToWatchlist, removeFromWatchlist, toggleWatched } = useWatchlist();

  const handleMovieSelect = (movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  const renderActiveSection = () => {
    switch (activeTab) {
      case 'search':
        return <SearchSection query={searchQuery} onMovieSelect={handleMovieSelect} />;
      case 'trending':
        return <TrendingSection onMovieSelect={handleMovieSelect} />;
      case 'genres':
        return <GenreSection onMovieSelect={handleMovieSelect} />;
      case 'watchlist':
        return (
          <WatchlistSection
            watchlist={watchlist}
            onMovieSelect={handleMovieSelect}
            onRemoveFromWatchlist={removeFromWatchlist}
            onToggleWatched={toggleWatched}
          />
        );
      default:
        return <TrendingSection onMovieSelect={handleMovieSelect} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        watchlistCount={watchlist.length}
      />
      
      <main className="container mx-auto px-4 pt-24 pb-8">
        {renderActiveSection()}
      </main>

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          isOpen={!!selectedMovie}
          onClose={handleCloseModal}
          watchlist={watchlist}
          onAddToWatchlist={addToWatchlist}
          onRemoveFromWatchlist={removeFromWatchlist}
        />
      )}
    </div>
  );
}