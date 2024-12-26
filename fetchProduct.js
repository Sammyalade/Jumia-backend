import axios from 'axios';
import Product from './model/product.js';  // Import your Product model
import sequelize from './db.js';  // Import sequelize connection

// URL of the FakeStoreAPI endpoint
const apiUrl = 'https://fakestoreapi.com/products';

// Sync Database with Sequelize models
const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: true });  // alter will update the columns based on the model
    console.log('Tables have been created/altered.');
  } catch (error) {
    console.error('Error syncing models:', error);
  }
};

// Fetch and store products in the database
const fetchAndStoreProducts = async () => {
  try {
    // Step 1: Delete existing data from the database
    await Product.destroy({ where: {} }); // This deletes all rows in the Products table
    console.log('All existing products have been deleted.');

    // Step 2: Fetch products from FakeStoreAPI (100 products in total)
    const totalProducts = 100; // Fetch 100 products
    const limit = 20;  // API returns 20 products per page
    const totalPages = Math.ceil(totalProducts / limit);  // Calculate the number of pages

    for (let page = 1; page <= totalPages; page++) {
      const response = await axios.get(apiUrl, {
        params: {
          _page: page,
          _limit: limit,
        },
      });

      const products = response.data;

      // Loop through the products and insert them into the database
      for (const productData of products) {
        const { title, price, description, category, image, rating } = productData;

        // Prepare the product data for insertion into the database
        const product = {
          title,
          price,
          description,
          category,
          image,
          ratingRate: rating.rate,  // If rating is an object, use the rate
          ratingCount: rating.count,  // Use the count from the rating object
        };

        // Create the product in the database
        await Product.create(product);
        console.log(`Product created: ${title}`);
      }

      console.log(`Fetched and stored products for page ${page}`);
    }

    console.log('All products have been stored in the database.');
  } catch (error) {
    console.error('Error fetching and storing products:', error);
  }
};

// Sync database and then fetch/store products
syncDatabase().then(() => {
  fetchAndStoreProducts();
});
