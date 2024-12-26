// models/Seller.js

import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Seller = sequelize.define(
  "Seller",
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
    storeName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3, 50],
      },
    },
    storeDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    storeAddress: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [5, 100],
      },
    },
    storePhone: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        is: /^[0-9]{10,15}$/, // Validates phone numbers (10-15 digits)
      },
    },
    storeLogo: {
      type: DataTypes.STRING, // URL of the store's logo
      allowNull: true,
      validate: {
        isUrl: true,
      },
    },
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false, // Indicates if the seller has been verified
    },
  },
  {
    tableName: "Sellers",
    timestamps: true,
  }
);

// Association with User model
Seller.associate = (models) => {
  Seller.belongsTo(models.User, {
    foreignKey: "userId",
    as: "user",
  });
};

export default Seller;
