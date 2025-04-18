import express from 'express';
import { protectRoute, protectRouteSeller } from '../middlewares/auth.middleware.js';
import {
    placeOrderCOD,
    getAllOrders,
    getUserOrders,
    placeOrderOnline,
    generate1000Orders,
} from '../controllers/order.controller.js';

const orderRouter = express.Router();

orderRouter.post("/cod", protectRoute, placeOrderCOD);
orderRouter.post("/online", protectRoute, placeOrderOnline);
orderRouter.get("/user", protectRoute, getUserOrders);
orderRouter.get("/seller", protectRouteSeller, getAllOrders);
orderRouter.post("/generate1000Order", protectRouteSeller, generate1000Orders);
export default orderRouter