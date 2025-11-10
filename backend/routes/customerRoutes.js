import express from "express";

import {welcome, myVehicles, addVehicle, deleteVehicle, info, editFname, editLname} from "../controllers/customerController.js"
import { searchNearby, chooseSlot , activeBooking, Specificbooking, addbooking} from "../controllers/customerController.js"
import { checkAvailability, bookingHistory , cancelBooking } from "../controllers/customerController.js"
import {isAuthenticated} from "../controllers/authController.js"

const router = express.Router();

router.get("/welcome", isAuthenticated, welcome);
router.get("/profile/myVehicles", isAuthenticated, myVehicles);
router.post("/profile/myVehicles/add", isAuthenticated, addVehicle);
router.post("/profile/myVehicles/delete", isAuthenticated, deleteVehicle);
router.get("/profile/info", isAuthenticated, info);
router.post("/profile/info/editFname", isAuthenticated, editFname);
router.post("/profile/info/editLname", isAuthenticated, editLname);
router.post("/searchNearby", isAuthenticated,  searchNearby);
router.post("/chooseSlot", isAuthenticated, chooseSlot); 
router.get("/activeBooking", isAuthenticated, activeBooking);
router.get("/Specificbooking", isAuthenticated, Specificbooking);
router.post("/addbooking", isAuthenticated, addbooking); 
router.post("/checkAvailability", isAuthenticated, checkAvailability); 
router.get("/bookingHistory", isAuthenticated, bookingHistory);
router.get("/cancelBooking", isAuthenticated, cancelBooking);

export default router;