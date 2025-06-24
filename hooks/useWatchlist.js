'use client';

import { useState, useEffect } from 'react';

const WATCHLIST_KEY = 'movieflix-watchlist';

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    const savedWatchlist = localStorage.getItem(WATCHLIST_KEY);
    if (savedWatchlist) {
      try {
        setWatchlist(JSON.parse(savedWatchlist));
      } catch (error) {
        console.error('Error parsing watchlist from localStorage:', error);
        setWatchlist([]);
      }
    }
  }, []);

  const saveWatchlist = (newWatchlist) => {
    setWatchlist(newWatchlist);
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(newWatchlist));
  };

  const addToWatchlist = (movie) => {
    const exists = watchlist.find(item => item.id === movie.id && item.media_type === movie.media_type);
    if (!exists) {
      const newItem = {
        ...movie,
        addedAt: new Date().toISOString(),
        watched: false,
      };
      saveWatchlist([...watchlist, newItem]);
      return true;
    }
    return false;
  };

  const removeFromWatchlist = (movieId, mediaType) => {
    const newWatchlist = watchlist.filter(
      item => !(item.id === movieId && item.media_type === mediaType)
    );
    saveWatchlist(newWatchlist);
  };

  const toggleWatched = (movieId, mediaType) => {
    const newWatchlist = watchlist.map(item => {
      if (item.id === movieId && item.media_type === mediaType) {
        return { ...item, watched: !item.watched };
      }
      return item;
    });
    saveWatchlist(newWatchlist);
  };

  const isInWatchlist = (movieId, mediaType) => {
    return watchlist.some(item => item.id === movieId && item.media_type === mediaType);
  };

  const getWatchedCount = () => {
    return watchlist.filter(item => item.watched).length;
  };

  const getUnwatchedCount = () => {
    return watchlist.filter(item => !item.watched).length;
  };

  return {
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
    toggleWatched,
    isInWatchlist,
    getWatchedCount,
    getUnwatchedCount,
  };
}