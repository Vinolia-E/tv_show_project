import './globals.css';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'MovieFlix - Discover Movies & TV Shows',
  description: 'Your ultimate destination for discovering movies, TV shows, and managing your watchlist.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎬</text></svg>" />
      </head>
      <body className={inter.className}>
        {children}
        <Toaster theme="dark" richColors />
      </body>
    </html>
  );
}