import User from "../models/user.js";
import Seller from "../models/seller.js";
import Product from "../models/product.js";
import Order from "../models/order.js";
import Item from "../models/items.js";

// 1. **Approve a Seller's Store**
export const approveSeller = async (req, res) => {
  try {
    const { sellerId } = req.params;  // Get sellerId from the route parameter

    // Find the seller and update their verified status
    const seller = await Seller.findOne({ where: { id: sellerId } });

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller not found.",
      });
    }

    // Approve the seller by setting verified to true
    seller.verified = true;
    await seller.save();

    res.status(200).json({
      success: true,
      message: "Seller approved successfully.",
      seller,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to approve seller.",
      error: error.message,
    });
  }
};

// 2. **Reject a Seller's Store**
export const rejectSeller = async (req, res) => {
  try {
    const { sellerId } = req.params;  // Get sellerId from the route parameter

    // Find the seller and reject their store
    const seller = await Seller.findOne({ where: { id: sellerId } });

    if (!seller) {
      return res.status(404).json({
        success: false,
        message: "Seller not found.",
      });
    }

    // Reject the seller by deleting their store record
    await seller.destroy();

    res.status(200).json({
      success: true,
      message: "Seller rejected and store removed.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to reject seller.",
      error: error.message,
    });
  }
};

// 3. **View All Sellers**
export const viewSellers = async (req, res) => {
  try {
    // Fetch all sellers with their user details
    const sellers = await Seller.findAll({
      include: {
        model: User,
        as: "user",
        attributes: ['id', 'username', 'email'], // You can include more user details if needed
      },
    });

    if (sellers.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No sellers found.",
      });
    }

    res.status(200).json({
      success: true,
      sellers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch sellers.",
      error: error.message,
    });
  }
};

// 4. **View All Orders (Across All Sellers)**
export const viewAllOrders = async (req, res) => {
  try {
    // Fetch all orders
    const orders = await Order.findAll({
      include: {
        model: Item,
        as: "items",
        include: {
          model: Product,
          as: "product",
        },
      },
    });

    if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No orders found.",
      });
    }

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders.",
      error: error.message,
    });
  }
};

// 5. **View All Products**
export const viewAllProducts = async (req, res) => {
  try {
    // Fetch all products in the platform
    const products = await Product.findAll();

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No products found.",
      });
    }

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch products.",
      error: error.message,
    });
  }
};

// 6. **Delete a Product**
export const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;  // Get productId from the route parameter

    // Find the product and delete it
    const product = await Product.findOne({ where: { id: productId } });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    await product.destroy();

    res.status(200).json({
      success: true,
      message: "Product deleted successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to delete product.",
      error: error.message,
    });
  }
};

// 7. **Delete a User (Admin Only)**
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;  // Get userId from the route parameter

    // Find the user and delete it
    const user = await User.findOne({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    await user.destroy();

    res.status(200).json({
      success: true,
      message: "User deleted successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to delete user.",
      error: error.message,
    });
  }
};
