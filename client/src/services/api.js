// client/src/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
};

// Book services
export const bookService = {
  getAllBooks: () => api.get('/books'),
  getBookById: (id) => api.get(`/books/${id}`),
  createBook: (bookData) => api.post('/books', bookData),
  updateBook: (id, bookData) => api.put(`/books/${id}`, bookData),
  deleteBook: (id) => api.delete(`/books/${id}`),
};

// Author services
export const authorService = {
  getAllAuthors: () => api.get('/authors'),
  getAuthorById: (id) => api.get(`/authors/${id}`),
};

// Favorites services
export const favoriteService = {
  getFavorites: () => api.get('/favorites'),
  addFavorite: (bookId) => api.post('/favorites', { bookId }),
  removeFavorite: (bookId) => api.delete(`/favorites/${bookId}`),
};

export default api;
