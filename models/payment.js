import { DataTypes } from 'sequelize';
import sequelize from "../config/db.js";

const Payment = sequelize.define('Payment', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  orderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Orders', // Referring to the Orders model
      key: 'id',
    },
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'pending', // Default payment status
  },
  transactionId: {
    type: DataTypes.STRING,
    allowNull: true, // Will be set by PayPal's response
  },
  paymentMethod: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'PayPal',
  },
}, {
  tableName: 'Payments',
  timestamps: true,
});

// Association with Order model
Payment.associate = (models) => {
  Payment.belongsTo(models.Order, {
    foreignKey: 'orderId',
    as: 'order',
  });
};

export default Payment;
