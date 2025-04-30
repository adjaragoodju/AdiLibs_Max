// src/components/ui/LoadingSpinner.jsx
import React from 'react';

/**
 * A reusable loading spinner component
 * @param {Object} props
 * @param {string} props.size - 'sm', 'md', 'lg', 'xl' for different sizes
 * @param {string} props.color - 'black', 'white', 'gray', 'blue', 'red', etc.
 * @param {string} props.message - Optional message to display below the spinner
 */
const LoadingSpinner = ({ size = 'md', color = 'black', message = '' }) => {
  // Size configurations
  const sizeMap = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };

  // Color configurations
  const colorMap = {
    black: 'border-black',
    white: 'border-white',
    gray: 'border-gray-500',
    blue: 'border-blue-500',
    green: 'border-green-500',
    red: 'border-red-500',
    yellow: 'border-yellow-500',
  };

  const spinnerSize = sizeMap[size] || sizeMap.md;
  const spinnerColor = colorMap[color] || colorMap.black;

  return (
    <div className='flex flex-col items-center justify-center'>
      <div
        className={`${spinnerSize} border-t-2 border-b-2 ${spinnerColor} rounded-full animate-spin`}
        role='status'
        aria-label='Loading'
      />
      {message && <p className='mt-4 text-center text-gray-700'>{message}</p>}
    </div>
  );
};

export default LoadingSpinner;
