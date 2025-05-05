const express = require('express');
const cors = require('cors');
const http = require('http');
const dotenv = require('dotenv');
const chatRoutes = require('./routes/chat');

// Load environment variables
dotenv.config();

// Debug logging
console.log('Environment variables loaded:', {
  PORT: process.env.PORT,
  NODE_ENV: process.env.NODE_ENV,
  HAS_TOGETHER_KEY: !!process.env.TOGETHER_API_KEY
});

const app = express();
const server = http.createServer(app);

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://jeevansaar-frontend.vercel.app', 'https://www.jeevansaar-frontend.vercel.app']
    : 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/api/chat', chatRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    env: {
      PORT: process.env.PORT,
      NODE_ENV: process.env.NODE_ENV,
      HAS_TOGETHER_KEY: !!process.env.TOGETHER_API_KEY
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
}); 