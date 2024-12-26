import paypal from '../config/paypal.js';
import Order from '../models/order.js';
import Payment from '../models/payment.js';

// Step 1: Create a payment
export const createPayment = async (req, res) => {
  const { orderId, amount } = req.body; // Order ID and amount passed in the request

  try {
    const order = await Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // PayPal payment creation
    const paymentJson = {
      intent: 'sale',
      payer: {
        payment_method: 'paypal',
      },
      transactions: [{
        amount: {
          total: amount,
          currency: 'USD',
        },
        description: `Payment for Order #${orderId}`,
      }],
      redirect_urls: {
        return_url: 'http://localhost:5000/paypal/execute', // Redirect URL after payment approval
        cancel_url: 'http://localhost:5000/paypal/cancel',
      },
    };

    // Call PayPal to create the payment
    paypal.payment.create(paymentJson, async (error, payment) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error creating PayPal payment' });
      } else {
        // Find the approval URL
        const approvalUrl = payment.links.find(link => link.rel === 'approval_url').href;

        // Create a payment record in your database
        const paymentRecord = await Payment.create({
          orderId,
          amount,
          status: 'pending',
          transactionId: payment.id,
        });

        // Send the approval URL back to the client
        return res.status(200).json({ approvalUrl, paymentId: payment.id });
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error processing payment' });
  }
};

// Step 2: Execute the payment after approval
export const executePayment = async (req, res) => {
  const { paymentId, payerId } = req.query;

  try {
    // Execute the PayPal payment
    paypal.payment.execute(paymentId, { payer_id: payerId }, async (error, payment) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error executing PayPal payment' });
      } else {
        // If payment is successful, update the payment status
        const paymentRecord = await Payment.findOne({
          where: { transactionId: payment.id },
        });

        if (paymentRecord) {
          await paymentRecord.update({ status: 'completed' });
          return res.status(200).json({ message: 'Payment successful', payment });
        } else {
          return res.status(404).json({ message: 'Payment record not found' });
        }
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error processing payment execution' });
  }
};

// Step 3: Handle payment cancellation
export const cancelPayment = (req, res) => {
  return res.status(200).json({ message: 'Payment canceled' });
};
