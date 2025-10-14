const Product = require('../models/product');


exports.getAddProduct = (req, res, next) => {
    res.render('add-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        formsCSS: true,
        productCSS: true,
        activeAddProduct: true
    });
}

exports.postAddProduct = async (req, res, next) => {
    const product = new Product(req.body.title);
    await product.save();
    res.redirect("/");
};

exports.getProducts = async (req, res, next) => {
    const products = await Product.fetchAll();
    res.render('shop', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
        hasProducts: products.length > 0,
        activeShop: true, productCSS: true
    });
};

