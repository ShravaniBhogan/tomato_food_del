import React, { useContext, useState } from "react";
import "./PlaceOrder.css";
import RazorpayButton from "../../components/RazorpayButton/RazorpayButton.jsx";
import { StoreContext } from "../../Context/StoreContext"; // Fix path if needed
import axios from "axios";

const PlaceOrder = () => {
  const { getTotalCartAmount, cartItems, food_list, url, token } = useContext(StoreContext);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    phone: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orderId, setOrderId] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const subtotal = getTotalCartAmount();
  const deliveryFee = subtotal === 0 ? 0 : 5;
  const totalAmount = subtotal + deliveryFee;

  const fullAddress = `${form.street}, ${form.city}, ${form.state}, ${form.zip}, ${form.country}`;

  // Step 1: Call backend to place order record (not yet payment)
  const submitOrder = async () => {
    if (!token) {
      setError("Please log in to place an order.");
      return null;
    }

    if (subtotal === 0) {
      setError("Your cart is empty.");
      return null;
    }

    if (!fullAddress.trim()) {
      setError("Please fill in your delivery address.");
      return null;
    }

    setLoading(true);
    setError(null);

    const items = Object.keys(cartItems).map(itemId => ({
      _id: itemId,
      quantity: cartItems[itemId],
    }));

    try {
      const response = await axios.post(
  `${url}/api/order/place`,   // <-- Fix here!
  { items, amount: totalAmount, address: fullAddress },
  { headers: { Authorization: `Bearer ${token}` } }
);


      if (response.data.success) {
        setOrderId(response.data.orderId);
        return response.data.orderId;
      } else {
        setError("Failed to place order.");
        return null;
      }
    } catch (err) {
      setError("Error placing order.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="place-order" onSubmit={e => e.preventDefault()}>
      <div className="place-order-left">
        <p className="title">Delivery Information</p>
        <div className="multi-fields">
          <input name="firstName" type="text" placeholder="First Name" onChange={handleChange} />
          <input name="lastName" type="text" placeholder="Last Name" onChange={handleChange} />
        </div>
        <input name="email" type="email" placeholder="Email address" onChange={handleChange} />
        <input name="street" type="text" placeholder="Street" onChange={handleChange} />
        <div className="multi-fields">
          <input name="city" type="text" placeholder="City" onChange={handleChange} />
          <input name="state" type="text" placeholder="State" onChange={handleChange} />
        </div>
        <div className="multi-fields">
          <input name="zip" type="text" placeholder="Zip code" onChange={handleChange} />
          <input name="country" type="text" placeholder="Country" onChange={handleChange} />
        </div>
        <input name="phone" type="text" placeholder="Phone" onChange={handleChange} />
      </div>
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>${subtotal.toFixed(2)}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>${deliveryFee.toFixed(2)}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>${totalAmount.toFixed(2)}</b>
            </div>
          </div>

          {error && <p style={{ color: "red" }}>{error}</p>}
          {loading && <p>Processing your order... Please wait.</p>}
          <p>After clicking the below button your order will be placed and you can view your order in Orders section for tracking.</p>
          {/* RazorpayButton updated to first submit order and then start payment */}
          <RazorpayButton
            amount={totalAmount}
            name={`${form.firstName} ${form.lastName}`}
            email={form.email}
            contact={form.phone}
            submitOrder={submitOrder}
            orderId={orderId}
            disabled={loading}
          />
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
