import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import {
    callbackMomo,
    callbackVNPay,
    callbackZaloPay,
    checkTransactionMomo,
    confirmPaymentMomo,
    paymentMomo,
    paymentVNPay,
    paymentZaloPay
} from "../controllers/payment.controller.js";

const paymentRouter = express.Router();
// Momo
paymentRouter.post("/momo", protectRoute, paymentMomo);
paymentRouter.post("/momo/callback", callbackMomo);
paymentRouter.post("/momo/check-trans", protectRoute, checkTransactionMomo);
paymentRouter.post("/momo/confirm", protectRoute, confirmPaymentMomo);
// ZaloPay
paymentRouter.post("/zalopay", protectRoute, paymentZaloPay);
paymentRouter.post("/zalopay/callback", callbackZaloPay);

// VNPay
paymentRouter.get("/vnpay", protectRoute, paymentVNPay);
paymentRouter.get("/vnpay/callback", callbackVNPay);

export default paymentRouter;
