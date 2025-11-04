const express = require('express');
const productController = require('../controllers/product');

const router = express.Router();

router.get('/products', productController.getProducts);
router.post('/add', productController.addProduct);

module.exports = router;
