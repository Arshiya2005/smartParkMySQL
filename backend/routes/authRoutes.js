import express from "express";

import { register, login, logout, ensureAuthenticated } from "../controllers/authController.js"
import {protectSignupMiddleware} from "../lib/arcjet.js"

const router = express.Router();

router.post("/register", protectSignupMiddleware, register);
router.get("/logout", logout);
router.post("/login", login);
router.get("/verify", ensureAuthenticated);


export default router;
