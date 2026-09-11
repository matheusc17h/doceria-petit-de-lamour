import "./App.css";
import { Routes, Route } from "react-router-dom";

import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

import Products from "./pages/products/Products.jsx";
import About from "./pages/about/About.jsx";
import Home from "./pages/home/Home.jsx";
import Orders from "./pages/orders/Orders.jsx";
import Login from "./pages/auth/Login.jsx";
import ForgotPassword from "./pages/auth/ForgotPassword.jsx";
import Register from "./pages/auth/Register.jsx";
import Cart from "./pages/cart/Cart.jsx";
import MyOrders from "./pages/my-orders/MyOrders.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import NotFound from "./pages/not-found/NotFound.jsx";

function App() {
  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/produtos" element={<Products />} />
        <Route path="/sobre" element={<About />} />
        <Route path="/encomendas" element={<Orders />} />
        <Route path="/entrar" element={<Login />} />
        <Route path="/esqueci-senha" element={<ForgotPassword />} />
        <Route path="/cadastro" element={<Register />} />
        <Route path="/carrinho" element={<Cart />} />
        <Route path="/meus-pedidos" element={<MyOrders />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;
