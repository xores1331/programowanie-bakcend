const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render("add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true,
  });
};

exports.postAddProduct = async (req, res, next) => {
  const title = req.body.title;
  const price = req.body.price;
  const desc = req.body.description;
  const image = req.file;
  if(!image){
    return res.status(422).render("add-product", {
      pageTitle: "Add Product", path: "/admin/add-product",
      formsCSS: true, productCSS: true,
      activeAddProduct: true
    });
  }
  const imageUrl = image.path;
  try {
    const product = new Product({
      title: title,
      price: price,
      desc: desc,
      image: imageUrl
    });
    await product.save();
    const err = await req.session.save();
    if (err) throw new Error('Error, session could not be saved!');
    res.redirect("/");
  } catch(err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.find();
    res.render('shop', {
      prods: products,
      pageTitle: 'Shop',
      path: '/',
      hasProducts: products.length > 0,
      activeShop: true,
      productCSS: true
    });
  } catch(err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};
