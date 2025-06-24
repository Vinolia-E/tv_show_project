const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const OMDB_BASE_URL = 'https://www.omdbapi.com';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// Note: For demo purposes, using demo API keys. In production, use environment variables
const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || 'demo_key';
const OMDB_API_KEY = process.env.NEXT_PUBLIC_OMDB_API_KEY || 'demo_key';

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

async function fetchWithErrorHandling(url, options = {}) {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new ApiError(`HTTP error! status: ${response.status}`, response.status);
    }

    console.log('API response:', response);
    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Network error occurred', 0);
  }
}

// TMDB API functions
export async function searchMovies(query, page = 1) {
  if (!query.trim()) return { results: [], total_pages: 0 };
  
  try {
    const url = `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&page=${page}`;
    return await fetchWithErrorHandling(url);
  } catch (error) {
    console.error('Error searching movies:', error);
    return { results: [], total_pages: 0 };
  }
}

export async function getTrendingContent(timeWindow = 'week', page = 1) {
  try {
    const url = `${TMDB_BASE_URL}/trending/movie/${timeWindow}?api_key=${TMDB_API_KEY}&page=${page}`;
    return await fetchWithErrorHandling(url);
  } catch (error) {
    console.error('Error fetching trending content:', error);
    return { results: [] };
  }
}

export async function getMovieDetails(id, mediaType = 'movie') {
  try {
    const url = `${TMDB_BASE_URL}/${mediaType}/${id}?api_key=${TMDB_API_KEY}&append_to_response=credits,videos,recommendations`;
    return await fetchWithErrorHandling(url);
  } catch (error) {
    console.error('Error fetching movie details:', error);
    return null;
  }
}

export async function getGenres(mediaType = 'movie') {
  try {
    const url = `${TMDB_BASE_URL}/genre/${mediaType}/list?api_key=${TMDB_API_KEY}`;
    return await fetchWithErrorHandling(url);
  } catch (error) {
    console.error('Error fetching genres:', error);
    return { genres: [] };
  }
}

export async function getMoviesByGenre(genreId, mediaType = 'movie', page = 1) {
  try {
    const url = `${TMDB_BASE_URL}/discover/${mediaType}?api_key=${TMDB_API_KEY}&with_genres=${genreId}&page=${page}&sort_by=popularity.desc`;
    return await fetchWithErrorHandling(url);
  } catch (error) {
    console.error('Error fetching movies by genre:', error);
    return { results: [] };
  }
}

// OMDB API functions
export async function getOMDBDetails(title, year) {
  try {
    const url = `${OMDB_BASE_URL}/?apikey=${OMDB_API_KEY}&t=${encodeURIComponent(title)}&y=${year}&plot=full`;
    const data = await fetchWithErrorHandling(url);
    return data.Response === 'True' ? data : null;
  } catch (error) {
    console.error('Error fetching OMDB details:', error);
    return null;
  }
}

// Image URL helpers
export function getImageUrl(path, size = 'w500') {
  if (!path) return 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=500&h=750&fit=crop';
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
}

export function getBackdropUrl(path, size = 'w1280') {
  if (!path) return 'https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=1280&h=720&fit=crop';
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
}

// Cache management
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

function getCacheKey(url) {
  return url;
}

function isCacheValid(timestamp) {
  return Date.now() - timestamp < CACHE_DURATION;
}

export function getCachedData(url) {
  const key = getCacheKey(url);
  const cached = cache.get(key);
  
  if (cached && isCacheValid(cached.timestamp)) {
    return cached.data;
  }
  
  return null;
}

export function setCachedData(url, data) {
  const key = getCacheKey(url);
  cache.set(key, {
    data,
    timestamp: Date.now(),
  });
}

// Mock data for demo purposes when API keys are not available
export const mockTrendingMovies = [
  {
    id: 1,
    title: 'The Dark Knight',
    name: 'The Dark Knight',
    poster_path: '/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    backdrop_path: '/hqkIcbrOHL86UncnHIsHVcVmzue.jpg',
    overview: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.',
    release_date: '2008-07-18',
    vote_average: 9.0,
    media_type: 'movie',
    popularity: 100.5,
  },
  {
    id: 2,
    title: 'Inception',
    name: 'Inception',
    poster_path: '/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
    backdrop_path: '/s3TBrRGB1iav7gFOCNx3H31MoES.jpg',
    overview: 'Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious of his targets is offered a chance to regain his old life as payment for a task considered to be impossible.',
    release_date: '2010-07-16',
    vote_average: 8.8,
    media_type: 'movie',
    popularity: 95.2,
  },
  {
    id: 3,
    title: 'Breaking Bad',
    name: 'Breaking Bad',
    poster_path: '/ggFHVNu6YYI5L9pCfOacjizRGt.jpg',
    backdrop_path: '/tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg',
    overview: 'A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine in order to secure his family\'s future.',
    first_air_date: '2008-01-20',
    vote_average: 9.5,
    media_type: 'tv',
    popularity: 88.7,
  },
  {
    id: 4,
    title: 'The Shawshank Redemption',
    name: 'The Shawshank Redemption',
    poster_path: '/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg',
    backdrop_path: '/iNh3BivHyg5sQRPP1KOkzguEX0H.jpg',
    overview: 'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
    release_date: '1994-09-23',
    vote_average: 9.3,
    media_type: 'movie',
    popularity: 92.1,
  },
  {
    id: 5,
    title: 'Stranger Things',
    name: 'Stranger Things',
    poster_path: '/49WJfeN0moxb9IPfGn8AIqMGskD.jpg',
    backdrop_path: '/56v2KjBlU4XaOv9rVYEQypROD7P.jpg',
    overview: 'When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces, and one strange little girl.',
    first_air_date: '2016-07-15',
    vote_average: 8.7,
    media_type: 'tv',
    popularity: 85.3,
  },
  {
    id: 6,
    title: 'Pulp Fiction',
    name: 'Pulp Fiction',
    poster_path: '/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg',
    backdrop_path: '/4cDFJr4HnXN5AdPw4AKrmLlMWdO.jpg',
    overview: 'The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.',
    release_date: '1994-10-14',
    vote_average: 8.9,
    media_type: 'movie',
    popularity: 89.4,
  }
];

export const mockGenres = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 14, name: 'Fantasy' },
  { id: 36, name: 'History' },
  { id: 27, name: 'Horror' },
  { id: 10402, name: 'Music' },
  { id: 9648, name: 'Mystery' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Science Fiction' },
  { id: 10770, name: 'TV Movie' },
  { id: 53, name: 'Thriller' },
  { id: 10752, name: 'War' },
  { id: 37, name: 'Western' },
];