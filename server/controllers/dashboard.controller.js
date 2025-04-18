import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";

export const summaryRevenue = async (req, res) => {
    const groupBy = req.query.groupBy || "month";
    const fromDate = req.query.fromDate ? new Date(req.query.fromDate) : new Date();
    const toDate = req.query.toDate ? new Date(req.query.toDate) : new Date();
    let dateFormat;
    switch (groupBy) {
        case "year":
            dateFormat = "%Y";
            break;
        case "day":
            dateFormat = "%d-%m-%Y";
            break;
        case "hour":
            dateFormat = "%H";
            break;
        case "minute":
            dateFormat = "%H:%M";
            break;
        case "second":
            dateFormat = "%H:%M:%S";
            break;
        case "month":
        default:
            dateFormat = "%b";
            break;
    }

    try {
        // summary
        const orders = await Order.countDocuments({ isPaid: true });
        const revenueAggregate = await Order.aggregate([
            { $match: { isPaid: true, createdAt: { $gte: fromDate, $lt: toDate } } },
            { $group: { _id: null, totalRevenue: { $sum: "$amount" } } },
        ])
        const revenue = (revenueAggregate.length > 0 && revenueAggregate[0].totalRevenue) || 0;
        const productsAggregate = await Product.aggregate([
            { $match: { inStock: true } },
            { $group: { _id: null, totalProducts: { $sum: 1 } } },
        ])
        const products = (productsAggregate.length > 0 && productsAggregate[0].totalProducts) || 0;
        const users = await User.countDocuments();

        //Graph Data
        const revenueData = await Order.aggregate([
            { $match: { isPaid: true, createdAt: { $gte: fromDate, $lt: toDate } } },
            {
                $group: {
                    _id: { $dateToString: { format: dateFormat, date: "$createdAt" } },
                    totalRevenue: { $sum: "$amount" },
                },
            },
            { $sort: { _id: 1 } },
        ]);
        const categories = revenueData.map((item) => item._id);
        const series = revenueData.map((item) => item.totalRevenue);

        res.status(200).json({
            success: true,
            data: {
                summary: { users, products, orders, revenue, },
                graphData: { categories, series }
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
}