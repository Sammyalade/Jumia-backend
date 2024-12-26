import sequelize from '../config/db.js'; // Import the Sequelize instance

// Define an empty object to store models
const models = {};

// Dynamically import all models
models.User = import('./user.js');
models.Buyer = import('./buyer.js');
models.Cart = import('./cart.js');
models.Item = import('./items.js');
models.Product = import('./product.js');
models.Order = import('./order.js'); // Assuming you have an Order model

// Define associations after all models are loaded
Promise.all(Object.values(models)).then(() => {
  Object.keys(models).forEach((modelName) => {
    if (models[modelName].associate) {
      models[modelName].associate(models);
    }
  });
});

// Export models and sequelize instance
export { sequelize };
export default models;
