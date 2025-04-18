import express from 'express';
import userRouter from "./user.route.js";
import productRouter from './product.route.js';
import cartRouter from './cart.route.js';
import addressRouter from './address.route.js';
import orderRouter from './order.route.js';
import paymentRouter from './payment.route.js';
import dashboardRouter from './dashboard.route.js';

const router = express.Router();

router.use("/user", userRouter);
router.use("/product", productRouter);
router.use("/cart", cartRouter);
router.use("/address", addressRouter);
router.use("/order", orderRouter);
router.use("/payment", paymentRouter);
router.use("/dashboard", dashboardRouter);

export default router