import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar'; // Adjust the path as necessary
import Home from './pages/Home'; // Adjust the path as necessary
import Cart from './pages/Cart'; // Adjust the path as necessary
import BecomeSeller from './pages/BecomeSeller'; // Adjust the path as necessary
import Login from './pages/Login'; // Adjust the path as necessary
import Profile from './pages/Profile'; // Adjust the path as necessary
import ProductPage from './pages/ProductsPage'; // Import the product listing page
import ProductDetailPage from './pages/ProductDetailPage'; // Import the product detail page

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/become-seller" element={<BecomeSeller />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        
        {/* Product routes */}
        <Route path="/products" element={<ProductPage />} />  {/* Product listing page */}
        <Route path="/product/:productName" element={<ProductDetailPage />} />  {/* Product detail page */}
      </Routes>
    </Router>
  );
};

export default App;









