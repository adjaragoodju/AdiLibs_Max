// scripts/checkServerPort.js
const net = require('net');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Ports to check
const ports = [3001, 5000];

// Function to check if a port is in use
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

// Check ports
async function checkPorts() {
  console.log(`Current PORT in .env: ${process.env.PORT || 'Not defined'}`);
  console.log('Checking for services running on ports:');

  for (const port of ports) {
    const inUse = await isPortInUse(port);
    console.log(
      `Port ${port}: ${
        inUse
          ? 'IN USE (something is running here)'
          : 'Available (nothing running here)'
      }`
    );
  }

  console.log('\nTroubleshooting tips:');
  console.log(
    '- If your intended port shows as "Available", your server is not running on that port'
  );
  console.log(
    '- If port 5000 is not in use, make sure to update your .env file and restart the server'
  );
  console.log('- You may need to update the API URL in your frontend code');
}

checkPorts();
