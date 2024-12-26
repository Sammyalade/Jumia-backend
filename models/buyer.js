import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Buyer = sequelize.define(
  "Buyer",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: "Users", // Reference to the Users table
        key: "id",
      },
    },
  },
  {
    tableName: "Buyers",
    timestamps: true,
  }
);

// Associations
Buyer.associate = (models) => {
  // A Buyer belongs to a User
  Buyer.belongsTo(models.User, {
    foreignKey: "userId",
    as: "user", // Alias for the association
  });

  // A Buyer has one Wishlist
  Buyer.hasOne(models.Wishlist, {
    foreignKey: "buyerId",
    as: "wishlist",
  });

  // A Buyer has one Cart
  Buyer.hasOne(models.Cart, {
    foreignKey: "buyerId",
    as: "cart",
  });

  // A Buyer has many Orders
  Buyer.hasMany(models.Order, {
    foreignKey: "buyerId",
    as: "orders",
  });
};

export default Buyer;
