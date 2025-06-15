const express = require('express');
const router = express.Router();
const getAllProducts = require('../utils/getAllProducts.js');

// Utility to calculate total item count in the cart
function getCartItemCount(cart) {
  return Object.values(cart || {}).reduce((total, qty) => total + qty, 0);
}

// GET /cart - Render the cart page with current cart items
router.get('/', (req, res) => {
  const cart = req.session.cart || {};
  const allProducts = getAllProducts();

  const cartItems = Object.entries(cart)
    .map(([name, quantity]) => {
      const product = allProducts.find(p => p.name === name);
      return product ? { ...product, quantity } : null;
    })
    .filter(Boolean);

  const cartItemCount = getCartItemCount(cart);

  res.render('cart', {
    cartItems,
    selectedCategory: { name: 'Košarica' },
    cartItemCount
  });
});

// POST /cart/add/:name - Add one quantity of a product, respond with updated cart info (JSON)
router.post('/add/:name', (req, res) => {
  const name = decodeURIComponent(req.params.name);

  if (!req.session.cart) req.session.cart = {};
  if (!req.session.cart[name]) req.session.cart[name] = 0;
  req.session.cart[name]++;

  const cart = req.session.cart;
  const cartItemCount = getCartItemCount(cart);

  res.json({ cart, cartItemCount });
});

// POST /cart/remove/:name - Remove one quantity of a product, respond with updated cart info (JSON)
router.post('/remove/:name', (req, res) => {
  const name = decodeURIComponent(req.params.name);

  if (req.session.cart && req.session.cart[name]) {
    req.session.cart[name]--;
    if (req.session.cart[name] <= 0) {
      delete req.session.cart[name];
    }
  }

  const cart = req.session.cart || {};
  const cartItemCount = getCartItemCount(cart);

  res.json({ cart, cartItemCount });
});

// GET /cart/count - Return total quantity in cart (for header bubble)
router.get('/count', (req, res) => {
  const cart = req.session.cart || {};
  const count = getCartItemCount(cart);
  res.json({ count });
});

// GET /cart/data - Return full cart data (products + quantities)
router.get('/data', (req, res) => {
  const cart = req.session.cart || {};
  res.json({ cart });
});

module.exports = router;
