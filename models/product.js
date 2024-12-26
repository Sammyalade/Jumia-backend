import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Item from './items.js'; // Import Item model

const Product = sequelize.define('Product', {
  title: {
    type: DataTypes.STRING(512),
    allowNull: false,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  category: {
    type: DataTypes.STRING(512),
    allowNull: true,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  ratingRate: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  ratingCount: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  tableName: 'Products',
  timestamps: true,
});

// Define the associations
Product.associate = (models) => {
  // A product can have many items (in many carts)
  Product.hasMany(models.Item, {
    foreignKey: 'productId',
    as: 'items', // Alias for the items related to the product
  });
};

export default Product;
