const products = [];

module.exports = class Product{
    constructor(t){
        this.title = t;
    }
    save(){
        this.price = Math.floor(Math.random() * 90) + 10;
        this.desc = 'A very nice ' + this.title;
        products.push(this);
    }
    static fetchAll(){
        return products;
    }
}
