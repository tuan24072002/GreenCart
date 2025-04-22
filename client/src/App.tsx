import { Route, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import { cn } from "./lib/utils";
import { Toaster } from "react-hot-toast";
import Footer from "./components/Footer";
import Login from "./components/Login";
import React, { Suspense, useEffect, useRef, useState } from "react";
import LoadingPage from "./components/LoadingPage";
import i18next, { use } from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLanguageData } from "./utils/languages";
import { HttpService } from "./services/http/HttpService";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { setLanguage } from "./slice/app/App.slice";

const Home = React.lazy(() => import("./pages/Home"));
const Products = React.lazy(() => import("./pages/Products"));
const ProductCategory = React.lazy(() => import("./pages/ProductCategory"));
const ProductDetail = React.lazy(() => import("./pages/ProductDetail"));
const Cart = React.lazy(() => import("./pages/Cart"));
const AddAddress = React.lazy(() => import("./pages/AddAddress"));
const MyOrders = React.lazy(() => import("./pages/MyOrders"));
const Contact = React.lazy(() => import("./pages/Contact"));
const Settings = React.lazy(() => import("./pages/Settings"));
const SellerLayout = React.lazy(() => import("./pages/seller/SellerLayout"));
const Dashboard = React.lazy(() => import("./pages/seller/Dashboard"));
const AddProduct = React.lazy(() => import("./pages/seller/AddProduct"));
const Orders = React.lazy(() => import("./pages/seller/Orders"));
const ProductList = React.lazy(() => import("./pages/seller/ProductList"));
const ResultPayment = React.lazy(() => import("./components/payment/ResultPayment"));

const App = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const clearLayout = ["redirectUrl", "seller"].includes(location.pathname.split("/")[1]);
  const appState = useAppSelector(state => state.app);
  const authState = useAppSelector(state => state.auth);
  const rootRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);

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
    },
    //Seller page
    {
      path: "/seller",
      element: <SellerLayout />
    },
    //Payment result
    {
      path: "/redirectUrl/:paymentMethod",
      element: <ResultPayment />
    },
  ];

  use(initReactI18next).init({
    lng: localStorage.getItem('language') ?? 'vi',
    resources: {
      en: {
        translation: getLanguageData('en')
      },
      vi: {
        translation: getLanguageData('vi')
      }
    }
  })
  i18next.on("languageChanged", (lang_code: string) => {
    dispatch(setLanguage(lang_code));
    localStorage.setItem('language', lang_code);
  });
  HttpService.initialize();
  useEffect(() => {
    window.scrollTo({ left: 0, top: 0, behavior: "smooth" });
  }, [location.pathname]);
  if (isReady) {
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
      <div className="flex flex-col min-h-screen relative bg-background transition-all duration-300" ref={rootRef}>
        {clearLayout ? null : <Navbar />}
        <div className={cn(!clearLayout && "px-6 md:px-16 lg:px-24 xl:px-32 flex-1")}>
          <Routes>
            {pageList.map(({ path, element }) => {
              if (path === "/seller") {
                return (
                  <Route
                    key={path}
                    path={path}
                    element={element}
                  >
                    <Route index element={appState.user?.isSeller ? <Dashboard /> : null} />
                    <Route path={"add-product"} element={appState.user?.isSeller ? <AddProduct /> : null} />
                    <Route path={"product-list"} element={appState.user?.isSeller ? <ProductList /> : null} />
                    <Route path={"orders"} element={appState.user?.isSeller ? <Orders /> : null} />
                  </Route>
                )
              }
              return (
                <Route
                  key={path}
                  path={path}
                  element={element}
                />
              )
            })}
          </Routes>
        </div>
        {clearLayout ? null : <Footer />}
        {authState.showUserLogin && <Login />}
        <Toaster />
      </div>
    </Suspense>
  )
}

export default App