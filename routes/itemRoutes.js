import express from 'express';
import { protectedRoute } from '../middleware/protectedRoute.js';  // Adjust to your actual file path
import { 
  addItem, 
  viewItems, 
  removeItem, 
  updateItemQuantity 
} from '../controller/item.js';

const router = express.Router();

// Route to add an item to a parent (cart, order, wishlist)
router.post('/item/add', protectedRoute, async (req, res) => {
  try {
    const { parentId, parentType, productId, quantity } = req.body;

    // Validate parentType before proceeding
    if (!['cart', 'order', 'wishlist'].includes(parentType)) {
      return res.status(400).json({ error: "Invalid parent type. Must be 'cart', 'order', or 'wishlist'." });
    }

    const buyerId = req.user.id;  // Get the authenticated user's ID
    await addItem(parentId, parentType, productId, quantity);
    res.status(200).json({ message: `Item added to ${parentType}` });
  } catch (error) {
    res.status(500).json({ error: 'Error adding item.' });
  }
});

// Route to view items in a parent (cart, order, wishlist)
router.get('/items', protectedRoute, async (req, res) => {
  try {
    const { parentId, parentType } = req.query;

    // Validate parentType before proceeding
    if (!['cart', 'order', 'wishlist'].includes(parentType)) {
      return res.status(400).json({ error: "Invalid parent type. Must be 'cart', 'order', or 'wishlist'." });
    }

    const items = await viewItems(parentId, parentType);
    if (items.length === 0) {
      return res.status(404).json({ message: `No items found in the ${parentType}.` });
    }

    res.status(200).json(items);  // Return the list of items in the parent (cart, order, wishlist)
  } catch (error) {
    res.status(500).json({ error: 'Error fetching items.' });
  }
});

// Route to remove an item from a parent (cart, order, wishlist)
router.delete('/item/remove', protectedRoute, async (req, res) => {
  try {
    const { parentId, parentType, productId } = req.body;

    // Validate parentType before proceeding
    if (!['cart', 'order', 'wishlist'].includes(parentType)) {
      return res.status(400).json({ error: "Invalid parent type. Must be 'cart', 'order', or 'wishlist'." });
    }

    await removeItem(parentId, parentType, productId);
    res.status(200).json({ message: `Item removed from ${parentType}` });
  } catch (error) {
    res.status(500).json({ error: 'Error removing item.' });
  }
});

// Route to update the quantity of an item in a parent (cart, order, wishlist)
router.put('/item/update', protectedRoute, async (req, res) => {
  try {
    const { parentId, parentType, productId, quantity } = req.body;

    // Validate parentType before proceeding
    if (!['cart', 'order', 'wishlist'].includes(parentType)) {
      return res.status(400).json({ error: "Invalid parent type. Must be 'cart', 'order', or 'wishlist'." });
    }

    if (quantity < 1) {
      return res.status(400).json({ error: 'Quantity must be at least 1.' });
    }

    await updateItemQuantity(parentId, parentType, productId, quantity);
    res.status(200).json({ message: `Item quantity updated in ${parentType}` });
  } catch (error) {
    res.status(500).json({ error: 'Error updating item quantity.' });
  }
});

export default router;
