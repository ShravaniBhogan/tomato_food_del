import React from "react";
import axios from "axios";
import './RazorpayButton.css';

const RazorpayButton = ({
  amount,
  name = "Test User",
  email = "test.user@example.com",
  contact = "",
  submitOrder,  // Function to create order in your backend
  disabled
}) => {

  const handlePayment = async () => {
    if (!submitOrder) {
      alert("Order submission function missing");
      return;
    }

    // Step 1: create order entry in backend (DB)
    const orderId = await submitOrder();

    if (!orderId) {
      alert("Order placement failed. Cannot proceed to payment.");
      return;
    }

    try {
      // Step 2: create Razorpay order to get order details for payment
      const { data } = await axios.post(
        'http://localhost:4000/api/order/payment/order',
        { amount }
      );

      const options = {
        key: "rzp_test_R6kIcIggwWOR3P", // Your Razorpay Test Key
        amount: data.amount,
        currency: data.currency,
        order_id: data.id,
        name: "Food Del",
        description: `Order ID: ${orderId}`,
        handler: async function (response) {
          alert("Payment Successful! Payment ID: " + response.razorpay_payment_id);
          // Optionally call your verify order API here to mark payment success:
          await axios.post('http://localhost:4000/api/order/verifyorder', {
            orderId,
            success: "true"
          });
        },
        prefill: {
          name,
          email,
          contact,
        },
        theme: { color: "#3399cc" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Razorpay payment error:", error);
      alert("Payment initialization failed. Please try again.");
    }
  };

  return (
    <button
      onClick={handlePayment}
      className="razorpay-btn"
      type="button"
      disabled={disabled}
    >
      Place Order & Pay
    </button>
  );
};

export default RazorpayButton;
