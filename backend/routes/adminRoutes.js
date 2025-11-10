import express from "express";

import {isAuthenticated} from "../controllers/authController.js"

import { welcome , info, adminList,  ownerInfo , ownerAreas , areaActiveBookings , areaBookingHistory , customerActiveBooking, customerBookingHistory} from "../controllers/adminControllers.js"
import { customerInfo, customerVehicles } from "../controllers/adminControllers.js"

const router = express.Router();

router.get("/welcome", isAuthenticated, welcome);
router.get("/profile/info", isAuthenticated, info);
router.get("/profile/adminList", isAuthenticated, adminList);
router.get("/ownerInfo", isAuthenticated, ownerInfo);
router.get("/ownerAreas", isAuthenticated, ownerAreas);
router.get("/areaActiveBookings", isAuthenticated, areaActiveBookings);
router.get("/areaBookingHistory", isAuthenticated, areaBookingHistory);
router.get("/customerInfo", isAuthenticated, customerInfo);
router.get("/customerVehicles", isAuthenticated, customerVehicles);
router.get("/customerActiveBooking", isAuthenticated, customerActiveBooking);
router.get("/customerBookingHistory", isAuthenticated, customerBookingHistory);

export default router;