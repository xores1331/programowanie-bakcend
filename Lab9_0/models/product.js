const path = require('path');
const fs = require('fs').promises;



const fullName = path.join(
    path.dirname(require.main.filename), "data", "products.json"
);



const readProductsFromFile = async () => {
    try {
        const contents = await fs.readFile(fullName, "utf8");
        if (contents.length === 0) return [];
        return JSON.parse(contents);
    } catch (err) {
        console.log(err);
        return [];
    }
};



const storeProductsInFile = async (prods) => {
    try {
        await fs.writeFile(fullName, JSON.stringify(prods));
    } catch (err) {
        console.log(err);
    }
};



module.exports = class Product {
    constructor(n, d, p, i) {
        this.name = n;
        this.desc = d;
        this.price = Number(p);
        this.id = Number(i);
        this.time = new Date().toISOString();
    }



    async save() {
        const products = await readProductsFromFile();
        products.push(this);
        await storeProductsInFile(products);
    }



    static async getAllProducts() {
        return await readProductsFromFile();
    }



    static async getSingleProduct(id) {
        const products = await readProductsFromFile();
        let found = undefined;
        if (products) found = products.find((elem) => elem.id === id);
        return found;
    }



    static async updateSingleProd(pp) {
        const pid = pp.id;
        const products = await readProductsFromFile();
        let found = undefined;
        if (products) found = products.find((elem) => elem.id === pid);
        if (found) {
            Object.assign(found, pp);
            await storeProductsInFile(products);
        }
        return found;
    }

    static async deleteProduct(id) {
        const products = await readProductsFromFile();
        const productIndex = products.findIndex((elem) => elem.id === id);

        if (productIndex === -1) {
            return null;
        }

        const deletedProduct = products[productIndex];
        products.splice(productIndex, 1);
        await storeProductsInFile(products);

        return deletedProduct;
    }

};
