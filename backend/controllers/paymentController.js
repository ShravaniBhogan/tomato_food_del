import Razorpay from 'razorpay';
import dotenv from 'dotenv';
dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Razorpay Order
export const createOrder = async (req, res) => {
  const { amount } = req.body; // amount in INR
  const options = {
    amount: amount * 100, // Razorpay expects amount in paise (100 INR = 10000)
    currency: "INR",
    receipt: "order_rcptid_" + Math.floor(Math.random() * 100000),
  };
  try {
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: "Order creation failed" });
  }
};
