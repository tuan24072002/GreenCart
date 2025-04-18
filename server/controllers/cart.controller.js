import User from "../models/user.model.js";

export const updateCart = async (req, res) => {
    try {
        const { userId } = req.user;
        const { cartItems } = req.body;
        await User.findByIdAndUpdate(userId, { cartItems });

        res.status(200).json({
            success: true,
            message: "Cart updated successfully!"
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}