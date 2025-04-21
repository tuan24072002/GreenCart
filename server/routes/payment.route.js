import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import {
    callbackMomo,
    callbackZaloPay,
    checkTransactionMomo,
    confirmPaymentMomo,
    paymentMomo,
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
export default paymentRouter;
