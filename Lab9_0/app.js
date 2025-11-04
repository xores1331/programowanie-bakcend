const express = require('express');
const mongoose = require("mongoose");

const app = express();
const productRoutes = require('./routes/product');

const MONGODB_URI = 'mongodb://127.0.0.1:27017/pb_2025_14K2_Sosin';
mongoose.set("strictQuery", false);

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/product', productRoutes);

(async () => {
  try {
    await mongoose.connect(MONGODB_URI, {});
    app.listen(44444, () => {
      console.log('Server running on port 44444');
    });
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
})();
