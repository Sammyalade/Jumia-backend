import Seller from "../models/seller.js";
import Product from "../models/product.js";
import Order from "../models/order.js";

// Create or Fetch a Seller
export const createOrFetchSeller = async (userId) => {
  try {
    // Try to find or create a seller based on userId
    const [seller, created] = await Seller.findOrCreate({
      where: { userId },
      include: [
        {
          model: Product,
          as: "products", // Include associated products
        },
        {
          model: Order,
          as: "orders", // Include associated orders
        },
      ],
    });

    if (created) {
      console.log(`New seller created for userId: ${userId}`);
    }

    return seller;
  } catch (error) {
    console.error("Error creating/fetching seller:", error);
    throw error;
  }
};

// View All Products for a Seller
export const viewProducts = async (sellerId) => {
  try {
    // Retrieve all products associated with the seller
    const products = await Product.findAll({
      where: { sellerId },
      include: ["seller"], // Include seller info if needed
    });

    if (products.length === 0) {
      console.log("No products found for the seller.");
      return [];
    }

    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

// Add a New Product for Seller
export const addProduct = async (sellerId, productData) => {
  try {
    // Find the seller by ID
    const seller = await Seller.findOne({ where: { id: sellerId } });

    if (!seller) {
      console.log("Seller not found.");
      throw new Error("Seller not found");
    }

    // Create a new product associated with the seller
    const newProduct = await Product.create({
      ...productData,
      sellerId,
    });

    console.log("Product added:", newProduct);
    return newProduct;
  } catch (error) {
    console.error("Error adding product:", error);
    throw error;
  }
};

// Update Product Details for Seller
export const updateProduct = async (sellerId, productId, updatedData) => {
  try {
    // Find the product by its ID and ensure it's associated with the seller
    const product = await Product.findOne({
      where: { id: productId, sellerId },
    });

    if (!product) {
      console.log("Product not found.");
      throw new Error("Product not found");
    }

    // Update the product with the new data
    await product.update(updatedData);
    console.log("Product updated:", product);
    return product;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

// Delete a Product for Seller
export const deleteProduct = async (sellerId, productId) => {
  try {
    // Find the product by its ID and ensure it's associated with the seller
    const product = await Product.findOne({
      where: { id: productId, sellerId },
    });

    if (!product) {
      console.log("Product not found.");
      throw new Error("Product not found");
    }

    // Delete the product
    await product.destroy();
    console.log("Product deleted.");
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};

// View All Orders for a Seller
export const viewSellerOrders = async (sellerId) => {
  try {
    // Fetch orders for the seller, including associated buyer and address
    const orders = await Order.findAll({
      where: { sellerId },
      include: [
        "items", // Include items related to the order
        { model: "Buyer", as: "buyer" }, // Assuming Order has a "buyer" relationship
        { model: "Address", as: "address" }, // Include address associated with the order
      ],
    });

    if (orders.length === 0) {
      console.log("No orders found for the seller.");
      return [];
    }

    return orders;
  } catch (error) {
    console.error("Error fetching orders for seller:", error);
    throw error;
  }
};

// View Order Details for Seller (specific order)
export const viewOrderDetails = async (orderId) => {
  try {
    // Fetch a specific order and include related items, buyer, and address
    const order = await Order.findOne({
      where: { id: orderId },
      include: [
        "items", // Include items associated with this order
        { model: "Buyer", as: "buyer" },
        { model: "Address", as: "address" },
      ],
    });

    if (!order) {
      console.log("Order not found.");
      return null;
    }

    return order;
  } catch (error) {
    console.error("Error fetching order details:", error);
    throw error;
  }
};

export default {
  createOrFetchSeller,
  viewProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  viewSellerOrders,
  viewOrderDetails,
};
