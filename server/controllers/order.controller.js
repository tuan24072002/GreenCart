import Order from "../models/order.model.js";
import Product from "../models/product.model.js";

export const placeOrderCOD = async (req, res) => {
    try {
        const { userId } = req.user;
        const { items, address } = req.body;
        if (!address || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid data"
            })
        }
        let amount = await items.reduce(async (acc, item) => {
            const product = await Product.findById(item.product);
            return (await acc) + product.offerPrice * item.quantity
        }, 0)

        amount += amount * 0.02; //Tax 2%

        await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: "COD",
        })

        res.status(201).json({
            success: true,
            message: "Order placed successfully!"
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}
export const placeOrderOnline = async (req, res) => {
    try {
        const { userId } = req.user;
        const { items, address } = req.body;
        if (!address || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid data"
            })
        }
        let amount = await items.reduce(async (acc, item) => {
            const product = await Product.findById(item.product);
            return (await acc) + product.offerPrice * item.quantity
        }, 0)

        amount += amount * 0.02; //Tax 2%

        const response = await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: "Online",
        })

        res.status(201).json({
            success: true,
            message: "Order placed successfully!",
            data: response
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}
export const getUserOrders = async (req, res) => {
    try {
        const { userId } = req.user;
        const orders = await Order
            .find({ userId })
            .populate("items.product address")
            .sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data: orders
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order
            .find({})
            .populate("items.product address")
            .sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data: orders
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}
export const generate1000Orders = async (req, res) => {
    const { userId } = req.user;
    const orders = [];
    const startDate = new Date("2010-01-01T00:00:00Z");
    const endDate = new Date("2025-12-31T23:59:59Z");

    for (let i = 0; i < 1000; i++) {
        const createdAt = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
        const updatedAt = new Date(createdAt.getTime() + Math.random() * (1000 * 60 * 60 * 24));

        const order = {
            userId,
            items: [
                {
                    product: "67fa5e300523f2d755ff0fa1",
                    quantity: Math.floor(Math.random() * 20) + 1, // số lượng từ 1 đến 20
                },
            ],
            amount: Math.floor(Math.random() * 1000000) + 10000, // số tiền từ 10.000 đến khoảng 1.010.000
            address: "67fb445cc11e111ce767f55f", // random address id
            status: "Order Placed",
            paymentType: Math.random() > 0.5 ? "Online" : "COD",
            isPaid: true,
            createdAt,
            updatedAt,
        };

        orders.push(order);
    }

    try {
        await Order.insertMany(orders);
        res.status(201).json({
            success: true,
            message: "Generated 1000 orders successfully!"
        })
    } catch (err) {
        console.error("Error inserting orders:", err);
        res.status(500).json({ success: false, message: error.message });
    }
}