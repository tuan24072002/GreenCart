import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import {
    callbackMomo,
    checkTransactionMomo,
    confirmPaymentMomo,
    paymentMomo
} from "../controllers/payment.controller.js";

const paymentRouter = express.Router();

paymentRouter.post("/momo", protectRoute, paymentMomo);
paymentRouter.post("/momo/callback", callbackMomo);
paymentRouter.post("/momo/check-trans", protectRoute, checkTransactionMomo);
paymentRouter.post("/momo/confirm", protectRoute, confirmPaymentMomo);

export default paymentRouter;
