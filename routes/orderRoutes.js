import express from "express";
import {
  createOrder,
  getOrderDetails,
} from "../controllers/orderController.js";

const router = express.Router();
router.post("/order", createOrder);
router.get("/order/:id", getOrderDetails);

export default router;
