import "./App.css";
import { Routes, Route } from "react-router-dom";

import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

import Products from "./pages/products/Products.jsx";
import About from "./pages/about/About.jsx";
import Home from "./pages/home/Home.jsx";
import Orders from "./pages/orders/Orders.jsx";

function App() {
  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/produtos" element={<Products />} />
        <Route path="/sobre" element={<About />} />
        <Route path="/encomendas" element={<Orders />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;