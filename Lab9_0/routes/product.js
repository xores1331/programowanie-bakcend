const express = require('express');
const productController = require('../controllers/product');


const router = express.Router();


router.get('/products', productController.getProducts);
router.post('/add', productController.addProduct);
router.put('/products/:productId', productController.updateSingleProduct);
router.get('/products/:productId', productController.getSingleProduct);
router.delete('/products/:productId', productController.deleteProduct);


module.exports = router;
