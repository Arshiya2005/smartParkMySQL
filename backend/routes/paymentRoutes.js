import express from "express";

import {isAuthenticated} from "../controllers/authController.js"

import { createOrder, verifyPayment } from "../controllers/paymentController.js"

const router = express.Router();

router.post("/createOrder", isAuthenticated, createOrder);
router.post("/verifyPayment", isAuthenticated, verifyPayment);

export default router;