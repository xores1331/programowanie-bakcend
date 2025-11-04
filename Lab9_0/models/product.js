const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  desc: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  id: {
    type: Number,
    required: true,
    unique: true
  },
  time: {
    type: String,
    default: () => new Date().toISOString()
  }
});

module.exports = mongoose.model('Product', productSchema);
