import addressSlice from "@/slice/address/Address.slice";
import appSlice from "@/slice/app/App.slice";
import cartSlice from "@/slice/cart/Cart.slice";
import dashboardSlice from "@/slice/dashboard/Dashboard.slice";
import orderSlice from "@/slice/order/Order.slice";
import paymentSlice from "@/slice/payment/Payment.slice";
import productSlice from "@/slice/product/Product.slice";
import signinSlice from "@/slice/signin/Signin.slice";
import userSlice from "@/slice/user/User.slice";
import { combineReducers } from "@reduxjs/toolkit";

const rootReducer = combineReducers({
  app: appSlice,
  signin: signinSlice,
  product: productSlice,
  cart: cartSlice,
  address: addressSlice,
  order: orderSlice,
  payment: paymentSlice,
  dashboard: dashboardSlice,
  user: userSlice,
});
export default rootReducer;
