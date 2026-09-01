const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const settingsRoutes = require('./routes/settings');
const categoryRoutes = require('./routes/categories');
const projectRoutes = require('./routes/projects');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for development
app.use(cors());

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve product uploads statically
const uploadsDir = path.join(__dirname, 'uploads');
app.use('/uploads', express.static(uploadsDir));

// API Routes mounting
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/projects', projectRoutes);

// Fallback error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: err.message || 'An unexpected error occurred on the server' 
  });
});

app.listen(PORT, () => {
  console.log(`==========================================`);
  console.log(`Banking Automation B2B Server Started!`);
  console.log(`Live at: http://localhost:${PORT}`);
  console.log(`Image uploads folder: ${uploadsDir}`);
  console.log(`==========================================`);
});
