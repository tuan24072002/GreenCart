import express from 'express';
import {
    changePassword,
    isAuth,
    login,
    refreshToken,
    register,
    updateUser
} from '../controllers/user.controller.js';
import { protectRoute } from '../middlewares/auth.middleware.js';

const userRouter = express.Router();

userRouter.post('/register', register);
userRouter.post('/login', login);
userRouter.post('/refresh', refreshToken);
userRouter.get('/is-auth', protectRoute, isAuth);
userRouter.put('/update', protectRoute, updateUser);
userRouter.put('/change-password', protectRoute, changePassword);
export default userRouter