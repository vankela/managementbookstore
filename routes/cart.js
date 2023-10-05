// Import necessary dependencies
const express = require('express');
const router = express.Router();
const cartController = require('../controller/cartController');
const auth=require('../middleware/auth')
// Define routes for the cart
router.get('/',auth, cartController.viewCart);
router.post('/add/:bookId',auth,cartController.addToCart);
router.post('/update/:itemId',auth, cartController.updateCartItem);
router.post('/remove/:itemId',auth, cartController.removeFromCart);

module.exports = router;

