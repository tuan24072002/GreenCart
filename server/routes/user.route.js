import express from 'express';
import {
    changePassword,
    isAuth,
    login,
    loginFacebook,
    loginGoogle,
    refreshToken,
    register,
    resendVerifyEmail,
    sendVerifyCodeToChangePassword,
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
userRouter.post('/resend-verify-email', protectRoute, resendVerifyEmail);
userRouter.post('/send-code-change-password', protectRoute, sendVerifyCodeToChangePassword);
userRouter.put('/update', protectRoute, updateUser);
userRouter.put('/change-password', protectRoute, changePassword);

export default userRouter