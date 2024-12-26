import express from 'express';
import orderController from '../controller/order.js';
import {protectedRoute} from '../middleware/protectedRoute.js';  // Assuming you have a middleware to authenticate

const router = express.Router();

// Place an Order (and initiate Payment Creation)
router.post('/placeOrder', protectedRoute, async (req, res) => {
  const { addressId } = req.body;  // You should pass addressId in the request body
  const buyerId = req.user.id; // Assume `req.user.id` contains the authenticated buyer's ID
  
  try {
    // Place the order and trigger payment creation
    const { order, approvalUrl } = await orderController.placeOrder(buyerId, addressId);
    
    return res.status(200).json({
      message: 'Order placed successfully.',
      order,
      approvalUrl,  // Return the PayPal approval URL to the client
    });
  } catch (error) {
    console.error("Error placing order:", error);
    return res.status(500).json({ message: 'Error placing order', error: error.message });
  }
});

// Execute the PayPal payment after approval
router.get('/paypal/execute', protectedRoute, async (req, res) => {
  const { paymentId, payerId } = req.query;  // Payment and payer ID are passed in the query string
  
  try {
    // Execute the payment using the provided paymentId and payerId
    const paymentResponse = await orderController.executePaymentHandler(paymentId, payerId);
    
    return res.status(200).json(paymentResponse);  // Send the success response
  } catch (error) {
    console.error("Error executing payment:", error);
    return res.status(500).json({ message: 'Error executing payment', error: error.message });
  }
});

// View all orders for the authenticated buyer
router.get('/orders', protectedRoute, async (req, res) => {
  const buyerId = req.user.id; // Get buyerId from authenticated user
  
  try {
    const orders = await orderController.viewOrders(buyerId);
    
    if (orders.length === 0) {
      return res.status(200).json({ message: 'No orders found' });
    }
    
    return res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return res.status(500).json({ message: 'Error fetching orders', error: error.message });
  }
});

// View a specific order by its ID
router.get('/order/:id', protectedRoute, async (req, res) => {
  const buyerId = req.user.id;
  const orderId = req.params.id;
  
  try {
    const order = await orderController.viewOrderById(orderId);
    
    if (!order || order.buyerId !== buyerId) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    return res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    return res.status(500).json({ message: 'Error fetching order', error: error.message });
  }
});

// Update the order status (e.g., mark it as shipped or delivered)
router.put('/order/:id/status', protectedRoute, async (req, res) => {
  const { status } = req.body;  // New status passed in the request body
  const orderId = req.params.id;
  
  try {
    const updatedOrder = await orderController.updateOrderStatus(orderId, status);
    
    return res.status(200).json(updatedOrder);
  } catch (error) {
    console.error("Error updating order status:", error);
    return res.status(500).json({ message: 'Error updating order status', error: error.message });
  }
});

// Cancel an order
router.put('/order/:id/cancel', protectedRoute, async (req, res) => {
  const orderId = req.params.id;
  
  try {
    const cancelledOrder = await orderController.cancelOrder(orderId);
    
    return res.status(200).json(cancelledOrder);
  } catch (error) {
    console.error("Error cancelling order:", error);
    return res.status(500).json({ message: 'Error cancelling order', error: error.message });
  }
});

// Cancel the PayPal payment (if the user cancels the payment process)
router.get('/paypal/cancel', protectedRoute, (req, res) => {
  return res.status(200).json({ message: 'Payment canceled' });
});

export default router;
