const express = require('express');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Health Check Endpoint
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'AI Study Notes API Server is running smoothly',
    timestamp: new Date().toISOString()
  });
});

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    status: 'fail',
    message: `Cannot find ${req.originalUrl} on this server`
  });
});

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error('[Unhandled Error]:', err.stack);
  res.status(err.statusCode || 500).json({
    status: 'error',
    message: err.message || 'Internal Server Error'
  });
});

module.exports = app;
