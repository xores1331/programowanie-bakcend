const express = require('express');
const { check, body } = require('express-validator');

const adminController = require('../controllers/admin');

const router = express.Router();

router.get('/products', adminController.checkIsLogged, adminController.getProducts);

router.get('/add-product', adminController.checkIsLogged, adminController.getAddProduct );

router.post('/add-product',
  [
    body('title', 'Title must be at least 3 characters long.')
      .isLength({ min: 3 })
      .isString()
      .trim(),
    body('price', 'Price must be a numeric value.')
      .isNumeric(),
    body('description', 'Description must be between 5 and 400 characters.')
      .isLength({ min: 5, max: 400 })
      .trim()
  ],
  adminController.checkIsLogged, adminController.postAddProduct
);

router.get('/edit-product/:productId', adminController.checkIsLogged, adminController.getEditProduct);

router.post('/edit-product',
  [
    body('title', 'Title must be at least 3 characters long.')
      .isLength({ min: 3 })
      .isString()
      .trim(),
    body('price', 'Price must be a numeric value.')
      .isNumeric(),
    body('description', 'Description must be between 5 and 400 characters.')
      .isLength({ min: 5, max: 400 })
      .trim()
  ],
  adminController.checkIsLogged, adminController.postEditProduct
);

    
router.delete('/product/:productId', adminController.checkIsLogged, adminController.deleteProduct);

module.exports = router;
