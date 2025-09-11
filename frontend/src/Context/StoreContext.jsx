import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({});
  // const url = "http://localhost:4000";
  const url = "https://tomato-food-del-3r2x.vercel.app";
  const [token, setToken] = useState("");
  const [food_list, setFoodList] = useState([]);

  // Fetch all food items (no change needed)
  const fetchFoodList = async () => {
    const response = await axios.get(url + "/api/food/list");
    console.log(response.data.data)
    setFoodList(response.data.data);
  };

  // Load cart data from backend
  const loadCartData = async (tokenValue) => {
    try {
      const response = await axios.get(url + "/api/cart/get", {
        headers: { Authorization: `Bearer ${tokenValue}` }
      });
      setCartItems(response.data.cartData || {});
    } catch (err) {
      console.error("Error fetching cart data:", err);
    }
  };

  // When page loads, fetch food list and cart if logged in
  useEffect(() => {
    async function loadData() {
      await fetchFoodList();

      const localToken = localStorage.getItem("token");
      if (localToken) {
        setToken(localToken);
        await loadCartData(localToken);
      }
    }
    loadData();
  }, []);

  // On login (token change), reload cart
  useEffect(() => {
    if (token) {
      loadCartData(token);
    }
  }, [token]);

  // Add to cart (sync with backend, then update local state)
  const addToCart = async (itemId) => {
    if (!token) return; // Optionally handle guest cart logic here

    try {
      await axios.post(
        url + "/api/cart/add",
        { itemId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // After adding, reload cart from backend to ensure sync
      await loadCartData(token);
    } catch (err) {
      console.error("Error adding to cart in DB:", err);
    }
  };

  // Remove from cart (sync with backend, then update local state)
  const removeFromCart = async (itemId) => {
    if (!token) return; // Optionally handle guest cart logic here

    try {
      await axios.post(
        url + "/api/cart/remove",
        { itemId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // After removing, reload cart from backend to ensure sync
      await loadCartData(token);
    } catch (err) {
      console.error("Error removing cart item in DB:", err);
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        const itemInfo = food_list.find((p) => p._id === item);
        if (itemInfo) totalAmount += itemInfo.price * cartItems[item];
      }
    }
    return totalAmount;
  };

  const placeOrder = (deliveryData) => {
    console.log(deliveryData);
  };

  // Utility for cart badge: unique product count
  const getUniqueCartItemsCount = () => Object.keys(cartItems).length;

  // Optional: total quantity count
  const getTotalCartItemsCount = () =>
    Object.values(cartItems).reduce((a, b) => a + b, 0);

  const contextValue = {
    food_list,
    cartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    getUniqueCartItemsCount,
    getTotalCartItemsCount,
    placeOrder,
    url,
    token,
    setToken,
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
