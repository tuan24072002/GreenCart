import { uploadImage } from "../lib/localStorage.js";
import Product from "../models/product.model.js";

export const productList = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const skip = (page - 1) * limit;

        const [products, total] = await Promise.all([
            Product
                .find({})
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 }),
            Product.countDocuments({ inStock: true })
        ])
        res.status(200).json({
            succes: true,
            data: {
                products,
                page,
                total
            },
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}
export const addProduct = async (req, res) => {
    try {
        let productData = JSON.parse(req.body.productData);
        const images = req.files;
        let imageUrl = images.map(item => uploadImage(item));

        await Product.create({ ...productData, rating: Math.floor(Math.random() * 5) + 1, image: imageUrl });

        res.status(200).json({
            success: true,
            message: "Product added successfully!"
        })
    } catch (error) {
        // console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}
export const productById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id)
        res.status(200).json({
            succes: true,
            data: product,
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}
export const changeStock = async (req, res) => {
    try {
        const { id, inStock } = req.body;

        await Product.findByIdAndUpdate({ _id: id }, { inStock });
        res.status(200).json({
            succes: true,
            message: "Stock updated successfully!"
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}