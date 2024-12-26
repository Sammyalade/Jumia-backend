// models/cart.js
import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Cart = sequelize.define('Cart', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  buyerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Buyers',
      key: 'id',
    },
  },
}, {
  tableName: 'Carts',
  timestamps: true,
});

Cart.associate = (models) => {
  Cart.belongsTo(models.Buyer, { foreignKey: 'buyerId', as: 'buyer' });
  Cart.hasMany(models.Item, { foreignKey: 'cartId', as: 'items' });
};

export default Cart;
