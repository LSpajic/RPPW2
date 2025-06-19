const express = require('express');
const session = require('express-session');
const path = require('path');
const os = require('os');
const app = express();
// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'tajna',
    resave: false,
    saveUninitialized: true
}));
app.use((req, res, next) => {
  const cart = req.session.cart || {};
  const cartItemCount = Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);
  res.locals.cartItemCount = cartItemCount;
  next();
});

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
const homeRoutes = require('./routes/home.routes');
const cartRoutes = require('./routes/cart.routes');

app.use('/', homeRoutes);
app.use('/cart', cartRoutes);
app.use('/home', homeRoutes); // for /home/getCategories etc.

// Get local IP address
function getLocalIpAddress() {
  const interfaces = os.networkInterfaces();
  for (const interfaceName in interfaces) {
    const interface = interfaces[interfaceName];
    for (const iface of interface) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

// Start server
const port = 3000;
const localIp = getLocalIpAddress();

// LAN version (default)
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on:`);
  console.log(`- Local: http://localhost:${port}`);
  console.log(`- Network: http://${localIp}:${port}`);
});

// Localhost version (commented out)
/*
app.listen(port, '127.0.0.1', () => {
  console.log(`Server running on http://localhost:${port}`);
});
*/