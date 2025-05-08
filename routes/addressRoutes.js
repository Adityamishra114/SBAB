import express from "express";
import { getAddressByPincode } from "../controllers/addressController.js";

const router = express.Router();
router.get("/address-by-pincode/:pincode", getAddressByPincode);

export default router;
