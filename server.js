import pkg from "pg";
import sequelize from "./config/db.js"; // Import your sequelize instance
import Address from "./models/address.js";
import Buyer from "./models/buyer.js";
import Cart from "./models/cart.js";
import Item from "./models/items.js";
import Order from "./models/order.js";
import Payment from "./models/payment.js";
import Product from "./models/product.js";
import Seller from "./models/seller.js";
import User from "./models/user.js";
import Wishlist from "./models/wishlist.js";

const { Pool } = pkg; // Destructure Pool from pg

const startServer = async (app) => {
  try {
    // 1. Synchronize Sequelize Models with the Database
    await sequelize.sync({ alter: true }); // 'alter: false' creates missing tables only

    console.log("All models were synchronized successfully.");

    // 2. Set up PostgreSQL Connection Pool (if needed for raw queries)
    const pool = new Pool({
      user: "postgres",   // Replace with your database credentials
      host: "localhost",
      database: "Jumia",  // Replace with your database name
      password: "08027146369Aos@@@",  // Replace with your password
      port: 5432,
    });

    // Optional: Check connection with pg Pool (not necessary for Sequelize)
    pool
      .connect()
      .then(() => console.log("Connected to PostgreSQL database via pg Pool"))
      .catch((err) => console.error("Database connection error", err));

    // 3. Start the Express server
    app.listen(4200, () => {
      console.log("Server is running on http://localhost:4200");
    });

  } catch (error) {
    console.error("Error during server initialization:", error);
  }
};

export default startServer;
