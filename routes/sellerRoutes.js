import express from 'express';
import { 
  createOrFetchSeller, 
  viewProducts, 
  addProduct, 
  updateProduct, 
  deleteProduct, 
  viewSellerOrders, 
  viewOrderDetails 
} from '../controller/seller.js';
import {protectedRoute} from '../middleware/protectedRoute.js';  // Protected route middleware

const router = express.Router();

// Route to Create or Fetch a Seller
// Protected route, only authenticated users can access this
router.post('/create-or-fetch', protectedRoute, async (req, res) => {
  const { userId } = req.body;  // Assume userId is passed in the request body

  try {
    const seller = await createOrFetchSeller(userId);
    return res.status(200).json({
      message: 'Seller fetched or created successfully.',
      seller,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error creating or fetching seller', error: error.message });
  }
});

// Route to View All Products for a Seller
// Protected route, only authenticated sellers can access this
router.get('/:sellerId/products', protectedRoute, async (req, res) => {
  const { sellerId } = req.params;

  try {
    const products = await viewProducts(sellerId);
    return res.status(200).json({
      message: 'Products fetched successfully.',
      products,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
});

// Route to Add a New Product for Seller
// Protected route, only authenticated sellers can access this
router.post('/:sellerId/products', protectedRoute, async (req, res) => {
  const { sellerId } = req.params;
  const productData = req.body; // Assuming product data comes in the request body

  try {
    const newProduct = await addProduct(sellerId, productData);
    return res.status(201).json({
      message: 'Product added successfully.',
      product: newProduct,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error adding product', error: error.message });
  }
});

// Route to Update Product Details for Seller
// Protected route, only authenticated sellers can access this
router.put('/:sellerId/products/:productId', protectedRoute, async (req, res) => {
  const { sellerId, productId } = req.params;
  const updatedData = req.body; // Assuming updated product data comes in the request body

  try {
    const updatedProduct = await updateProduct(sellerId, productId, updatedData);
    return res.status(200).json({
      message: 'Product updated successfully.',
      product: updatedProduct,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error updating product', error: error.message });
  }
});

// Route to Delete a Product for Seller
// Protected route, only authenticated sellers can access this
router.delete('/:sellerId/products/:productId', protectedRoute, async (req, res) => {
  const { sellerId, productId } = req.params;

  try {
    await deleteProduct(sellerId, productId);
    return res.status(200).json({
      message: 'Product deleted successfully.',
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
});

// Route to View All Orders for a Seller
// Protected route, only authenticated sellers can access this
router.get('/:sellerId/orders', protectedRoute, async (req, res) => {
  const { sellerId } = req.params;

  try {
    const orders = await viewSellerOrders(sellerId);
    return res.status(200).json({
      message: 'Orders fetched successfully.',
      orders,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
});

// Route to View Specific Order Details for Seller
// Protected route, only authenticated sellers can access this
router.get('/:sellerId/orders/:orderId', protectedRoute, async (req, res) => {
  const { sellerId, orderId } = req.params;

  try {
    const order = await viewOrderDetails(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    return res.status(200).json({
      message: 'Order details fetched successfully.',
      order,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching order details', error: error.message });
  }
});

export default router;
