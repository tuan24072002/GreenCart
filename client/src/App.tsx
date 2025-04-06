import { Route, Routes, useLocation } from "react-router-dom"
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import { cn } from "./lib/utils";
import { Toaster } from "react-hot-toast";
import Footer from "./components/Footer";
import { useAppContext } from "./context/AppContext";
import Login from "./components/Login";
import Products from "./pages/Products";
import { useEffect, useRef } from "react";
import ProductCategory from "./pages/ProductCategory";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import AddAddress from "./pages/AddAddress";
import MyOrders from "./pages/MyOrders";
const App = () => {
  const location = useLocation();
  const isSellerPath = useLocation().pathname.includes("seller");
  const { showUserLogin } = useAppContext();
  const rootRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    window.scrollTo({ left: 0, top: 0, behavior: "smooth" });
  }, [location.pathname]);
  return (
    <div className="flex flex-col min-h-screen" ref={rootRef}>
      {isSellerPath ? null : <Navbar />}
      <div className={cn(!isSellerPath && "px-6 md:px-16 lg:px-24 xl:px-32 flex-1")}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:category" element={<ProductCategory />} />
          <Route path="/products/:category/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/add-address" element={<AddAddress />} />
          <Route path="/my-orders" element={<MyOrders />} />
        </Routes>
      </div>
      {isSellerPath ? null : <Footer />}
      {showUserLogin && <Login />}
      <Toaster />
    </div>
  )
}

export default App