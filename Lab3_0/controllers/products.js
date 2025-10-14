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
    const title = req.body.title;
    const desc = req.body.desc;
    const price = req.body.price;
    const image = req.file;
    if(!image){
        return res.status(422).render("add-product", {
            pageTitle: "Add Product", path: "/admin/add-product",
            formsCSS: true, productCSS: true,
            activeAddProduct: true
        });
    }
    const imageUrl = image.path;
    const product = new Product(title, desc, price, imageUrl);
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

