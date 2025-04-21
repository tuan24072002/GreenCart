import jwt from "jsonwebtoken";

export const createAccessToken = (user) => {
    return jwt.sign(
        { userId: user._id, tokenSecretVersion: user.tokenSecretVersion },
        process.env.JWT_ACCESS_TOKEN_SECRET,
        { expiresIn: '5h' }
    );
};

export const createRefreshToken = (user) => {
    return jwt.sign(
        { userId: user._id, tokenSecretVersion: user.tokenSecretVersion },
        process.env.JWT_REFRESH_TOKEN_SECRET,
        { expiresIn: '3h' }
    );
};