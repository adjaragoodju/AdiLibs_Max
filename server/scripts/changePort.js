// scripts/changePort.js
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load current environment variables
dotenv.config();

// Function to update .env file
function updateEnvFile(newPort) {
  const envPath = path.join(__dirname, '..', '.env');

  try {
    // Read current .env content
    let envContent = '';
    try {
      envContent = fs.readFileSync(envPath, 'utf8');
    } catch (err) {
      console.log('No existing .env file found, creating new one');
    }

    // Check if PORT exists in .env
    if (envContent.includes('PORT=')) {
      // Replace existing PORT
      envContent = envContent.replace(/PORT=\d+/, `PORT=${newPort}`);
    } else {
      // Add PORT if it doesn't exist
      envContent += `\nPORT=${newPort}`;
    }

    // Write updated content back
    fs.writeFileSync(envPath, envContent);
    console.log(`✅ Updated .env file with PORT=${newPort}`);
  } catch (error) {
    console.error('Error updating .env file:', error);
  }
}

// Try to find an available port
async function findAvailablePort() {
  const net = require('net');

  // Check if port is in use
  function isPortInUse(port) {
    return new Promise((resolve) => {
      const server = net
        .createServer()
        .once('error', (err) => {
          if (err.code === 'EADDRINUSE') {
            // Port is in use
            resolve(true);
          } else {
            // Other error
            resolve(false);
          }
        })
        .once('listening', () => {
          // Port is free
          server.close();
          resolve(false);
        })
        .listen(port);
    });
  }

  // Try ports in this range
  const portOptions = [
    3001, 3002, 3003, 3004, 3005, 3006, 3007, 3008, 3009, 3010,
  ];

  console.log('Looking for an available port...');

  for (const port of portOptions) {
    const inUse = await isPortInUse(port);
    if (!inUse) {
      console.log(`Found available port: ${port}`);
      return port;
    }
  }

  console.log('No available ports found in the preferred range');
  return 4000; // Fallback to a different range
}

// Main function
async function changePort() {
  console.log('Current PORT in .env:', process.env.PORT || 'Not defined');

  // Find an available port
  const newPort = await findAvailablePort();

  // Update .env file
  updateEnvFile(newPort);

  console.log('\nNext steps:');
  console.log(`1. Start your server: npm run dev`);
  console.log(`2. Update your frontend API URL to use port ${newPort}`);
  console.log(
    `   For example: const API_URL = 'http://localhost:${newPort}/api';`
  );
}

// Run the function
changePort();
