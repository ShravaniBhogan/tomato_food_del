import express from 'express';
import authMiddleware from '../middleware/auth.js';


import { 
  listOrders, 
  placeOrder, 
  updateStatus, 
  userOrders, 
  verifyOrder, 
  placeOrderCod 
} from '../controllers/orderController.js';

import { createOrder } from '../controllers/paymentController.js'; // Import Razorpay order creator

const orderRouter = express.Router();

orderRouter.get("/list", listOrders);
orderRouter.post("/userorders", authMiddleware, userOrders);
orderRouter.post("/place", authMiddleware, placeOrder);
orderRouter.post("/status", updateStatus);
orderRouter.post("/verify", verifyOrder);
orderRouter.post("/placecod", authMiddleware, placeOrderCod);

// NEW Razorpay order creation endpoint
orderRouter.post("/payment/order", authMiddleware, createOrder);

export default orderRouter;
