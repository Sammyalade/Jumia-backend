import express from 'express';
import { protectedRoute } from '../middleware/protectedRoute.js';
import { addToCart, viewCart, removeFromCart, clearCart } from '../controller/cart.js';  // Example controllers

const router = express.Router();

// Protected routes
router.post('/cart', protectedRoute, addToCart);
router.get('/cart', protectedRoute, viewCart);
router.delete('/cart/:productId', protectedRoute, removeFromCart);
router.delete('/cart', protectedRoute, clearCart);

export default router;
