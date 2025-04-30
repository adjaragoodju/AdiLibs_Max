// scripts/killPort.js
const { exec } = require('child_process');
const os = require('os');

// Configuration
const PORT = 5000; // Port to free up

// Detection for platform-specific commands
const platform = os.platform();
let command;

if (platform === 'win32') {
  // Windows
  command = `netstat -ano | findstr :${PORT} | findstr LISTENING`;
} else {
  // Mac/Linux
  command = `lsof -i:${PORT} -t`;
}

console.log(`Attempting to find process using port ${PORT}...`);
console.log(`Platform detected: ${platform}`);

// Execute command to find process
exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`No process found using port ${PORT}`);
    console.log(
      'This is unusual since the port check showed something running here.'
    );
    console.log(
      'Recommendation: Restart your computer to clear any stuck processes.'
    );
    return;
  }

  const processIds = stdout.trim().split('\n');

  if (platform === 'win32') {
    // Windows: Parse netstat output to get PID
    const pidRegex = /(\d+)$/;
    const uniquePids = new Set();

    processIds.forEach((line) => {
      const match = line.match(pidRegex);
      if (match && match[1]) {
        uniquePids.add(match[1]);
      }
    });

    if (uniquePids.size === 0) {
      console.log('No process found on this port.');
      return;
    }

    console.log(
      `Found process(es) using port ${PORT}. PIDs: ${[...uniquePids].join(
        ', '
      )}`
    );

    // Kill each process
    uniquePids.forEach((pid) => {
      console.log(`Attempting to terminate process with PID: ${pid}...`);
      exec(`taskkill /F /PID ${pid}`, (killError, killStdout) => {
        if (killError) {
          console.error(`Failed to kill process ${pid}:`, killError.message);
        } else {
          console.log(`Successfully terminated process ${pid}`);
        }
      });
    });
  } else {
    // Mac/Linux
    if (!processIds[0]) {
      console.log('No process found on this port.');
      return;
    }

    console.log(
      `Found process(es) using port ${PORT}. PIDs: ${processIds.join(', ')}`
    );

    // Kill each process
    processIds.forEach((pid) => {
      console.log(`Attempting to terminate process with PID: ${pid}...`);
      exec(`kill -9 ${pid}`, (killError) => {
        if (killError) {
          console.error(`Failed to kill process ${pid}:`, killError.message);
        } else {
          console.log(`Successfully terminated process ${pid}`);
        }
      });
    });
  }

  console.log(
    '\nAfter terminating the process(es), try running your server again:'
  );
  console.log('npm run dev');
});
