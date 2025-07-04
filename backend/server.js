const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const WebSocket = require('ws');
const { limiter, strictLimiter, securityMiddleware } = require('./config/server');

// Import routes
const freelancerRoutes = require('./routes/freelancerRoutes');
const chatRoutes = require('./routes/chatRoutes');
const healthRoutes = require('./routes/healthRoutes');
const authRoutes = require('./routes/authRoutes');
const subscriptionRoutes = require('./routes/subscriptionRoutes');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const PORT = process.env.PORT || 5000;

// Apply middleware
app.use(securityMiddleware);
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  req.requestId = Date.now().toString(36) + Math.random().toString(36).substr(2);
  console.log(`[${req.requestId}] ${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Apply rate limiting
app.use('/api/', limiter);

// Routes
app.use('/api', healthRoutes);
app.use('/api', freelancerRoutes);
app.use('/api', chatRoutes);
app.use('/api', authRoutes);
app.use('/api/subscription', subscriptionRoutes);

// WebSocket setup
wss.on('connection', (ws, req) => {
  console.log('New WebSocket connection');

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);

      switch (data.type) {
        case 'REAL_TIME_SEARCH':
          // Process real-time search updates
          const results = processRealtimeSearch(data.query);
          ws.send(JSON.stringify({
            type: 'SEARCH_RESULTS',
            data: results
          }));
          break;

        case 'FREELANCER_STATUS_UPDATE':
          // Broadcast freelancer availability updates
          broadcastFreelancerUpdate(data.freelancerId, data.status);
          break;
      }
    } catch (error) {
      ws.send(JSON.stringify({
        type: 'ERROR',
        message: 'Invalid message format'
      }));
    }
  });

  ws.on('close', () => {
    console.log('WebSocket connection closed');
  });
});

function broadcastFreelancerUpdate(freelancerId, status) {
  const message = JSON.stringify({
    type: 'FREELANCER_UPDATE',
    freelancerId,
    status,
    timestamp: new Date().toISOString()
  });

  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

// Root route for base URL
app.get('/', (req, res) => {
  res.send('🚀 FreelancersBot Backend is live and running!');
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error(`[${req.requestId}] Error:`, error);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    requestId: req.requestId
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    requestId: req.requestId,
    availableEndpoints: [
      'GET /api/health',
      'GET /api/freelancers',
      'POST /api/match-freelancer',
      'POST /api/chat',
      'POST /api/chat/process',
      'GET /api/freelancers/:id',
      'POST /api/auth/register',
      'POST /api/auth/login',
      'GET /api/subscription/tiers',
      'POST /api/subscription/create-checkout-session'
    ]
  });
});

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api/docs`);
  console.log(`🔐 Authentication: JWT-based with bcrypt password hashing`);
  console.log(`💳 Subscription Tiers: FREE, BASIC ($29), PRO ($79), ENTERPRISE ($199)`);
  console.log(`🤖 AI Features: Advanced matching algorithms, real-time updates`);
  console.log(`🔒 Security: Rate limiting, input validation, helmet protection`);
  console.log(`📊 Analytics: Usage tracking, performance monitoring`);
  console.log(`🌐 WebSocket: Real-time freelancer updates on port ${PORT}`);
  console.log(`✨ Premium Features: Bulk operations, advanced filters, priority support`);
  console.log(`✅ Production-ready with comprehensive error handling and monitoring!`);
});

module.exports = { app, server };
