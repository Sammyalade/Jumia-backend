// models/Address.js

import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Address = sequelize.define(
  "Address",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users", // Reference to the Users table
        key: "id",
      },
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3, 100],
      },
    },
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: /^[0-9]{10,15}$/, // Validates phone numbers (10-15 digits)
      },
    },
    street: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3, 100],
      },
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [2, 50],
      },
    },
    state: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [2, 50],
      },
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [2, 50],
      },
    },
    postalCode: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: /^[0-9]{4,10}$/, // Validates postal codes (4-10 digits)
      },
    },
    isDefault: {
      type: DataTypes.BOOLEAN,
      defaultValue: false, // Indicates if this is the default address
    },
  },
  {
    tableName: "Addresses",
    timestamps: true,
  }
);

// Association with User model
Address.associate = (models) => {
  Address.belongsTo(models.User, {
    foreignKey: "userId",
    as: "user",
  });
};

export default Address;
