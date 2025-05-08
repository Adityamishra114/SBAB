import express from "express";
import {
  createPayment,
  getPaymentDetails,
} from "../controllers/paymentController.js";

const router = express.Router();

router.post("/payment", createPayment);
router.get("/payment/:id", getPaymentDetails);

export default router;
