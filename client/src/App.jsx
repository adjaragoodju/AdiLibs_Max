// client/src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import BookDetail from './pages/BookDetail';
import AuthorDetail from './pages/AuthorDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Browse from './pages/Browse';
import Profile from './pages/Profile';
import Favorites from './pages/Favorites';
import GoogleBooks from './pages/GoogleBooks';
import GoogleBookDetail from './components/books/GoogleBookDetail';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { FavoritesProvider } from './context/FavoritesContext';
import { AuthProvider } from './context/AuthContext';

const App = () => {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/book/:id' element={<BookDetail />} />
          <Route path='/author/:id' element={<AuthorDetail />} />
          <Route path='/google-books' element={<GoogleBooks />} />
          <Route path='/google-book/:id' element={<GoogleBookDetail />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/browse' element={<Browse />} />
          <Route
            path='/profile'
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path='/favorites'
            element={
              <ProtectedRoute>
                <Favorites />
              </ProtectedRoute>
            }
          />
          <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>
      </FavoritesProvider>
    </AuthProvider>
  );
};
export default App;
