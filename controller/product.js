// controllers/productController.js

import Product from "../models/Product.js";

// Create a New Product
export const createProduct = async (title, price, description, category, image, ratingRate, ratingCount) => {
  try {
    const product = await Product.create({
      title,
      price,
      description,
      category,
      image,
      ratingRate,
      ratingCount,
    });

    console.log("New product created:", product);
    return product;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

// Get a List of All Products
export const getAllProducts = async () => {
  try {
    const products = await Product.findAll();
    console.log(`${products.length} products found.`);
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

// Get a Single Product by ID
export const getProductById = async (productId) => {
  try {
    const product = await Product.findByPk(productId);

    if (!product) {
      console.log("Product not found.");
      return null;
    }

    console.log("Product details:", product);
    return product;
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    return null;
  }
};

// Update a Product
export const updateProduct = async (productId, updateData) => {
  try {
    const product = await Product.findByPk(productId);

    if (!product) {
      console.log("Product not found.");
      return null;
    }

    await product.update(updateData);
    console.log("Product updated:", product);
    return product;
  } catch (error) {
    console.error("Error updating product:", error);
    return null;
  }
};

// Delete a Product
export const deleteProduct = async (productId) => {
  try {
    const product = await Product.findByPk(productId);

    if (!product) {
      console.log("Product not found.");
      return;
    }

    await product.destroy();
    console.log("Product deleted:", product);
  } catch (error) {
    console.error("Error deleting product:", error);
  }
};
