// utils/getAllProducts.js
const data = require('../data/mydata');

function getAllProducts() {
  return data.categories.flatMap(category =>
    category.products.map(product => ({
      ...product,
      category: category.name
    }))
  );
}

module.exports = getAllProducts;
