import Address from "../models/address.model.js";

export const addAddress = async (req, res) => {
    try {
        const { userId } = req.user;
        const { address } = req.body;
        await Address.create({ ...address, userId })
        res.status(201).json({
            success: true,
            message: "Address added successfully!"
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export const getAddress = async (req, res) => {
    try {
        const { userId } = req.user;
        const address = await Address.find({ userId });
        res.status(200).json({
            success: true,
            data: address
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export const chooseDefaultAddress = async (req, res) => {
    try {
        const { id } = req.body;
        const targetAddress = await Address.findById(id);
        if (!targetAddress) {
            return res.status(404).json({ success: false, message: "Address not found" });
        }
        await Address.updateMany(
            { userId: targetAddress.userId },
            { isDefault: false }
        );
        targetAddress.isDefault = true;
        await targetAddress.save();

        res.status(200).json({
            success: true,
            data: targetAddress,
            message: "Address updated successfully!"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export const removeAddress = async (req, res) => {
    try {
        const { id } = req.body;
        await Address.findByIdAndDelete(id);
        res.status(200).json({
            success: true,
            message: "Address removed successfully!"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}