// server/middleware/corsMiddleware.js
const cors = require('cors');

// Enhanced CORS middleware with better logging and flexibility
const setupCors = (app) => {
  console.log('Setting up CORS middleware...');

  // Define CORS options with explicit allowed origins
  const corsOptions = {
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl)
      // This is important for direct API calls from your test scripts
      if (!origin) return callback(null, true);

      // List of allowed origins - include both production and development
      const allowedOrigins = [
        'http://localhost:3000', // React dev server
        'http://localhost:5173', // Vite dev server
        'http://localhost:8080', // Another common dev port
        'http://localhost', // Local without port
        'http://127.0.0.1:5173', // Vite alternative URL
        // Add your production URLs here
      ];

      if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        console.warn(`CORS blocked request from origin: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  };

  // Use CORS middleware
  app.use(cors(corsOptions));

  // Log when a request is blocked by CORS
  app.use((err, req, res, next) => {
    if (err.message === 'Not allowed by CORS') {
      console.error(
        `CORS Error: ${req.method} ${req.path} from origin ${req.headers.origin} blocked`
      );
      return res.status(403).json({ message: 'CORS policy restriction' });
    }
    next(err);
  });

  // Add a simple endpoint to test CORS
  app.get('/api/cors-test', (req, res) => {
    res.json({
      message: 'CORS is working correctly',
      origin: req.headers.origin || 'Unknown origin',
      timestamp: new Date(),
    });
  });

  console.log('CORS middleware configured successfully');
};

module.exports = setupCors;
