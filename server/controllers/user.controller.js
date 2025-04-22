import axios from "axios";
import { googleClient } from "../configs/google.js";
import User from "../models/user.model.js";
import { createAccessToken, createRefreshToken, verifyAccessToken } from "../utils/index.js";
import jwt from "jsonwebtoken";

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
        const user = await User.create({ name, email, password });

        if (user) {
            user.password = undefined;
            return res.status(201).json({
                success: true,
                data: user,
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
        if (!user?.password && user?.googleId) {
            return res.status(401).json({
                success: false,
                message: "This account was registered via Google. Please set a password before logging in with email!"
            })
        }
        const isMatch = user.comparePassword(password);
        if (user && isMatch) {
            user.password = undefined;
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
            user = await User.create({ name, email, googleId: sub })
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
            user = await User.findOneAndUpdate({ email }, { googleId: sub }, { new: true })
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
            user = await User.create({ name, email, facebookId: id });
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
            user = await User.findOneAndUpdate({ email }, { facebookId: id }, { new: true })
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
        const { password, newPassword } = req.body;
        const user = await User.findById(userId);

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