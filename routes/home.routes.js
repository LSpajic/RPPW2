const express = require('express');
const router = express.Router();
const data = require('../data/mydata.js');

// Helper: flatten all products with category attached (optional, you might not need this)
const allProducts = data.categories.flatMap(category =>
  category.products.map(product => ({
    ...product,
    category: category.name,
  }))
);

function getCartItemCount(cart) {
  return Object.values(cart || {}).reduce((total, qty) => total + qty, 0);
}

// GET /home - Render home page with default category (first category)
router.get('/', (req, res) => {
  const defaultCategory = data.categories[0];
  const cartItemCount = getCartItemCount(req.session.cart);
  const cart = req.session.cart || {};
  res.render('home', {
    data,
    categories: data.categories,
    selectedCategory: defaultCategory,
    cartItemCount,
    cart  // <-- pass cart here too
  });
});

// GET /home/category/:category - Render home page with selected category products
router.get('/category/:category', (req, res) => {
  const categoryName = decodeURIComponent(req.params.category);
  const selectedCategory = data.categories.find(c => c.name === categoryName);

  if (!selectedCategory) {
    return res.status(404).send('Category not found');
  }

  const cartItemCount = getCartItemCount(req.session.cart);
  const cart = req.session.cart || {};  // <-- add this to pass cart

  res.render('home', {
    data,
    categories: data.categories,
    selectedCategory,
    cartItemCount,
    cart  // <-- pass cart here as well
  });
});

// GET /home/getCategories - API to get category names (JSON)
router.get('/getCategories', (req, res) => {
  const categories = data.categories.map(c => c.name);
  res.json(categories);
});

router.get('/getProducts/:category', (req, res) => {
  const categoryName = decodeURIComponent(req.params.category);
  const category = data.categories.find(c => c.name === categoryName);

  if (!category) {
    return res.status(404).json({ error: 'Category not found' });
  }

  // Return only products with category name added
  const products = category.products.map(product => ({
    ...product,
    category: category.name
  }));

  res.json(products);
});

module.exports = router;
