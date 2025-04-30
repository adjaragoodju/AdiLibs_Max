// src/pages/Profile.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import { useAuth } from '../context/AuthContext';
import SimpleLayout from '../components/layout/SimpleLayout';
import StatusMessage from '../components/ui/StatusMessage';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const Profile = () => {
  const navigate = useNavigate();
  const { favorites, removeFromFavorites } = useFavorites();
  const { user, logout, updateProfile, isAuthenticated, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
  });
  const [statusMessage, setStatusMessage] = useState({ type: '', message: '' });

  useEffect(() => {
    // If not authenticated and not loading, redirect to login
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }

    // Initialize form data when user is loaded
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
      });
    }
  }, [isAuthenticated, loading, navigate, user]);

  if (loading) {
    return (
      <SimpleLayout>
        <div className='flex justify-center items-center h-64'>
          <LoadingSpinner size='lg' message='Loading your profile...' />
        </div>
      </SimpleLayout>
    );
  }

  if (!user) {
    return null; // This will prevent the page from rendering before redirect
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleProfileUpdate = async () => {
    const result = await updateProfile(formData);

    if (result.success) {
      setStatusMessage({
        type: 'success',
        message: 'Profile updated successfully!',
      });
      setIsEditing(false);
    } else {
      setStatusMessage({
        type: 'error',
        message: result.message || 'Failed to update profile',
      });
    }

    setTimeout(() => {
      setStatusMessage({ type: '', message: '' });
    }, 3000);
  };

  return (
    <SimpleLayout>
      <main className='container mx-auto px-6 py-12 mt-12'>
        <h1 className='text-3xl font-bold mb-8'>Your Account</h1>

        <div className='flex flex-col md:flex-row gap-8'>
          {/* Sidebar */}
          <div className='md:w-1/4'>
            <div className='bg-white shadow rounded-lg p-6 mb-6'>
              <div className='flex items-center mb-6'>
                <img
                  src={user.profileImage || '/placeholder-avatar.jpg.avif'}
                  alt='Profile'
                  className='w-16 h-16 rounded-full mr-4 object-cover'
                />
                <div>
                  <h2 className='text-xl font-bold'>{user.username}</h2>
                  <p className='text-gray-600 text-sm'>{user.email}</p>
                </div>
              </div>

              <nav>
                <button
                  className={`w-full text-left py-2 px-3 rounded mb-2 ${
                    activeTab === 'profile'
                      ? 'bg-black text-white'
                      : 'hover:bg-gray-100'
                  }`}
                  onClick={() => setActiveTab('profile')}
                >
                  Profile
                </button>
                <button
                  className={`w-full text-left py-2 px-3 rounded mb-2 ${
                    activeTab === 'favorites'
                      ? 'bg-black text-white'
                      : 'hover:bg-gray-100'
                  }`}
                  onClick={() => setActiveTab('favorites')}
                >
                  Favorites
                  {favorites.length > 0 && (
                    <span className='ml-2 bg-gray-200 text-gray-800 text-xs font-medium px-2 py-0.5 rounded-full'>
                      {favorites.length}
                    </span>
                  )}
                </button>
                <button
                  className={`w-full text-left py-2 px-3 rounded mb-2 ${
                    activeTab === 'readingHistory'
                      ? 'bg-black text-white'
                      : 'hover:bg-gray-100'
                  }`}
                  onClick={() => setActiveTab('readingHistory')}
                >
                  Reading History
                </button>
                <button
                  className={`w-full text-left py-2 px-3 rounded ${
                    activeTab === 'settings'
                      ? 'bg-black text-white'
                      : 'hover:bg-gray-100'
                  }`}
                  onClick={() => setActiveTab('settings')}
                >
                  Settings
                </button>
              </nav>
            </div>

            <button
              className='w-full border border-red-500 text-red-500 rounded py-2 hover:bg-red-50 transition-colors'
              onClick={handleLogout}
            >
              Sign Out
            </button>
          </div>

          {/* Main Content */}
          <div className='md:w-3/4'>
            {/* Status messages */}
            {statusMessage.message && (
              <StatusMessage
                type={statusMessage.type}
                message={statusMessage.message}
                autoHide={true}
                onClose={() => setStatusMessage({ type: '', message: '' })}
              />
            )}

            {activeTab === 'profile' && (
              <div className='bg-white shadow rounded-lg p-6'>
                <h2 className='text-xl font-bold mb-6'>Profile Information</h2>

                {isEditing ? (
                  <div className='space-y-6'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                          Username
                        </label>
                        <input
                          type='text'
                          name='username'
                          className='w-full p-2 border rounded'
                          value={formData.username}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                          Email Address
                        </label>
                        <input
                          type='email'
                          name='email'
                          className='w-full p-2 border rounded'
                          value={formData.email}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className='flex space-x-4'>
                      <button
                        onClick={handleProfileUpdate}
                        className='bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors'
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setFormData({
                            username: user.username || '',
                            email: user.email || '',
                          });
                        }}
                        className='border border-gray-300 px-4 py-2 rounded hover:bg-gray-50 transition-colors'
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                          Username
                        </label>
                        <div className='p-2 bg-gray-50 rounded border border-gray-200'>
                          {user.username}
                        </div>
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                          Email Address
                        </label>
                        <div className='p-2 bg-gray-50 rounded border border-gray-200'>
                          {user.email}
                        </div>
                      </div>
                    </div>

                    <div className='mt-6'>
                      <button
                        onClick={() => setIsEditing(true)}
                        className='bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors'
                      >
                        Edit Profile
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'favorites' && (
              <div className='bg-white shadow rounded-lg p-6'>
                <h2 className='text-xl font-bold mb-6'>Your Favorites</h2>

                {favorites.length > 0 ? (
                  <div className='space-y-4'>
                    {favorites.map((book, index) => (
                      <div
                        key={index}
                        className='flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors'
                      >
                        <div
                          className='cursor-pointer'
                          onClick={() =>
                            navigate(`/book/${encodeURIComponent(book.title)}`)
                          }
                        >
                          <img
                            src={book.image || '/placeholder-book.jpg'}
                            alt={book.title}
                            className='w-16 h-24 object-cover rounded hover:opacity-90 transition-opacity'
                          />
                        </div>

                        <div
                          className='flex-grow px-4 cursor-pointer'
                          onClick={() =>
                            navigate(`/book/${encodeURIComponent(book.title)}`)
                          }
                        >
                          <h3 className='font-medium text-lg hover:text-blue-600 transition-colors'>
                            {book.title}
                          </h3>
                          <p className='text-sm text-gray-600'>
                            {book.author} - {book.year}
                          </p>
                          <p className='text-xs text-gray-500 mt-1'>
                            {book.genre}
                          </p>
                        </div>

                        <button
                          className='text-red-500 hover:text-red-700 p-2 flex items-center transition-colors'
                          onClick={() => removeFromFavorites(book)}
                          aria-label='Remove from favorites'
                        >
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            className='h-6 w-6'
                            fill='currentColor'
                            viewBox='0 0 24 24'
                            stroke='currentColor'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className='text-center py-12 bg-gray-50 rounded-lg'>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-12 w-12 mx-auto text-gray-400'
                      fill='none'
                      viewBox='0 0 24 24'
                      stroke='currentColor'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
                      />
                    </svg>
                    <p className='mt-4 text-lg font-medium'>No favorites yet</p>
                    <p className='text-gray-500 mb-6'>
                      Start exploring books to add to your favorites
                    </p>
                    <button
                      onClick={() => navigate('/browse')}
                      className='bg-black hover:bg-gray-800 text-white px-4 py-2 rounded transition-colors'
                    >
                      Browse Books
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'readingHistory' && (
              <div className='bg-white shadow rounded-lg p-6'>
                <h2 className='text-xl font-bold mb-6'>Reading History</h2>
                <div className='text-center py-12 bg-gray-50 rounded-lg'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-12 w-12 mx-auto text-gray-400'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253'
                    />
                  </svg>
                  <p className='mt-4 text-lg font-medium'>
                    No reading history yet
                  </p>
                  <p className='text-gray-500 mb-6'>
                    Your reading activity will appear here
                  </p>
                  <button
                    onClick={() => navigate('/browse')}
                    className='bg-black hover:bg-gray-800 text-white px-4 py-2 rounded transition-colors'
                  >
                    Find Something to Read
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className='bg-white shadow rounded-lg p-6'>
                <h2 className='text-xl font-bold mb-6'>Account Settings</h2>

                <div className='mb-6'>
                  <h3 className='text-lg font-medium mb-3'>Change Password</h3>
                  <div className='space-y-4'>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Current Password
                      </label>
                      <input
                        type='password'
                        className='w-full p-2 border rounded'
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        New Password
                      </label>
                      <input
                        type='password'
                        className='w-full p-2 border rounded'
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Confirm New Password
                      </label>
                      <input
                        type='password'
                        className='w-full p-2 border rounded'
                      />
                    </div>
                  </div>
                  <div className='mt-4'>
                    <button
                      className='bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors'
                      onClick={() => {
                        setStatusMessage({
                          type: 'success',
                          message:
                            'Password updated successfully! (Demo functionality)',
                        });
                      }}
                    >
                      Update Password
                    </button>
                  </div>
                </div>

                <hr className='my-6' />

                <div>
                  <h3 className='text-lg font-medium mb-3'>
                    Email Preferences
                  </h3>
                  <div className='space-y-2'>
                    <div className='flex items-center'>
                      <input
                        type='checkbox'
                        id='newsletter'
                        className='mr-2'
                        defaultChecked
                      />
                      <label htmlFor='newsletter'>
                        Receive newsletter with book recommendations
                      </label>
                    </div>
                    <div className='flex items-center'>
                      <input
                        type='checkbox'
                        id='newReleases'
                        className='mr-2'
                        defaultChecked
                      />
                      <label htmlFor='newReleases'>
                        Notify me about new releases from favorite authors
                      </label>
                    </div>
                  </div>
                  <div className='mt-4'>
                    <button
                      className='bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors'
                      onClick={() => {
                        setStatusMessage({
                          type: 'success',
                          message:
                            'Email preferences saved! (Demo functionality)',
                        });
                      }}
                    >
                      Save Preferences
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </SimpleLayout>
  );
};

export default Profile;
