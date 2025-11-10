import express from "express";

import {isAuthenticated} from "../controllers/authController.js"

import {notifications, unreadNotificationCount } from "../controllers/usersController.js"

const router = express.Router();

router.get("/notifications", isAuthenticated, notifications);
router.get("/unreadNotificationCount", isAuthenticated, unreadNotificationCount);

export default router;