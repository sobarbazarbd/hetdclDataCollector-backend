const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');

// Routes
const authRoutes = require('./routes/auth');
const contractorRoutes = require('./routes/contractors');
const supplierRoutes = require('./routes/suppliers');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/contractors', contractorRoutes);
app.use('/api/suppliers', supplierRoutes);

// Root route - browser এ দেখানোর জন্য
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>GUID Gatherer Backend</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background-color: #f0f0f0;
          margin: 0;
        }
        .container {
          text-align: center;
          padding: 40px;
          background: white;
          border-radius: 10px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .status {
          color: green;
          font-weight: bold;
          font-size: 24px;
        }
        .links {
          margin-top: 20px;
        }
        a {
          color: #0070f3;
          text-decoration: none;
          margin: 0 10px;
        }
        a:hover {
          text-decoration: underline;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🚀 GUID Gatherer Backend</h1>
        <p class="status">✅ Server is running successfully!</p>
        <p>Port: ${PORT}</p>
        <div class="links">
          <a href="/api/health">Health Check</a>
          <a href="/api/auth">Auth API</a>
          <a href="/api/contractors">Contractors API</a>
          <a href="/api/suppliers">Suppliers API</a>
        </div>
      </div>
    </body>
    </html>
  `);
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'Server is running!',
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('✅ MongoDB connected');
  // Start server only after DB connection
  if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
      console.log(`✅ Server is running on port ${PORT}`);
    });
  }
})
.catch((error) => {
  console.error('❌ MongoDB connection failed:', error.message);
});

// Vercel এর জন্য export (must have)
module.exports = app;