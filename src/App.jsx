// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import BookDetail from './pages/BookDetail';
import AuthorDetail from './pages/AuthorDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import { FavoritesProvider } from './context/FavoritesContext';
import Browse from './pages/Browse';
import Profile from './pages/Profile';

const App = () => {
  return (
    <FavoritesProvider>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/book/:id' element={<BookDetail />} />
        <Route path='/author/:id' element={<AuthorDetail />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/browse' element={<Browse />} />
        <Route path='/profile' element={<Profile />} />
      </Routes>
    </FavoritesProvider>
  );
};

export default App;
