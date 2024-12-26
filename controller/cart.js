import Cart from "../models/cart.js";
import Item from "../models/items.js";
import Product from "../models/product.js";  // Product model import for fetching products
import Buyer from "../models/buyer.js";
import models from '../models/index.js';

export const createOrFetchCart = async (userId) => {
  try {
    // Find the corresponding buyer using the userId
    const buyer = await Buyer.findOne({ where: { userId } });
    if (!buyer) {
      console.log(`No buyer found for userId: ${userId}`);
      return { message: "No buyer associated with this user." };
    }

    const buyerId = buyer.id; // Get the buyerId from the Buyer table

    // Try to find the cart for the given buyerId
    let cart = await Cart.findOne({
      where: { buyerId },
      include: [{
        model: models.Item,
        as: 'items',
        include: [{
          model: models.Product, // Load Product data through the Item model
          as: 'product',
        }],
      }],
    });

    if (!cart) {
      // If no cart found, create a new one
      cart = await Cart.create({ buyerId });
      console.log(`New cart created for buyerId: ${buyerId}`);
    } else {
      console.log(`Cart found for buyerId: ${buyerId}`);
    }

    return cart; // Return the cart, whether found or newly created
  } catch (error) {
    console.error("Error creating or fetching cart:", error);
    throw error; // Propagate the error for handling elsewhere
  }
};


// View Cart for a Buyer (Get all items in the cart)
export const viewCart = async (buyerId) => {
  try {
    // Find the cart for the given buyerId
    const cart = await Cart.findOne({
      where: { buyerId },
      include: [{
        model: Product,
        as: 'products',  // Alias from Cart ↔ Product relationship
        through: { attributes: ['quantity'] },  // Include the quantity of each product in the cart
      }],
    });

    if (!cart) {
      console.log("Cart not found for the buyer.");
      return { message: "Cart is empty." };  // Return an empty message if no cart found
    }

    console.log("Cart details:", cart);
    return cart;  // Return the cart with its associated products and quantities
  } catch (error) {
    console.error("Error fetching cart:", error);
    return { error: "Failed to fetch cart." };  // Return an error message if there's an issue
  }
};

// Add Item to Cart
export const addToCart = async (buyerId, productId, quantity) => {
  try {
    const cart = await Cart.findOne({ where: { buyerId } });

    if (!cart) {
      console.log("Cart not found for the buyer.");
      return;
    }

    const product = await Product.findByPk(productId);
    if (!product) {
      console.log("Product not found.");
      return;
    }

    // Check if the product is already in the cart (via Item)
    const [item, created] = await Item.findOrCreate({
      where: { 
        cartId: cart.id,  // Use cartId here
        productId,        // Link to the specific product
      },
      defaults: { quantity }, // Default quantity if the item is newly created
    });

    if (!created) {
      // If the item already exists, update the quantity
      item.quantity += quantity;
      await item.save();
      console.log(`Product quantity updated in the cart: ${item}`);
    } else {
      console.log(`Product added to the cart: ${item}`);
    }
  } catch (error) {
    console.error("Error adding product to cart:", error);
  }
};

// Remove Item from Cart
export const removeFromCart = async (buyerId, productId) => {
  try {
    const cart = await Cart.findOne({ where: { buyerId } });

    if (!cart) {
      console.log("Cart not found for the buyer.");
      return;
    }

    const item = await Item.findOne({
      where: { 
        cartId: cart.id,  // Use cartId here
        productId,         // Find the specific productId
      },
    });

    if (!item) {
      console.log("Product not found in the cart.");
      return;
    }

    await item.destroy();
    console.log(`Product removed from cart: ${item}`);
  } catch (error) {
    console.error("Error removing product from cart:", error);
  }
};

// Clear the Cart
export const clearCart = async (buyerId) => {
  try {
    const cart = await Cart.findOne({ where: { buyerId } });

    if (!cart) {
      console.log("Cart not found for the buyer.");
      return { message: "Cart is empty or does not exist." };
    }

    // Remove all items from the cart
    await Item.destroy({
      where: { 
        cartId: cart.id,  // Only items belonging to this cart
      },
    });

    console.log("Cart cleared successfully.");
    return { message: "Cart cleared successfully." };
  } catch (error) {
    console.error("Error clearing the cart:", error);
    return { error: "Failed to clear the cart." };
  }
};
