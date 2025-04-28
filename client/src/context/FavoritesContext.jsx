// src/context/FavoritesContext.jsx
import { createContext, useState, useContext, useEffect } from 'react';
import { favoriteService } from '../services/api';
import { useAuth } from './AuthContext';

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  // Fetch favorites from API when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchFavorites();
    } else {
      // Load from localStorage for non-authenticated users
      try {
        const savedFavorites = localStorage.getItem('adilibs-favorites');
        if (savedFavorites) {
          setFavorites(JSON.parse(savedFavorites));
        }
      } catch (error) {
        console.error('Error loading favorites from localStorage:', error);
      }
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Fetch favorites from API
  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const response = await favoriteService.getFavorites();
      setFavorites(response.data);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add to favorites
  const addToFavorites = async (book) => {
    if (isAuthenticated) {
      try {
        await favoriteService.addFavorite(book.id);
        // Refresh favorites from server
        fetchFavorites();
      } catch (error) {
        console.error('Error adding to favorites:', error);
      }
    } else {
      // Fallback to localStorage for non-authenticated users
      if (!favorites.some((fav) => fav.title === book.title)) {
        const newFavorites = [...favorites, book];
        setFavorites(newFavorites);
        localStorage.setItem('adilibs-favorites', JSON.stringify(newFavorites));
      }
    }
  };

  // Remove from favorites
  const removeFromFavorites = async (bookToRemove) => {
    if (isAuthenticated) {
      try {
        await favoriteService.removeFavorite(bookToRemove.id);
        // Refresh favorites from server
        fetchFavorites();
      } catch (error) {
        console.error('Error removing from favorites:', error);
      }
    } else {
      // Fallback to localStorage for non-authenticated users
      const newFavorites = favorites.filter(
        (book) => book.title !== bookToRemove.title
      );
      setFavorites(newFavorites);
      localStorage.setItem('adilibs-favorites', JSON.stringify(newFavorites));
    }
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        loading,
        addToFavorites,
        removeFromFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

// Hook for using the favorites context
export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
