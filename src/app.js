const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const productRoutes = require('./routes/productRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Endpoint kiểm tra sức khỏe hệ thống (Healthcheck)
app.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'UP' : 'DOWN';
  if (dbStatus === 'UP') {
    return res.status(200).json({ status: 'UP', database: dbStatus, timestamp: new Date() });
  }
  return res.status(503).json({ status: 'DOWN', database: dbStatus, timestamp: new Date() });
});

app.use('/api/products', productRoutes);

module.exports = app;