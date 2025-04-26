import axios from "axios";
import User from "../models/user.model.js";
import {
    createAccessToken,
    createRefreshToken,
    verifyAccessToken
} from "../utils/index.js";
import jwt from "jsonwebtoken";
import {
    sendPasswordResetEmail,
    sendResetSuccessEmail,
    sendVerificationEmail,
    sendVerificationEmailChangePassword,
    sendWelcomeEmail
} from "../nodemailer/send.email.js";
import crypto from "crypto"

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required!"
            })
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists!"
            })
        }
        //Random generate 6 digits as verification code
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
        const user = await User.create({
            name,
            email,
            password,
            verificationToken,
            verificationExpires: Date.now() + 24 * 60 * 60 * 1000
        });
        if (user) {
            await sendVerificationEmail(user.email, user.name, verificationToken);
            user.password = undefined;
            return res.status(201).json({
                success: true,
                data: {
                    user,
                    tokens: {
                        accessToken: createAccessToken(user),
                        refreshToken: createRefreshToken(user)
                    }
                },
                message: "Account registered successfully",
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required!"
            })
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password!"
            })
        }
        if (!user?.password && (user?.googleId || user?.facebookId)) {
            return res.status(401).json({
                success: false,
                message: `This account was registered via Google. Please set a password before logging in with ${(user?.googleId && !user?.facebookId) ? "Google" : (!user?.googleId && user?.facebookId) ? "Facebook" : "Google or Facebook"}`
            })
        }
        const isMatch = user.comparePassword(password);
        if (user && isMatch) {
            user.password = undefined;
            await User.findOneAndUpdate(
                { email },
                { lastLogin: new Date() },
                { new: true }
            )
            res.status(200).json({
                success: true,
                data: {
                    user,
                    tokens: {
                        accessToken: createAccessToken(user),
                        refreshToken: createRefreshToken(user)
                    }
                },
                message: "Login successful!"
            })
        } else {
            return res
                .status(401)
                .json({
                    success: false,
                    message: "Invalid email or password."
                });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}
export const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                message: "Refresh token is required!"
            })
        }
        try {
            const decodedRefreshToken = jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET)

            if (!decodedRefreshToken) {
                return res.status(401).json({
                    success: false,
                    message: 'Unauthorized - Invalid refresh token'
                })
            }
            const user = await User.findById(decodedRefreshToken.userId);
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: "User not found",
                });
            }
            if (decodedRefreshToken.tokenSecretVersion !== user.tokenSecretVersion) {
                return res.status(401).json({
                    success: false,
                    message: "Token is no longer valid!",
                });
            }
            user.updateTokenSecretVersion();
            await user.save();
            const newAccessToken = createAccessToken(user);
            const newRefreshToken = createRefreshToken(user);
            return res.status(200).json({
                success: true,
                data: {
                    tokens: {
                        accessToken: newAccessToken,
                        refreshToken: newRefreshToken,
                    }
                },
                message: "Token is refreshed successfully"
            })

        } catch (error) {
            if (error.message === "jwt expired") {
                return res.status(401).json({ success: false, message: "Refresh token is expired!" })
            }
        }
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}
export const loginGoogle = async (req, res) => {
    try {
        const { accessToken } = req.body;
        const payload = await verifyAccessToken(accessToken);

        const { email, name, sub } = payload;
        let user = await User.findOne({ email });
        if (!user) {
            user = await User.create({ name, email, googleId: sub, isVerified: true });
            await User.findOneAndUpdate(
                { email },
                { lastLogin: new Date() },
                { new: true }
            )
            await sendWelcomeEmail(user.email, user.name);
            return res.status(201).json({
                success: true,
                data: {
                    user: user,
                    tokens: {
                        accessToken: createAccessToken(user),
                        refreshToken: createRefreshToken(user)
                    }
                },
                message: "Email login successful!"
            })
        } else if (user && !user.googleId) {
            user = await User.findOneAndUpdate(
                { email },
                { googleId: sub, lastLogin: new Date() },
                { new: true }
            )
            return res.status(200).json({
                success: true,
                data: {
                    user: user,
                    tokens: {
                        accessToken: createAccessToken(user),
                        refreshToken: createRefreshToken(user)
                    }
                },
                message: "Email login successful!"
            })
        } else {
            user = await User.findOneAndUpdate(
                { email },
                { lastLogin: new Date() },
                { new: true }
            )
            return res.status(200).json({
                success: true,
                data: {
                    user: user,
                    tokens: {
                        accessToken: createAccessToken(user),
                        refreshToken: createRefreshToken(user)
                    }
                },
                message: "Email login successful!"
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}
export const loginFacebook = async (req, res) => {
    try {
        const { accessToken, userID } = req.body;
        const fbRes = await axios.get(
            `https://graph.facebook.com/v12.0/${userID}`,
            {
                params: {
                    access_token: accessToken,
                    fields: "id,name,email,picture",
                },
            }
        );
        const { id, name, email } = fbRes.data;
        let user = await User.findOne({ email });
        if (!user) {
            await User.create({
                name,
                email,
                facebookId: id,
                isVerified: true
            });
            user = await User.findOneAndUpdate(
                { email },
                { lastLogin: new Date() },
                { new: true }
            )
            await sendWelcomeEmail(user.email, user.name);
            return res.status(201).json({
                success: true,
                data: {
                    user: user,
                    tokens: {
                        accessToken: createAccessToken(user),
                        refreshToken: createRefreshToken(user)
                    }
                },
                message: "Facebook login successful!"
            });
        } else if (user && !user.facebookId) {
            user = await User.findOneAndUpdate(
                { email },
                { facebookId: id, lastLogin: new Date() },
                { new: true }
            )
            return res.status(200).json({
                success: true,
                data: {
                    user: user,
                    tokens: {
                        accessToken: createAccessToken(user),
                        refreshToken: createRefreshToken(user)
                    }
                },
                message: "Facebook login successful!"
            })
        } else {
            user = await User.findOneAndUpdate(
                { email },
                { lastLogin: new Date() },
                { new: true }
            )
            return res.status(200).json({
                success: true,
                data: {
                    user: user,
                    tokens: {
                        accessToken: createAccessToken(user),
                        refreshToken: createRefreshToken(user)
                    }
                },
                message: "Facebook login successful!"
            })
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}
export const verifyEmail = async (req, res) => {
    const { code } = req.body;
    try {
        if (!code) {
            return res.status(400).json({
                success: false,
                message: "Verification code is required!"
            })
        }
        const user = await User.findOne({
            verificationToken: code,
            verificationExpires: { $gt: Date.now() }
        });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired verification code!"
            })
        }
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationExpires = undefined;

        await user.save();
        await sendWelcomeEmail(user.email, user.name);
        return res.status(200).json({
            success: true,
            data: user,
            message: "Email verified successfully!"
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}
export const resendVerifyEmail = async (req, res) => {
    const { email } = req.body;
    try {
        if (!email) {
            throw new Error(`All fields are required`);
        }
        //Random generate 6 digits as verification code
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
        const user = await User.findOne({ email })
        user.verificationToken = verificationToken;
        user.verificationExpires = Date.now() + 60 * 60 * 1000; // 1 hour
        await user.save();
        await sendVerificationEmail(user.email, user.name, verificationToken);
        return res.status(201).json({
            success: true,
            message: 'Code sent to your email',
            user: {
                ...user._doc,
                password: undefined
            }
        });
    } catch (error) {
        console.log(`Error in resend verify email: `, error.message);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}
export const sendVerifyCodeToChangePassword = async (req, res) => {
    const { email } = req.body;
    try {
        if (!email) {
            throw new Error(`All fields are required`);
        }
        //Random generate 6 digits as verification code
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
        const user = await User.findOne({ email })
        user.verificationToken = verificationToken;
        user.verificationExpires = Date.now() + 60 * 60 * 1000; // 1 hour
        await user.save();
        await sendVerificationEmailChangePassword(user.email, user.name, verificationToken);
        return res.status(201).json({
            success: true,
            message: 'Code sent to your email',
            user: {
                ...user._doc,
                password: undefined
            }
        });
    } catch (error) {
        console.log(`Error in resend verify email: `, error.message);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}
export const isAuth = async (req, res) => {
    try {
        const { userId } = req.user;

        const user = await User.findById(userId).select("-password");
        return res.status(200).json({
            success: true,
            data: user
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}
export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'User not found'
            })
        }
        const resetToken = crypto.randomBytes(20).toString('hex');
        const resetExpiresAt = Date.now() + 60 * 60 * 1000; // 1 hour
        console.log({
            resetToken,
            resetExpiresAt
        });

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = resetExpiresAt;
        await user.save()

        //send mail
        const linkResetPassword = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`
        await sendPasswordResetEmail(email, user.name, linkResetPassword)

        return res.status(200).json({
            success: true,
            message: 'Password reset link sent to your email',
        });
    } catch (error) {
        console.log(`Error in forgot password: `, error.message);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}
export const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;
    try {
        if (!token || !password || !confirmPassword) {
            throw new Error(`All fields are required`);
        }
        if (confirmPassword !== password) {
            return res.status(400).json({
                success: false,
                message: 'Confirm password does not match'
            })
        }
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        })
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired reset token'
            })
        }

        //Update password
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save()
        await sendResetSuccessEmail(user.email, user.name);
        return res.status(200).json({
            success: true,
            message: 'Password reset successfully, redirecting to login page...',
        });
    } catch (error) {
        console.log(`Error in reset password: `, error.message);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}
export const updateUser = async (req, res) => {
    try {
        const { userId } = req.user;
        const { name } = req.body;
        const user = await User.findById(userId);
        user.name = name || user.name;
        await user.save();
        user.password = undefined;
        res.status(200).json({
            success: true,
            data: user,
            message: "User updated successfully!"
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}
export const changePassword = async (req, res) => {
    try {
        const { userId } = req.user;
        const { password, newPassword, code } = req.body;
        let user = await User.findById(userId);
        if (code) {
            if (code !== user.verificationToken) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid or expired verification code!"
                })
            } else {
                user = await User.findOne({
                    verificationToken: code,
                    verificationExpires: { $gt: Date.now() }
                });
                if (!user) {
                    return res.status(400).json({
                        success: false,
                        message: "Invalid or expired verification code!"
                    })
                }
                user.verificationToken = undefined;
                user.verificationExpires = undefined;
                await user.save();

                user.password = newPassword;
                await user.save();
                return res.status(200).json({
                    success: true,
                    message: "Password changed successfully!"
                })
            }
        }
        const isMatch = user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Current password is incorrect!"
            })
        }
        user.password = newPassword;
        await user.save();
        res.status(200).json({
            success: true,
            message: "Password changed successfully!"
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}