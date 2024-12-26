import express from "express";
import {
  approveSeller,
  rejectSeller,
  viewSellers,
  viewAllOrders,
  viewAllProducts,
  deleteProduct,
  deleteUser,
} from "../controller/admin.js";
import { protectedRoute } from "../middleware/protectedRoute.js";
import { isAdmin } from "../middleware/rolecheck.js"; // A middleware to ensure the user is an admin

const router = express.Router();

// Protect all admin routes
router.use(protectedRoute); // Ensure the user is authenticated
router.use(isAdmin); // Ensure the user is an admin

// Admin can approve/reject sellers
router.put("/sellers/approve/:sellerId", approveSeller);
router.delete("/sellers/reject/:sellerId", rejectSeller);

// Admin can view all sellers
router.get("/sellers", viewSellers);

// Admin can view all orders
router.get("/orders", viewAllOrders);

// Admin can view all products
router.get("/products", viewAllProducts);

// Admin can delete products
router.delete("/products/:productId", deleteProduct);

// Admin can delete users
router.delete("/users/:userId", deleteUser);

export default router;
