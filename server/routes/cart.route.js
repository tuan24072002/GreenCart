import express from 'express';
import { protectRoute } from '../middlewares/auth.middleware.js';
import { updateCart } from '../controllers/cart.controller.js';

const cartRouter = express.Router();
cartRouter.post('/update', protectRoute, updateCart)

export default cartRouter