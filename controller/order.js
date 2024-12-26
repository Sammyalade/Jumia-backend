import Order from "../models/order.js";
import Item from "../models/items.js";
import Address from "../models/address.js";
import Cart from "../models/cart.js";
import { createPayment } from "../controller/payment.js";  // Import the createPayment function
import { executePayment } from "../controller/payment.js";  // Import the executePayment function

// Place an Order and Trigger Payment Creation
const placeOrder = async (buyerId, addressId) => {
  try {
    // Retrieve the buyer's cart
    const cart = await Cart.findOne({ where: { buyerId } });

    if (!cart || cart.items.length === 0) {
      console.log("Cart is empty, can't place an order.");
      throw new Error("Cart is empty");
    }

    // Check if the address exists for the given buyer
    const address = await Address.findOne({ where: { id: addressId, buyerId } });

    if (!address) {
      console.log("Invalid address.");
      throw new Error("Invalid address");
    }

    // Create the order from cart and address
    const order = await Order.create({
      buyerId,
      addressId,
      totalAmount: cart.totalAmount, // Assuming the cart contains a totalAmount field
      status: "pending", // Default status
    });

    // Move items from cart to order
    const items = await Item.findAll({ where: { parentId: cart.id, parentType: 'cart' } });

    // Link the items to the order
    for (let item of items) {
      await order.addItem(item);
    }

    // Clear the cart after the order is placed
    await cart.clearCart();

    console.log("Order placed successfully.");

    // Now trigger the payment creation (using PayPal)
    const paymentResponse = await createPayment(order.id, cart.totalAmount); // This creates the PayPal payment

    // Return the approval URL (to be used by the client for PayPal approval)
    return {
      order,
      approvalUrl: paymentResponse.approvalUrl,  // Send the PayPal approval URL to the client
    };

  } catch (error) {
    console.error("Error placing order and creating payment:", error);
    throw error; // Rethrow the error to be caught at the route level
  }
};

// View Orders for a Buyer
const viewOrders = async (buyerId) => {
  try {
    const orders = await Order.findAll({
      where: { buyerId },
      include: ["items", "address"], // Fetch associated items and address
    });

    if (orders.length === 0) {
      console.log("No orders found.");
      return [];
    }

    return orders;
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error; // Rethrow to be handled at the route level
  }
};

// Fetch a specific order by ID
const viewOrderById = async (orderId) => {
  try {
    const order = await Order.findOne({
      where: { id: orderId },
      include: ["items", "address"], // Include associated items and address
    });

    if (!order) {
      console.log("Order not found.");
      return null;
    }

    return order;
  } catch (error) {
    console.error("Error fetching order:", error);
    throw error; // Rethrow to be handled at the route level
  }
};

// Update the order status
const updateOrderStatus = async (orderId, status) => {
  try {
    const order = await Order.findByPk(orderId);

    if (!order) {
      console.log("Order not found.");
      throw new Error("Order not found");
    }

    order.status = status;
    await order.save();

    console.log("Order status updated successfully.");
    return order;
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
};

// Cancel an order
const cancelOrder = async (orderId) => {
  try {
    const order = await Order.findByPk(orderId);

    if (!order) {
      console.log("Order not found.");
      throw new Error("Order not found");
    }

    order.status = "cancelled";
    await order.save();

    console.log("Order cancelled successfully.");
    return order;
  } catch (error) {
    console.error("Error cancelling order:", error);
    throw error;
  }
};

// Execute the PayPal payment after approval
const executePaymentHandler = async (paymentId, payerId) => {
  try {
    const paymentResponse = await executePayment(paymentId, payerId); // Execute the payment

    if (paymentResponse.status === 'completed') {
      // Once payment is completed, you can update the order status and payment status
      const order = await Order.findOne({ where: { id: paymentResponse.orderId } });

      if (order) {
        order.status = "paid";  // Update order status
        await order.save();
      }

      return { message: 'Payment successful', paymentResponse };
    } else {
      throw new Error("Payment execution failed");
    }
  } catch (error) {
    console.error("Error executing payment:", error);
    throw error;
  }
};

export default {
  placeOrder,
  viewOrders,
  viewOrderById,
  updateOrderStatus,
  cancelOrder,
  executePaymentHandler,
};
