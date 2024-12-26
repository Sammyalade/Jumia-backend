import express from 'express';
import { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct } from '../controller/product.js';
import {protectedRoute} from '../middleware/protectedRoute.js';  // Protected route middleware

const router = express.Router();

// Route to Create a New Product
// Only accessible to authenticated users (admin, for example)
router.post('/create', protectedRoute, async (req, res) => {
  const { title, price, description, category, image, ratingRate, ratingCount } = req.body;

  try {
    const newProduct = await createProduct(title, price, description, category, image, ratingRate, ratingCount);
    return res.status(201).json({
      message: 'Product created successfully.',
      product: newProduct,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error creating product', error: error.message });
  }
});

// Route to Get a List of All Products
router.get('/', async (req, res) => {
  try {
    const products = await getAllProducts();
    return res.status(200).json(products);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
});

// Route to Get a Single Product by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const product = await getProductById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    return res.status(200).json(product);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching product', error: error.message });
  }
});

// Route to Update an Existing Product
// Only accessible to authenticated users (admin)
router.put('/:id/update', protectedRoute, async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  try {
    const updatedProduct = await updateProduct(id, updateData);
    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    return res.status(200).json({
      message: 'Product updated successfully.',
      product: updatedProduct,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error updating product', error: error.message });
  }
});

// Route to Delete a Product
// Only accessible to authenticated users (admin)
router.delete('/:id/delete', protectedRoute, async (req, res) => {
  const { id } = req.params;

  try {
    await deleteProduct(id);
    return res.status(200).json({ message: 'Product deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
});

export default router;
