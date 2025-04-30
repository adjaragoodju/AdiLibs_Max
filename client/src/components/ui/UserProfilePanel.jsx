// src/components/ui/UserProfilePanel.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const UserProfilePanel = () => {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className='bg-gray-50 p-4 rounded-lg shadow-sm mb-6'>
        <p className='text-center text-gray-600 mb-3'>
          Sign in to track your reading progress and save your favorites
        </p>
        <div className='flex justify-center space-x-3'>
          <Link
            to='/login'
            className='bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors'
          >
            Sign In
          </Link>
          <Link
            to='/register'
            className='border border-gray-300 px-4 py-2 rounded hover:bg-gray-100 transition-colors'
          >
            Register
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-gray-50 p-4 rounded-lg shadow-sm mb-6'>
      <div className='flex items-center'>
        <img
          src={user.profileImage || '/placeholder-avatar.jpg.avif'}
          alt='Profile'
          className='w-12 h-12 rounded-full object-cover mr-3'
        />
        <div className='flex-grow'>
          <p className='font-medium'>{user.username}</p>
          <p className='text-sm text-gray-600'>{user.email}</p>
        </div>
        <div className='flex space-x-2'>
          <Link
            to='/profile'
            className='text-sm text-blue-600 hover:text-blue-800'
          >
            Profile
          </Link>
          <button
            onClick={logout}
            className='text-sm text-red-600 hover:text-red-800'
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePanel;
