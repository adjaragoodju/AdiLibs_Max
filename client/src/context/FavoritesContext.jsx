// src/context/FavoritesContext.jsx
import { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, user } = useAuth();
  const API_URL = 'http://localhost:5000/api'; // You would replace with your real API URL

  // Fetch favorites when authentication state changes
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
  }, [isAuthenticated, user]);

  // Fetch favorites from API
  const fetchFavorites = async () => {
    try {
      setLoading(true);

      // For demo purposes, we'll use local storage even for authenticated users
      // In a production app, you would call your API
      const savedFavorites = localStorage.getItem('adilibs-favorites');
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }

      // Uncomment when you have a real API
      /*
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/favorites`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFavorites(response.data);
      */
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add to favorites
  const addToFavorites = async (book) => {
    try {
      if (isAuthenticated) {
        // In a production app, this would call your API
        // For demo purposes, we'll use localStorage for both authenticated and non-authenticated users

        // Check if already in favorites first
        if (!favorites.some((fav) => fav.title === book.title)) {
          const newFavorites = [...favorites, book];
          setFavorites(newFavorites);
          localStorage.setItem(
            'adilibs-favorites',
            JSON.stringify(newFavorites)
          );
        }

        // Uncomment when you have a real API
        /*
        const token = localStorage.getItem('token');
        await axios.post(`${API_URL}/favorites`, { bookId: book.id }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Refresh favorites from server
        fetchFavorites();
        */
      } else {
        // Fallback to localStorage for non-authenticated users
        if (!favorites.some((fav) => fav.title === book.title)) {
          const newFavorites = [...favorites, book];
          setFavorites(newFavorites);
          localStorage.setItem(
            'adilibs-favorites',
            JSON.stringify(newFavorites)
          );
        }
      }
    } catch (error) {
      console.error('Error adding to favorites:', error);
    }
  };

  // Remove from favorites
  const removeFromFavorites = async (bookToRemove) => {
    try {
      if (isAuthenticated) {
        // In a production app, this would call your API
        // For demo purposes, we'll use localStorage for both authenticated and non-authenticated users

        const newFavorites = favorites.filter(
          (book) => book.title !== bookToRemove.title
        );
        setFavorites(newFavorites);
        localStorage.setItem('adilibs-favorites', JSON.stringify(newFavorites));

        // Uncomment when you have a real API
        /*
        const token = localStorage.getItem('token');
        await axios.delete(`${API_URL}/favorites/${bookToRemove.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Refresh favorites from server
        fetchFavorites();
        */
      } else {
        // Fallback to localStorage for non-authenticated users
        const newFavorites = favorites.filter(
          (book) => book.title !== bookToRemove.title
        );
        setFavorites(newFavorites);
        localStorage.setItem('adilibs-favorites', JSON.stringify(newFavorites));
      }
    } catch (error) {
      console.error('Error removing from favorites:', error);
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
