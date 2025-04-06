import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import { cn } from "./lib/utils";
import { Toaster } from "react-hot-toast";
import Footer from "./components/Footer";
import { useAppContext } from "./context/AppContext";
import Login from "./components/Login";
import React, { Suspense, useEffect, useRef, useState } from "react";
import LoadingPage from "./components/LoadingPage";

const Home = React.lazy(() => import("./pages/Home"));
const Products = React.lazy(() => import("./pages/Products"));
const ProductCategory = React.lazy(() => import("./pages/ProductCategory"));
const ProductDetail = React.lazy(() => import("./pages/ProductDetail"));
const Cart = React.lazy(() => import("./pages/Cart"));
const AddAddress = React.lazy(() => import("./pages/AddAddress"));
const MyOrders = React.lazy(() => import("./pages/MyOrders"));
const Contact = React.lazy(() => import("./pages/Contact"));
const Settings = React.lazy(() => import("./pages/Settings"));

const pageList = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/products",
    element: <Products />,
  },
  {
    path: "/products/:category",
    element: <ProductCategory />,
  },
  {
    path: "/products/:category/:id",
    element: <ProductDetail />,
  },
  {
    path: "/cart",
    element: <Cart />,
  },
  {
    path: "/add-address",
    element: <AddAddress />,
  },
  {
    path: "/my-orders",
    element: <MyOrders />,
  },
  {
    path: "/contact",
    element: <Contact />
  },
  {
    path: "/settings/*",
    element: <Settings />
  }
];

const App = () => {
  const location = useLocation();
  const isSellerPath = useLocation().pathname.includes("seller");
  const { showUserLogin } = useAppContext();
  const rootRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    window.scrollTo({ left: 0, top: 0, behavior: "smooth" });
  }, [location.pathname]);
  if (!isReady) {
    setTimeout(() => {
      setIsReady(true)
    }, 860)
    return (
      <>
        <LoadingPage />
      </>
    )
  }
  return (
    <Suspense fallback={<LoadingPage />}>
      <div className="flex flex-col min-h-screen relative bg-[#fff]" ref={rootRef}>
        {isSellerPath ? null : <Navbar />}
        <div className={cn(!isSellerPath && "px-6 md:px-16 lg:px-24 xl:px-32 flex-1")}>
          <Routes>
            {pageList.map(({ path, element }) => (
              <Route
                key={path}
                path={path}
                element={element}
              />
            ))}
          </Routes>
        </div>
        {isSellerPath ? null : <Footer />}
        {showUserLogin && <Login />}
        <Toaster />
      </div>
    </Suspense>
  )
}

export default App