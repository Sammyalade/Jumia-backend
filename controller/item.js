// controllers/itemController.js

import Item from "../models/items.js";
import Product from "../models/product.js";

// Add Item to a Parent (Cart, Order, or Wishlist)
export const addItem = async (parentId, parentType, productId, quantity) => {
  try {
    // Validate the parentType
    if (!['cart', 'order', 'wishlist'].includes(parentType)) {
      console.log("Invalid parent type.");
      return;
    }

    // Check if the product exists
    const product = await Product.findByPk(productId);
    if (!product) {
      console.log("Product not found.");
      return;
    }

    // Check if the item already exists in the given parent (cart, order, wishlist)
    const existingItem = await Item.findOne({
      where: { parentId, parentType, productId },
    });

    if (existingItem) {
      // If the item already exists, update its quantity
      existingItem.quantity += quantity;
      await existingItem.save();
      console.log(`Item quantity updated: ${existingItem}`);
    } else {
      // If the item doesn't exist, create a new one
      const newItem = await Item.create({
        parentId,
        parentType,
        productId,
        quantity,
      });
      console.log(`New item added to ${parentType}: ${newItem}`);
    }
  } catch (error) {
    console.error("Error adding item:", error);
  }
};

// View Items in a Parent (Cart, Order, or Wishlist)
export const viewItems = async (parentId, parentType) => {
  try {
    if (!['cart', 'order', 'wishlist'].includes(parentType)) {
      console.log("Invalid parent type.");
      return;
    }

    const items = await Item.findAll({
      where: { parentId, parentType },
      include: {
        model: Product,
        as: "product",
        attributes: ["id", "title", "price", "image"], // Include product details
      },
    });

    if (items.length === 0) {
      console.log(`No items found in the ${parentType}.`);
      return [];
    }

    console.log(`Found ${items.length} items in the ${parentType}:`);
    return items; // Return all items with their associated product details
  } catch (error) {
    console.error("Error fetching items:", error);
    return [];
  }
};

// Remove an Item from a Parent (Cart, Order, or Wishlist)
export const removeItem = async (parentId, parentType, productId) => {
  try {
    if (!['cart', 'order', 'wishlist'].includes(parentType)) {
      console.log("Invalid parent type.");
      return;
    }

    const item = await Item.findOne({
      where: { parentId, parentType, productId },
    });

    if (!item) {
      console.log("Item not found.");
      return;
    }

    await item.destroy();
    console.log(`Item removed from ${parentType}: ${item}`);
  } catch (error) {
    console.error("Error removing item:", error);
  }
};

// Update Item Quantity in a Parent (Cart, Order, or Wishlist)
export const updateItemQuantity = async (parentId, parentType, productId, quantity) => {
  try {
    if (!['cart', 'order', 'wishlist'].includes(parentType)) {
      console.log("Invalid parent type.");
      return;
    }

    if (quantity < 1) {
      console.log("Quantity must be at least 1.");
      return;
    }

    const item = await Item.findOne({
      where: { parentId, parentType, productId },
    });

    if (!item) {
      console.log("Item not found.");
      return;
    }

    item.quantity = quantity;
    await item.save();
    console.log(`Item quantity updated: ${item}`);
  } catch (error) {
    console.error("Error updating item quantity:", error);
  }
};
