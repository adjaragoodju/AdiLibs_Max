// client/src/config/apiKeys.js

/**
 * Configuration for external API keys
 *
 * In a production environment, these keys should be stored in environment variables
 * and not in the client-side code. For this example, they are included here
 * for simplicity, but this is not a secure practice for real applications.
 */

// Google Books API Key
// For a real application, use process.env.REACT_APP_GOOGLE_BOOKS_API_KEY or similar
export const GOOGLE_BOOKS_API_KEY = 'YOUR_API_KEY_HERE';

/**
 * Function to get an API key safely with proper error handling
 * @param {string} keyName - Name of the API key to retrieve
 * @returns {string} - The API key or an empty string if not found
 */
export function getApiKey(keyName) {
  const keys = {
    googleBooks: GOOGLE_BOOKS_API_KEY,
    // Add more keys as needed
  };

  if (!keys[keyName]) {
    console.warn(`API key "${keyName}" not found in configuration`);
    return '';
  }

  return keys[keyName];
}

/**
 * Function to check if an API key is valid and not empty
 * @param {string} keyName - Name of the API key to check
 * @returns {boolean} - Whether the key is valid
 */
export function isApiKeyValid(keyName) {
  const key = getApiKey(keyName);
  return key !== '' && key !== 'YOUR_API_KEY_HERE';
}
