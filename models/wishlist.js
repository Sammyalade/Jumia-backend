// models/Wishlist.js

import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Wishlist = sequelize.define(
  "Wishlist",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    buyerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Buyers",
        key: "id",
      },
    },
  },
  {
    tableName: "Wishlists",
    timestamps: true,
  }
);

// Associations
Wishlist.associate = (models) => {
  Wishlist.belongsTo(models.Buyer, {
    foreignKey: "buyerId",
    as: "buyer",
  });

  // Wishlist has many items through CartItem
  Wishlist.hasMany(models.Item, {
    foreignKey: "parentId", // This will link to parentId (wishlistId in CartItem)
    constraints: false,
    scope: { parentType: "wishlist" }, // We limit CartItems to "wishlist" items
    as: "items",
  });
};

export default Wishlist;
