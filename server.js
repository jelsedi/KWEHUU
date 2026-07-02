const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();
const config = require("./config");
const errorHandler = require("./middleware/errorHandler");
const notFound = require("./middleware/notFound");


const app = express(); // Initialize Express app

// Routes
const authRoutes     = require('./routes/auth');
const orderRoutes    = require('./routes/orders');
const vendorRoutes   = require('./routes/vendors');
const riderRoutes    = require('./routes/riders');
const paymentRoutes  = require('./routes/payments');
const productRoutes  = require('./routes/products');
const adminRoutes    = require('./routes/admin');

// ── CORS: allow all origins in dev, lock down in production ──────────────────
const allowedOrigins = [
  config.FRONTEND_URL,
  'http://localhost:4000',
  'http://127.0.0.1:4000',
  'null', // file:// requests show origin as "null"
].filter(Boolean);


app.use(cors({
  origin: (origin, cb) => {
    // Allow requests with no origin (curl, Postman) and listed origins
    if (!origin || allowedOrigins.includes(origin) || config.NODE_ENV !== 'production') {
      return cb(null, true);
    }
    cb(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
}));

// ── Security ─────────────────────────────────────────────────────────────────
app.use(helmet({ contentSecurityPolicy: false })); // disabled so served HTML can load CDN assets

app.use(express.json());

// ── Rate limiting ─────────────────────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, max: 200,
  message: { error: 'Too many requests, please try again later.' },
});
app.use('/api/', limiter);

// ── Serve the frontend HTML directly from the backend ────────────────────────
// Access the app at http://localhost:4000  (no CORS issues at all)
// ── Serve Frontend ───────────────────────────────────────────────────────────
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/riders', riderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/products', productRoutes);
app.use('/api/admin', adminRoutes);



// ── Health check ──────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'Kwehu Delivery API', time: new Date().toISOString() });
});

// ── 404 ───────────────────────────────────────────────────────────────────────
app.use(notFound);
// ── Global error handler ──────────────────────────────────────────────────────
app.use(errorHandler);


const PORT = config.PORT;
app.listen(PORT, () => {
  console.log('');
  console.log('  ✅  Kwehu Delivery API is running!');
  console.log(`  🌍  Open your app at: http://localhost:${PORT}`);
  console.log(`  🔌  API base:         http://localhost:${PORT}/api`);
  console.log(`  💓  Health check:     http://localhost:${PORT}/health`);
  console.log('');
});

module.exports = app;
