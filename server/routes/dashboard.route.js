import express from 'express';
import { protectRouteSeller } from '../middlewares/auth.middleware.js';
import { summaryRevenue } from '../controllers/dashboard.controller.js';

const dashboardRouter = express.Router();

dashboardRouter.get("/summary", summaryRevenue);

export default dashboardRouter