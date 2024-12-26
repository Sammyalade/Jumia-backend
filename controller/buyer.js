// controllers/buyerController.js

import Buyer from "../models/Buyer.js";
import Cart from "../models/Cart.js";
import Wishlist from "../models/Wishlist.js";

// Create or Fetch a Buyer (Fetch or create a buyer associated with a user)
export const createOrFetchBuyer = async (userId) => {
  try {
    // Use `findOrCreate` to either fetch or create the buyer for the given `userId`
    const [buyer, created] = await Buyer.findOrCreate({
      where: { userId },
      include: [
        {
          model: Cart,
          as: "cart", // Include cart for the buyer
        },
        {
          model: Wishlist,
          as: "wishlist", // Include wishlist for the buyer
        },
      ],
    });

    if (created) {
      console.log(`New buyer created for userId: ${userId}`);
    }

    return buyer;
  } catch (error) {
    console.error("Error creating/fetching buyer:", error);
    throw error;
  }
};

// View Cart for a Buyer
export const viewCart = async (buyerId) => {
  try {
    const cart = await Cart.findOne({
      where: { buyerId },
      include: ["products"], // Assuming cart has products
    });

    if (!cart) {
      console.log("Cart not found for the buyer.");
      return [];
    }

    console.log("Cart details:", cart);
    return cart.products; // Return the list of products in the cart
  } catch (error) {
    console.error("Error fetching cart:", error);
    return [];
  }
};

// View Wishlist for a Buyer
export const viewWishlist = async (buyerId) => {
  try {
    const wishlist = await Wishlist.findOne({
      where: { buyerId },
      include: ["products"], // Assuming wishlist has products
    });

    if (!wishlist) {
      console.log("Wishlist not found for the buyer.");
      return [];
    }

    console.log("Wishlist details:", wishlist);
    return wishlist.products; // Return the list of products in the wishlist
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return [];
  }
};
