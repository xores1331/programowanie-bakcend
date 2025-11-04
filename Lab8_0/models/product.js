const fs = require('fs');
const path = require('path');

const fullName = path.join(
    path.dirname(require.main.filename), "data", "products.json"
);

const readProductsFromFile = (cb) => {
    fs.readFile(fullName, "utf8", (err, contents) => {
        if (err) {
            console.log(err);
            cb([]);
        } else {
            if (contents.length === 0) return cb([]);
            cb(JSON.parse(contents));
        }
    });
};

const storeProductsInFile = (prods) => {
    fs.writeFile(fullName, JSON.stringify(prods), (err) => {
        if (err) console.log(err);
    });
};

module.exports = class Product {
    constructor(n, d, p, i) {
        this.name = n;
        this.desc = d;
        this.price = Number(p);
        this.id = Number(i);
        this.time = new Date().toISOString();
    }

    save() {
        readProductsFromFile((products) => {
            products.push(this);
            storeProductsInFile(products);
        });
    }

    static getAllProducts(cb) {
        readProductsFromFile(cb);
    }

    static getSingleProduct(id, cb) {
        readProductsFromFile((products) => {
            let found = undefined;
            if (products) found = products.find((elem) => elem.id === id);
            cb(found);
        });
    }

}