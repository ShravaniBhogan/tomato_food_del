import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

// Place Order (Razorpay payment session will be created separately)
const placeOrder = async (req, res) => {
    try {
        const newOrder = new orderModel({
            userId: req.userId,           // from auth middleware
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
            payment: false                // initially false until payment success
        });

        await newOrder.save();
        // Clear user cart after placing order
        await userModel.findByIdAndUpdate(req.userId, { cartData: {} });

        // Respond with order ID so frontend can proceed with Razorpay payment using this orderId
        res.json({ success: true, orderId: newOrder._id, message: "Order placed, proceed to payment" });
    } catch (error) {
        console.error("Error placing order:", error);
        res.status(500).json({ success: false, message: "Error placing order" });
    }
};

// Place Order (Cash on Delivery)
const placeOrderCod = async (req, res) => {
    try {
        const newOrder = new orderModel({
            userId: req.userId,
            items: req.body.items,
            amount: req.body.amount,
            address: req.body.address,
            payment: true,
        });

        await newOrder.save();
        await userModel.findByIdAndUpdate(req.userId, { cartData: {} });

        res.json({ success: true, message: "Order placed with Cash on Delivery" });
    } catch (error) {
        console.error("Error placing COD order:", error);
        res.status(500).json({ success: false, message: "Error placing COD order" });
    }
};

// List all Orders (Admin)
const listOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({});
        res.json({ success: true, data: orders });
    } catch (error) {
        console.error("Error listing orders:", error);
        res.status(500).json({ success: false, message: "Error listing orders" });
    }
};

// Fetch Orders for Logged-in User
const userOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({ userId: req.userId });
        res.json({ success: true, data: orders });
    } catch (error) {
        console.error("Error fetching user orders:", error);
        res.status(500).json({ success: false, message: "Error fetching user orders" });
    }
};

// Update Order Status (Admin only)
const updateStatus = async (req, res) => {
    try {
        await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
        res.json({ success: true, message: "Status updated" });
    } catch (error) {
        console.error("Error updating status:", error);
        res.status(500).json({ success: false, message: "Error updating status" });
    }
};

// Verify Order Payment success or failure after Razorpay payment
const verifyOrder = async (req, res) => {
    const { orderId, success } = req.body;
    try {
        if (success === "true") {
            // mark order as paid
            await orderModel.findByIdAndUpdate(orderId, { payment: true });
            res.json({ success: true, message: "Payment successful" });
        } else {
            // delete order if payment failed or canceled
            await orderModel.findByIdAndDelete(orderId);
            res.json({ success: false, message: "Payment failed or canceled" });
        }
    } catch (error) {
        console.error("Error verifying order:", error);
        res.status(500).json({ success: false, message: "Order verification failed" });
    }
};

export {
    placeOrder,
    placeOrderCod,
    listOrders,
    userOrders,
    updateStatus,
    verifyOrder
};
