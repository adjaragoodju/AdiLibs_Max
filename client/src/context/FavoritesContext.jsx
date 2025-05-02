// src/context/FavoritesContext.jsx
import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const FavoritesContext = createContext(null);
const API_URL = 'http://localhost:3001/api';

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  // Load favorites when auth state changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchFavorites();
    } else {
      // Load from localStorage if not authenticated
      const savedFavorites = localStorage.getItem('adilibs-favorites');
      if (savedFavorites) {
        try {
          setFavorites(JSON.parse(savedFavorites));
        } catch (error) {
          console.error('Error parsing localStorage favorites:', error);
        }
      }
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Fetch favorites from API
  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      if (!token) {
        console.error('No auth token found');
        setLoading(false);
        return;
      }

      const response = await axios.get(`${API_URL}/favorites`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log('Favorites loaded from API:', response.data);
      setFavorites(response.data);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add to favorites
  const addToFavorites = async (book) => {
    try {
      console.log('Adding to favorites:', book);

      // Add to UI immediately
      if (!favorites.some((fav) => fav.title === book.title)) {
        const newFavorites = [...favorites, book];
        setFavorites(newFavorites);
        localStorage.setItem('adilibs-favorites', JSON.stringify(newFavorites));
        console.log('Updated UI and localStorage with new favorite');
      } else {
        console.log('Book already in favorites UI');
      }

      // Only save to database if authenticated
      if (isAuthenticated && book.id) {
        const token = localStorage.getItem('token');

        if (!token) {
          console.error('No token found');
          return;
        }

        console.log('Saving to database:', book.id);
        await axios.post(
          `${API_URL}/favorites`,
          { bookId: book.id },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log('Successfully saved to database');

        // Refresh favorites from API
        fetchFavorites();
      } else {
        if (!isAuthenticated) {
          console.log('Not saving to database - user not authenticated');
        } else if (!book.id) {
          console.log('Not saving to database - book has no ID');
        }
      }
    } catch (error) {
      console.error('Error adding to favorites:', error);
      if (error.response) {
        console.error('Server response:', error.response.data);
      }
    }
  };

  // Remove from favorites
  const removeFromFavorites = async (book) => {
    try {
      console.log('Removing from favorites:', book);

      // Remove from UI immediately
      const newFavorites = favorites.filter((fav) => fav.title !== book.title);
      setFavorites(newFavorites);
      localStorage.setItem('adilibs-favorites', JSON.stringify(newFavorites));
      console.log('Updated UI and localStorage');

      // Remove from database if authenticated and has ID
      if (isAuthenticated && book.id) {
        const token = localStorage.getItem('token');

        if (!token) {
          console.error('No token found');
          return;
        }

        console.log('Removing from database:', book.id);
        await axios.delete(`${API_URL}/favorites/${book.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log('Successfully removed from database');

        // Refresh favorites from API
        fetchFavorites();
      } else {
        if (!isAuthenticated) {
          console.log('Not removing from database - user not authenticated');
        } else if (!book.id) {
          console.log('Not removing from database - book has no ID');
        }
      }
    } catch (error) {
      console.error('Error removing from favorites:', error);
      if (error.response) {
        console.error('Server response:', error.response.data);
      }
    }
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        loading,
        addToFavorites,
        removeFromFavorites,
        fetchFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}
