const path = require('path');
const fs = require('fs').promises;

const products = [];

const fullName = path.join(
    path.dirname(require.main.filename), "data", "products.json");

const getProductsFromFile = async () => {
    try{
        const contents = await fs.readFile(fullName, 'utf8');
        if(contents.length===0){ return []; }else{ return JSON.parse(contents); }
    }catch(error){
        //console.log(error);
        return [];
    }
};

module.exports = class Product{
constructor(t) {
    this.title = t;
    this.price = Math.floor(Math.random() * 90) + 10;
    this.desc = 'A very nice ' + this.title;
}

async save() {
    products.length = 0;
    try{
        const prods = await getProductsFromFile();
        products.push(...prods);
        products.push(this);
        await fs.writeFile(fullName, JSON.stringify(products));
    }catch(error){
        console.log(error);
    }
}

static async fetchAll() {
    products.length = 0;
    const prods = await getProductsFromFile();
    products.push(...prods);
    return products;
}
};
