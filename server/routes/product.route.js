import express from 'express';
import {
    addProduct,
    changeStock,
    productById,
    productList
} from '../controllers/product.controller.js';
import { protectRouteSeller } from '../middlewares/auth.middleware.js';
import { upload } from '../configs/multer.js';
const productRouter = express.Router();

productRouter.post("/add", protectRouteSeller, upload.array(["images"]), addProduct);
productRouter.get("/list", productList);
productRouter.get("/:id", productById);
productRouter.put("/stock", protectRouteSeller, changeStock);

export default productRouter