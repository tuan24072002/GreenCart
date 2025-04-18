import "dotenv/config";
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import connectDB from "./configs/db.js";
import router from "./routes/index.js";
import morgan from "morgan";
import { errorHandler, routeNotFound } from "./middlewares/error.middleware.js";
import path from "path";

const app = express();
const port = process.env.PORT || 4000;
await connectDB();

//Allow multiple origins
const allowedOrigins = ["http://localhost:5173", process.env.FRONTEND_URL];
app.use(cors({
    origin: allowedOrigins,
    methods: ["POST", "PATCH", "GET", "PUT", "DELETE"],
    credentials: true
}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use("/api", router);
const __dirname = path.resolve();
app.use("/uploads/files", express.static(`${__dirname}/uploads/files`))
app.use(routeNotFound);
app.use(errorHandler);
app.get("/", (req, res) => {
    res.status(200).send("Hello World");
})
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
})