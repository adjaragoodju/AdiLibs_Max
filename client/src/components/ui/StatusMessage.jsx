// src/components/ui/StatusMessage.jsx
import React, { useEffect, useState } from 'react';

/**
 * A reusable status message component
 * @param {Object} props
 * @param {string} props.type - 'success', 'error', 'warning', 'info'
 * @param {string} props.message - The message to display
 * @param {boolean} props.autoHide - Whether to automatically hide the message after a delay
 * @param {number} props.delay - Delay in milliseconds before hiding the message (default: 5000)
 * @param {function} props.onClose - Function to call when closing the message
 */
const StatusMessage = ({
  type = 'info',
  message,
  autoHide = false,
  delay = 5000,
  onClose = () => {},
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoHide && message) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose();
      }, delay);

      return () => clearTimeout(timer);
    }
  }, [autoHide, delay, message, onClose]);

  if (!message || !isVisible) return null;

  // Configuration based on type
  const config = {
    success: {
      bgColor: 'bg-green-50',
      borderColor: 'border-green-500',
      textColor: 'text-green-700',
      icon: (
        <svg
          className='h-5 w-5 text-green-500'
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 20 20'
          fill='currentColor'
        >
          <path
            fillRule='evenodd'
            d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
            clipRule='evenodd'
          />
        </svg>
      ),
    },
    error: {
      bgColor: 'bg-red-50',
      borderColor: 'border-red-500',
      textColor: 'text-red-700',
      icon: (
        <svg
          className='h-5 w-5 text-red-500'
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 20 20'
          fill='currentColor'
        >
          <path
            fillRule='evenodd'
            d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
            clipRule='evenodd'
          />
        </svg>
      ),
    },
    warning: {
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-500',
      textColor: 'text-yellow-700',
      icon: (
        <svg
          className='h-5 w-5 text-yellow-500'
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 20 20'
          fill='currentColor'
        >
          <path
            fillRule='evenodd'
            d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM10 13a1 1 0 100-2 1 1 0 000 2zm0-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z'
            clipRule='evenodd'
          />
        </svg>
      ),
    },
    info: {
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-500',
      textColor: 'text-blue-700',
      icon: (
        <svg
          className='h-5 w-5 text-blue-500'
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 20 20'
          fill='currentColor'
        >
          <path
            fillRule='evenodd'
            d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z'
            clipRule='evenodd'
          />
        </svg>
      ),
    },
  };

  const { bgColor, borderColor, textColor, icon } = config[type] || config.info;

  return (
    <div className={`${bgColor} border-l-4 ${borderColor} p-4 mb-4`}>
      <div className='flex'>
        <div className='flex-shrink-0'>{icon}</div>
        <div className='ml-3 flex-grow'>
          <p className={`text-sm ${textColor}`}>{message}</p>
        </div>
        <button
          className='text-gray-400 hover:text-gray-500'
          onClick={() => {
            setIsVisible(false);
            onClose();
          }}
        >
          <svg
            className='h-5 w-5'
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 20 20'
            fill='currentColor'
          >
            <path
              fillRule='evenodd'
              d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
              clipRule='evenodd'
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default StatusMessage;
