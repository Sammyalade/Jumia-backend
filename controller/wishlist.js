// controllers/wishlistController.js
import Wishlist from "../models/Wishlist.js";

// Add Product to Wishlist
export const addToWishlist = async (buyerId, productId) => {
  const wishlist = await Wishlist.findOne({ where: { buyerId } });

  if (!wishlist) {
    console.log("Wishlist not found.");
    return;
  }

  const itemExists = await wishlist.hasProduct(productId);
  if (itemExists) {
    console.log("Product already in wishlist.");
    return;
  }

  await wishlist.addProduct(productId);
  console.log("Product added to wishlist.");
};

// Remove Product from Wishlist
export const removeFromWishlist = async (buyerId, productId) => {
  const wishlist = await Wishlist.findOne({ where: { buyerId } });

  if (!wishlist) {
    console.log("Wishlist not found.");
    return;
  }

  await wishlist.removeProduct(productId);
  console.log("Product removed from wishlist.");
};
