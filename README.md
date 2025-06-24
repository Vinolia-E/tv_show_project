# MovieFlix - Movie & TV Show Discovery App

A comprehensive entertainment discovery platform built with Next.js, featuring movie and TV show search, watchlist management, and trending content discovery.

## Features

- **Advanced Search**: Real-time search with debouncing and filtering options
- **Trending Content**: Daily and weekly trending movies and TV shows
- **Genre Browsing**: Explore content by genres with dynamic filtering
- **Personal Watchlist**: Add, remove, and manage your watchlist with watched status
- **Detailed Movie Pages**: Comprehensive information including ratings, cast, and trailers
- **Multi-Source Ratings**: Integration with TMDB, IMDb, and Rotten Tomatoes ratings
- **Responsive Design**: Optimized for all devices with mobile-first approach
- **Dark Theme**: Beautiful dark theme with gradient backgrounds
- **Smooth Animations**: Polished UI with hover effects and transitions

## Tech Stack

- **Frontend**: Next.js 13, React 18
- **Styling**: Tailwind CSS with custom design system
- **APIs**: TMDB API, OMDB API
- **State Management**: React Hooks (useState, useEffect)
- **Storage**: localStorage for watchlist persistence
- **Icons**: Lucide React
- **UI Components**: Custom components with Radix UI primitives

## Prerequisites

- Node.js 16+ and npm/yarn
- TMDB API key from [The Movie Database](https://www.themoviedb.org/settings/api)
- OMDB API key from [Open Movie Database](http://www.omdbapi.com/apikey.aspx)

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Vinolia-E/tv_show_project.git
   cd tv_show_project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   
   Create a `.env.local` file in the root directory:
   ```env
   TMDB_API_KEY=your_tmdb_api_key_here
   OMDB_API_KEY=your_omdb_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles and Tailwind config
│   ├── layout.jsx         # Root layout component
│   └── page.jsx          # Home page component
├── components/            # Reusable React components
│   ├── Header.jsx        # Navigation header
│   ├── MovieCard.jsx     # Movie/TV show card component
│   ├── MovieModal.jsx    # Detailed movie information modal
│   ├── SearchSection.jsx # Search functionality
│   ├── TrendingSection.jsx # Trending content display
│   ├── GenreSection.jsx  # Genre browsing
│   ├── WatchlistSection.jsx # Watchlist management
│   └── LoadingSpinner.jsx # Loading component
├── hooks/                 # Custom React hooks
│   ├── useWatchlist.js   # Watchlist management hook
│   └── useDebounce.js    # Search debouncing hook
├── lib/                   # Utility functions and API calls
│   ├── api.js            # API integration functions
│   └── utils.js          # Helper utilities
└── public/               # Static assets
```

## API Integration

### TMDB API Functions
- `searchMovies()` - Search for movies and TV shows
- `getTrendingContent()` - Fetch trending content
- `getMovieDetails()` - Get detailed movie/TV information
- `getGenres()` - Fetch genre lists
- `getMoviesByGenre()` - Get content by genre

### OMDB API Functions
- `getOMDBDetails()` - Fetch additional ratings and plot details

### Error Handling
- Comprehensive error handling with fallbacks
- Graceful degradation when APIs are unavailable
- Mock data for development and demonstration

## Data Management

### LocalStorage Integration
- **Watchlist Persistence**: All watchlist data stored locally
- **User Preferences**: Filter and sort preferences saved
- **Cross-Session Sync**: Data persists across browser sessions

### Data Structure
```javascript
{
  id: number,
  title: string,
  media_type: 'movie' | 'tv',
  poster_path: string,
  vote_average: number,
  release_date: string,
  addedAt: string,
  watched: boolean
}
```

## Design System

### Color Palette
- **Primary**: Purple/Blue gradient (#667eea to #764ba2)
- **Background**: Dark theme with gradient overlay
- **Cards**: Semi-transparent with backdrop blur
- **Accents**: Success (green), warning (yellow), error (red)

### Typography
- **Font**: Inter font family
- **Hierarchy**: Clear heading and body text distinction
- **Readability**: Optimized contrast ratios

### Components
- **Cards**: Hover effects with scale and shadow
- **Buttons**: Multiple variants with transitions
- **Inputs**: Focus states with ring effects
- **Badges**: Rating and genre indicators

## 📱 Responsive Design

### Breakpoints
- **Mobile**: < 768px (2-3 columns)
- **Tablet**: 768px - 1024px (3-4 columns)
- **Desktop**: > 1024px (5-6 columns)

### Mobile Features
- Collapsible navigation menu
- Touch-optimized interactions
- Optimized image loading
- Responsive modal dialogs

## ⚡ Performance Optimizations

### API Optimizations
- **Debounced Search**: 500ms delay to reduce API calls
- **Response Caching**: 5-minute cache for API responses
- **Error Recovery**: Automatic retry mechanisms
- **Rate Limiting**: Respectful API usage patterns

### Image Optimizations
- **Lazy Loading**: Images load as needed
- **Multiple Sizes**: Responsive image sizing
- **Error Handling**: Fallback for missing images
- **Placeholder States**: Loading indicators

## Best Practices

### Code Quality
- **Modular Architecture**: Separation of concerns
- **Custom Hooks**: Reusable logic extraction
- **Error Boundaries**: Graceful error handling
- **TypeScript Ready**: Easy migration path

### Security
- **Environment Variables**: Secure API key storage
- **Input Validation**: Search query sanitization
- **CORS Handling**: Proper API request configuration

## Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on git push

### Deploy to Netlify
1. Build the project: `npm run build`
2. Deploy the `out` folder to Netlify
3. Configure environment variables

## 🔧 Customization

### Theme Customization
Edit `tailwind.config.js` to modify:
- Color scheme
- Typography settings
- Spacing system
- Animation timings

### API Configuration
Modify `lib/api.js` to:
- Add new API endpoints
- Change caching behavior
- Implement additional data sources

## Troubleshooting

### Common Issues

1. **API Keys Not Working**
   - Verify keys are correct in `.env.local`
   - Check API key permissions and quotas
   - Ensure environment variables are loaded

2. **Images Not Loading**
   - Check TMDB image base URLs
   - Verify poster paths in API responses
   - Test with different image sizes

3. **Search Not Working**
   - Check API key validity
   - Verify network connectivity
   - Test with different search queries

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

##  License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [The Movie Database (TMDB)](https://www.themoviedb.org/) for the comprehensive movie data
- [Open Movie Database (OMDB)](http://www.omdbapi.com/) for additional ratings
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Lucide](https://lucide.dev/) for the beautiful icons
- [Vercel](https://vercel.com/) for the deployment platform

---

Built with ❤️ for movie and TV show enthusiasts