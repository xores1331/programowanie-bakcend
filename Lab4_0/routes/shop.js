const path = require('path');
const express = require('express');

const router = express.Router();

const productController = require('../controllers/products.js');

//  /  => GET
router.get('/', productController.getProducts);

module.exports = router;
