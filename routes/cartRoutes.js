import express from 'express';
import { protectedRoute } from '../middleware/protectedRoute.js';  // Adjust if necessary
import { 
  createOrFetchCart, 
  viewCart, 
  addToCart, 
  removeFromCart, 
  clearCart 
} from '../controller/cart.js';

const router = express.Router();

// Route to create or fetch a cart for a buyer
router.post('/cart', protectedRoute, async (req, res) => {
  try {
    const buyerId = req.user.id;  // Get the buyerId from the authenticated user
    const cart = await createOrFetchCart(buyerId);
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching the cart' });
  }
});

// Route to view the cart for a buyer
router.get('/cart', protectedRoute, async (req, res) => {
  try {
    const buyerId = req.user.id;  // Get the buyerId from the authenticated user
    const cart = await viewCart(buyerId);
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }
    res.status(200).json(cart);  // Return the list of items in the cart
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while viewing the cart' });
  }
});

// Route to add a product to the cart
router.post('/cart/add', protectedRoute, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const buyerId = req.user.id;  // Get the buyerId from the authenticated user
    await addToCart(buyerId, productId, quantity);
    res.status(200).json({ message: 'Product added to the cart' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while adding product to cart' });
  }
});

// Route to remove a product from the cart
router.delete('/cart/remove', protectedRoute, async (req, res) => {
  try {
    const { productId } = req.body;
    const buyerId = req.user.id;  // Get the buyerId from the authenticated user
    await removeFromCart(buyerId, productId);
    res.status(200).json({ message: 'Product removed from the cart' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while removing product from cart' });
  }
});

// Route to clear the entire cart
router.delete('/cart/clear', protectedRoute, async (req, res) => {
  try {
    const buyerId = req.user.id;  // Get the buyerId from the authenticated user
    await clearCart(buyerId);
    res.status(200).json({ message: 'Cart cleared successfully' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while clearing the cart' });
  }
});

export default router;
