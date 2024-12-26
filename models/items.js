// models/item.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Item = sequelize.define('Item', {
  cartId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Carts',
      key: 'id',
    },
    allowNull: false,
  },
  productId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Products',
      key: 'id',
    },
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    validate: {
      min: 1,
    },
  },
}, {
  tableName: 'Items',
  timestamps: true,
});

Item.associate = (models) => {
  Item.belongsTo(models.Cart, { foreignKey: 'cartId', as: 'cart' });
  Item.belongsTo(models.Product, { foreignKey: 'productId', as: 'product' });
};

export default Item;
