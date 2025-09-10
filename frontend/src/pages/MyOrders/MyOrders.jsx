import React, { useContext, useEffect, useState } from 'react';
import './MyOrders.css';
import axios from 'axios';
import { StoreContext } from '../../Context/StoreContext';
import { assets } from '../../assets/assets';


const MyOrders = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { url, token, currency, food_list } = useContext(StoreContext);  // Get food_list here


  const fetchOrders = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        url + "/api/order/userorders",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setData(response.data.data || []);
    } catch (err) {
      setError("Failed to load orders");
      setData([]);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);


  if (!token) return <p>Please log in to view your orders.</p>;


  if (loading) return <p>Loading your orders...</p>;


  if (error) return <p>{error}</p>;


  if (!data.length) return <p>No orders found.</p>;


  return (
    <div className='my-orders'>
      <h2>My Orders</h2>
      <div className="container">
        {data.map((order, index) => (
          <div key={index} className='my-orders-order'>
            <img src={assets.parcel_icon} alt="parcel icon" />
            <p>
              {order.items.map((item, idx) => {
                // Find matching food item by id to get name
                const foodItem = food_list.find(f => f._id === item._id);
                const itemName = foodItem ? foodItem.name : "Unknown Item";
                return idx === order.items.length - 1 
                  ? `${itemName} x ${item.quantity}` 
                  : `${itemName} x ${item.quantity}, `;
              })}
            </p>
            <p>{currency}{order.amount}.00</p>
            <p>Items: {order.items.length}</p>
            <p><span>&#x25cf;</span> <b>{order.status}</b></p>
            <button onClick={fetchOrders}>Track Order</button>
          </div>
        ))}
      </div>
    </div>
  );
};


export default MyOrders;
