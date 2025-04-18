import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];
        if (token) {
            try {
                const decodedToken = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);
                if (!decodedToken) {
                    return res.status(401).json({
                        success: false,
                        message: 'Unauthorized - Invalid token'
                    })
                }

                const response = await User.findById(decodedToken.userId).select(
                    "email"
                );

                req.user = {
                    email: response.email,
                    isSeller: response.isSeller,
                    userId: decodedToken.userId,
                };
                next();
            } catch (error) {
                if (error.message === "jwt expired") {
                    return res.status(401).json({ status: false, message: "Invalid access token!" })
                }
            }
        } else {
            return res
                .status(401)
                .json({ status: false, message: "Invalid access token!" });
        }
    } catch (error) {
        console.error(error);
        return res
            .status(401)
            .json({ status: false, message: "Invalid refresh token!" });
    }
};
export const protectRouteSeller = async (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];
        if (token) {
            try {
                const decodedToken = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);
                if (!decodedToken) {
                    return res.status(401).json({
                        success: false,
                        message: 'Unauthorized - Invalid token'
                    })
                }

                const response = await User.findById(decodedToken.userId).select(
                    "email isSeller"
                );

                if (response.isSeller) {
                    req.user = {
                        email: response.email,
                        isSeller: response.isSeller,
                        userId: decodedToken.userId,
                    };
                    next();
                } else {
                    return res.status(401).json(
                        {
                            status: false,
                            message: "This page is for sellers only!"
                        }
                    )
                }
            } catch (error) {
                if (error.message === "jwt expired") {
                    return res.status(401).json({ status: false, message: "Invalid access token!" })
                }
            }
        } else {
            return res
                .status(401)
                .json({ status: false, message: "Invalid access token!" });
        }
    } catch (error) {
        console.error(error);
        return res
            .status(401)
            .json({ status: false, message: "Invalid refresh token!" });
    }
};