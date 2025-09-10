import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home/Home";
import LoginPopup from "./components/LoginPopup/LoginPopup";
import PlaceOrder from "./pages/PlaceOrder/PlaceOrder";
import Cart from "./pages/Cart/Cart";
import Verify from './pages/Verify/Verify'
import MyOrders from './pages/MyOrders/MyOrders'
import NotFound from './components/NotFound/NotFound'

// Import the context provider
import StoreContextProvider from "./Context/StoreContext";

const App = () => {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <StoreContextProvider>
      {showLogin && <LoginPopup setShowLogin={setShowLogin} />}
      <div className="app">
        <Navbar setShowLogin={setShowLogin} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order" element={<PlaceOrder />} />
          <Route path="/verify" element={<Verify/>}/>
          <Route path='/myorders' element={<MyOrders />}/>
          <Route path='*' element={<NotFound />}/>
        </Routes>
      </div>
      <Footer />
    </StoreContextProvider>
  );
};

export default App;
