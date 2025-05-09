import express from "express";
import {
  getAddressByPincode,
  createAddress,
} from "../controllers/addressController.js";

const router = express.Router();

router.get("/address-by-pincode/:pincode", getAddressByPincode);
router.post("/address", createAddress); 

export default router;
