// src/pages/Profile.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFavorites } from '../context/FavoritesContext';
import SimpleLayout from '../components/layout/SimpleLayout';

const Profile = () => {
  const navigate = useNavigate();
  const { favorites, removeFromFavorites } = useFavorites();
  const [activeTab, setActiveTab] = useState('profile');

  // Mock user data - will come from backend later
  const userData = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    joined: 'January 15, 2025',
    avatar: '/placeholder-avatar.jpg.avif',
  };

  return (
    <>
      <SimpleLayout>
        <main className='container mx-auto px-6 py-12 mt-12'>
          <h1 className='text-3xl font-bold mb-8'>Your Account</h1>

          <div className='flex flex-col md:flex-row gap-8'>
            {/* Sidebar */}
            <div className='md:w-1/4'>
              <div className='bg-white shadow rounded-lg p-6 mb-6'>
                <div className='flex items-center mb-6'>
                  <img
                    src={userData.avatar}
                    alt='Profile'
                    className='w-16 h-16 rounded-full mr-4 object-cover'
                  />
                  <div>
                    <h2 className='text-xl font-bold'>{userData.name}</h2>
                    <p className='text-gray-600 text-sm'>
                      Member since {userData.joined}
                    </p>
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
                onClick={() => {
                  // Will implement actual logout later
                  alert(
                    'Logout functionality will be implemented with backend integration'
                  );
                }}
              >
                Sign Out
              </button>
            </div>

            {/* Main Content */}
            <div className='md:w-3/4'>
              {activeTab === 'profile' && (
                <div className='bg-white shadow rounded-lg p-6'>
                  <h2 className='text-xl font-bold mb-6'>
                    Profile Information
                  </h2>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Full Name
                      </label>
                      <input
                        type='text'
                        className='w-full p-2 border rounded'
                        value={userData.name}
                        readOnly
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Email Address
                      </label>
                      <input
                        type='email'
                        className='w-full p-2 border rounded'
                        value={userData.email}
                        readOnly
                      />
                    </div>
                  </div>

                  <div className='mt-6'>
                    <button className='bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors'>
                      Edit Profile
                    </button>
                  </div>
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
                              navigate(
                                `/book/${encodeURIComponent(book.title)}`
                              )
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
                              navigate(
                                `/book/${encodeURIComponent(book.title)}`
                              )
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
                      <p className='mt-4 text-lg font-medium'>
                        No favorites yet
                      </p>
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
                    <h3 className='text-lg font-medium mb-3'>
                      Change Password
                    </h3>
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
                      <button className='bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors'>
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
                      <button className='bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors'>
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
    </>
  );
};

export default Profile;
