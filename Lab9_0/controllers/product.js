const Product = require('../models/product');


exports.getProducts = async (req, res, next) => {
    try {
        const products = await Product.getAllProducts();
        if (!products || products.length === 0) {
            res.status(404).json({ message: `No products found` });
        } else {
            res.status(200).json(products);
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.addProduct = async (req, res, next) => {
    try {
        const name = req.body.name;
        const desc = req.body.desc;
        const price = Number(req.body.price);
        const id = Number(req.body.id);

        const prod = await Product.getSingleProduct(id);
        if (!prod) {
            const newp = new Product(name, desc, price, id);
            await newp.save();
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
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.updateSingleProduct = async (req, res, next) => {
    try {
        const id = Number(req.params.productId);
        const prod = await Product.getSingleProduct(id);

        if (prod) {
            if (req.body.name) prod.name = req.body.name;
            if (req.body.desc) prod.desc = req.body.desc;
            if (req.body.price) prod.price = Number(req.body.price);

            const pnew = await Product.updateSingleProd(prod);
            res.status(200).json({
                message: `Product with id=${pnew.id} updated!`,
                product: {
                    id: pnew.id, name: pnew.name, desc: pnew.desc,
                    price: pnew.price, time: pnew.time
                }
            });
        } else {
            res.status(404).json({ message: `Product id=${id} not found` });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getSingleProduct = async (req, res, next) => {
    try {
        const id = Number(req.params.productId);
        const prod = await Product.getSingleProduct(id);

        if (prod) {
            res.status(200).json(prod);
        } else {
            res.status(404).json({ message: `Product with id=${id} not found` });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.deleteProduct = async (req, res, next) => {
    try {
        const id = Number(req.params.productId);
        const deletedProduct = await Product.deleteProduct(id);

        if (deletedProduct) {
            res.status(200).json({
                message: `Product with id=${id} deleted!`,
                product: deletedProduct
            });
        } else {
            res.status(404).json({ message: `Product with id=${id} not found` });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
