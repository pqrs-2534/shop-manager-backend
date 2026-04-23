// ============================================================
//  SHOP MANAGER — MAIN SERVER FILE
//  Run with:  npm run dev   (development)
//             npm start     (production)
// ============================================================

const express   = require('express');
const cors      = require('cors');
const dotenv    = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// ─────────────────────────────────────────
//  MIDDLEWARE
// ─────────────────────────────────────────

// Allow requests from your React frontend
app.use(cors({
  origin: '*',
  credentials: false,
}));

// Parse incoming JSON request bodies
app.use(express.json());

// Parse URL-encoded data (form submissions)
app.use(express.urlencoded({ extended: true }));

// ─────────────────────────────────────────
//  ROUTES
// ─────────────────────────────────────────
app.use('/api/auth',      require('./routes/auth'));
app.use('/api/products',  require('./routes/products'));
app.use('/api/sales',     require('./routes/sales'));
app.use('/api/expenses',  require('./routes/expenses'));
app.use('/api/dashboard', require('./routes/dashboard'));

// ─────────────────────────────────────────
//  HEALTH CHECK — visit http://localhost:5000/
// ─────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    message: '✅ Shop Manager API is running!',
    version: '1.0.0',
    endpoints: [
      'POST   /api/auth/register',
      'POST   /api/auth/login',
      'GET    /api/auth/me',
      'GET    /api/products',
      'POST   /api/products',
      'PUT    /api/products/:id',
      'DELETE /api/products/:id',
      'GET    /api/sales',
      'POST   /api/sales',
      'DELETE /api/sales/:id',
      'GET    /api/expenses',
      'POST   /api/expenses',
      'DELETE /api/expenses/:id',
      'GET    /api/dashboard',
    ],
  });
});

// ─────────────────────────────────────────
//  404 handler for unknown routes
// ─────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.method} ${req.url} not found` });
});

// ─────────────────────────────────────────
//  Global error handler
// ─────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Server error:', err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

// ─────────────────────────────────────────
//  START SERVER
// ─────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`📋 API docs:   http://localhost:${PORT}/`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}\n`);
});
