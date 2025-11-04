const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
    Product.getAllProducts((products) => {
        if (!products || products.length === 0) {
            res.status(404).json({ message: `No products found` });
        } else {
            res.status(200).json(products);
        }
    });
};

exports.addProduct = (req, res, next) => {
    const name = req.body.name;
    const desc = req.body.desc;
    const price = Number(req.body.price);
    const id = Number(req.body.id);
    Product.getSingleProduct(id, (prod) => {
        if (!prod) {
            const newp = new Product(name, desc, price, id);
            newp.save();
            res.status(201).json({
                message: `Product with id=${newp.id} added!`,
                product: {
                    id: newp.id, name: newp.name, desc: newp.desc,
                    price: newp.price, time: newp.time
                }
            });
        } else {
            res.status(409).json({
                message: `Product with id=${id} already exists`
            });
        }
    });
};
