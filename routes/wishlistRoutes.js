import express from 'express';
import { addToWishlist, removeFromWishlist } from '../controller/wishlist.js';
import {protectedRoute} from '../middleware/protectedRoute.js';  // Protected route middleware

const router = express.Router();

// Route to Add Product to Wishlist
// Protected route, only authenticated users (buyers) can access this
router.post('/add', protectedRoute, async (req, res) => {
  const { productId } = req.body;
  const { buyerId } = req.user;  // Assuming buyerId is attached to the req.user object after authentication

  try {
    await addToWishlist(buyerId, productId);
    return res.status(200).json({ message: 'Product added to wishlist successfully.' });
  } catch (error) {
    return res.status(500).json({ message: 'Error adding product to wishlist', error: error.message });
  }
});

// Route to Remove Product from Wishlist
// Protected route, only authenticated users (buyers) can access this
router.delete('/remove', protectedRoute, async (req, res) => {
  const { productId } = req.body;
  const { buyerId } = req.user;  // Assuming buyerId is attached to the req.user object after authentication

  try {
    await removeFromWishlist(buyerId, productId);
    return res.status(200).json({ message: 'Product removed from wishlist successfully.' });
  } catch (error) {
    return res.status(500).json({ message: 'Error removing product from wishlist', error: error.message });
  }
});

export default router;
