import express from 'express';
import { protectRoute } from '../middlewares/auth.middleware.js';
import {
    addAddress,
    chooseDefaultAddress,
    getAddress,
    removeAddress
} from '../controllers/address.controller.js';

const addressRouter = express.Router();

addressRouter.post('/add', protectRoute, addAddress);
addressRouter.get('/get', protectRoute, getAddress);
addressRouter.put('/default', protectRoute, chooseDefaultAddress);
addressRouter.delete('/delete', protectRoute, removeAddress);

export default addressRouter;