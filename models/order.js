// models/Order.js

import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Order = sequelize.define(
  "Order",
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
    status: {
      type: DataTypes.STRING,
      defaultValue: "pending",
    },
  },
  {
    tableName: "Orders",
    timestamps: true,
  }
);

// Associations
Order.associate = (models) => {
  Order.belongsTo(models.Buyer, {
    foreignKey: "buyerId",
    as: "buyer",
  });

  // Order has many items through CartItem
  Order.hasMany(models.Item, {
    foreignKey: "parentId", // This will link to parentId (orderId in CartItem)
    constraints: false,
    scope: { parentType: "order" }, // We limit CartItems to "order" items
    as: "items",
  });
};

export default Order;
