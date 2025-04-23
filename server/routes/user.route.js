import express from 'express';
import {
    changePassword,
    isAuth,
    login,
    loginFacebook,
    loginGoogle,
    refreshToken,
    register,
    updateUser,
    verifyEmail
} from '../controllers/user.controller.js';
import { protectRoute } from '../middlewares/auth.middleware.js';

const userRouter = express.Router();

userRouter.post('/register', register);
userRouter.post('/login', login);
userRouter.post('/login-google', loginGoogle);
userRouter.post('/login-facebook', loginFacebook);
userRouter.post('/refresh', refreshToken);
userRouter.get('/is-auth', protectRoute, isAuth);
userRouter.post('/verify-email', protectRoute, verifyEmail);
userRouter.put('/update', protectRoute, updateUser);
userRouter.put('/change-password', protectRoute, changePassword);

export default userRouter