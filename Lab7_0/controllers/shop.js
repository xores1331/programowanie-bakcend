const fs = require("fs");
const path = require("path");

const User = require('../models/user');
const Product = require("../models/product");
const Order = require("../models/order");
const courseConfig = require("../course.json");
const PDFDoc = require("pdfkit");

const ITEMS_PER_PAGE = 3;

exports.getIndex = (req, res, next) => {
  res.render("shop/index", {
    pageTitle: "Market",
    path: "/",
    studyLevel: courseConfig.studyLevel,
    classesName: courseConfig.classesName,
  });
};

exports.getProducts = async (req, res, next) => {
  try {
    const page = +req.query.page || 1;
    const totalItems = await Product.find().countDocuments();
    const products = await Product.find()
      .skip((page - 1) * ITEMS_PER_PAGE)
      .limit(ITEMS_PER_PAGE);
    
    res.render("shop/product-list", {
      prods: products,
      pageTitle: "Products",
      path: "/products",
      currentPage: page,
      hasNextPage: ITEMS_PER_PAGE * page < totalItems,
      hasPreviousPage: page > 1,
      nextPage: page + 1,
      previousPage: page - 1,
      lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
    });
  } catch(err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};


exports.getProduct = async (req, res, next) => {
  const prodId = req.params.productId;
  try{
    const product = await Product.findById(prodId);
    if(!product){
      throw new Error("Product does not exist.");
    }
    res.render("shop/product-detail", {
      product: product,
      pageTitle: product.title,
      path: "/products",
    });
  }catch(err){
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.getCart = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.session.user._id });
    const producer = await user.populate("cart.items.productId");
    const products = producer.cart.items;
    res.render("shop/cart", {
      path: "/cart",
      pageTitle: "Your Cart",
      products: products,
    });
  } catch(err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.postCart = async (req, res, next) => {
  const prodId = req.body.productId;
  try {
    const product = await Product.findById(prodId);
    if (!product) { throw new Error("Product not found."); } 
    const user = await User.findOne({ _id: req.session.user._id });
    await user.addToCart(product);
    res.redirect("/cart");
  } catch(err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.postCartDeleteProduct = async (req, res, next) => {
  const prodId = req.body.productId;
  try {
    const user = await User.findOne({ _id: req.session.user._id });
    await user.removeFromCart(prodId);
    res.redirect("/cart");
  } catch(err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.getOrders = (req, res, next) => {
  Order.find({ "user.userId": req.session.user._id })
    .then((orders) => {
      res.render("shop/orders",
        { path: "/orders", pageTitle: "Orders", orders: orders });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postOrder = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: req.session.user._id });
    const produser = await user.populate("cart.items.productId");
    const products = produser.cart.items.map((i) => {
      return { quantity: i.quantity, product: { ...i.productId._doc } };
    });
    const order = new Order({
      user: { email: user.email, userId: user._id, },
      products: products,
    });
    await order.save();
    await user.clearCart();
    res.redirect("/orders");
  } catch(err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};

exports.getInvoice = async (req, res, next) => {
  const orderId = req.params.orderId;
  try {
    const order = await Order.findById(orderId);
    if (!order) { throw new Error("Order does not exist."); }
    
    const invoiceName = "invoice-" + orderId + ".pdf";
    const invoicePath = path.join("data", "invoices", invoiceName);
    
    const pdfDoc = new PDFDoc();
    
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'inline; filename="' + invoiceName + '"');
    
    pdfDoc.pipe(fs.createWriteStream(invoicePath));
    pdfDoc.pipe(res);
    
    const logoPath = path.join(__dirname, '..', 'public', 'img', 'wm.png');
    pdfDoc.image(logoPath, 50, 45, { width: 60 });
    
    pdfDoc
      .fontSize(26)
      .text("FAKTURA", 130, 50);
    
    pdfDoc
      .fontSize(10)
      .text("Numer: " + orderId, 50, 110)
      .text("Data: " + new Date().toLocaleDateString("pl-PL"), 50, 125)
      .text("Email: " + order.user.email, 50, 140);
    
    pdfDoc.moveDown(2);
    
    pdfDoc
      .fontSize(12)
      .text("Produkt", 50, 190, { continued: true })
      .text("Ilosc", 250, 190, { continued: true })
      .text("Cena", 350, 190, { continued: true })
      .text("Suma", 450, 190);
    
    pdfDoc.moveDown();
    
    let yPos = 220;
    let totalPrice = 0;
    
    pdfDoc.fontSize(10);
    order.products.forEach((prod) => {
      const itemTotal = prod.quantity * prod.product.price;
      totalPrice += itemTotal;
      
      pdfDoc.text(prod.product.title, 50, yPos, { width: 180, continued: true });
      pdfDoc.text(prod.quantity.toString(), 250, yPos, { continued: true });
      pdfDoc.text(prod.product.price.toFixed(2) + " zl", 350, yPos, { continued: true });
      pdfDoc.text(itemTotal.toFixed(2) + " zl", 450, yPos);
      
      yPos += 25;
    });
    
    pdfDoc
      .moveDown()
      .fontSize(16)
      .text("RAZEM: " + totalPrice.toFixed(2) + " zl", 350, yPos + 20);
    
    pdfDoc.end();
    
  } catch(err) {
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
  }
};


