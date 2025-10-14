const path = require('path');
const express = require('express');
const router = express.Router();
const adminData = require('./admin');

router.get('/', (req, res, next) => {
  console.log('Data from admin.js', adminData.products);
  res.sendFile(path.join(path.dirname(require.main.filename), 
  'views', 'shop.html'));
});

module.exports = router;
