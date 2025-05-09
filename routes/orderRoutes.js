import express from "express";
import {
  createOrder,
  getOrderDetails,
  getUserOrders,
} from "../controllers/orderController.js";

const router = express.Router();
router.post("/order", createOrder);
router.get("/order/:id", getOrderDetails);
router.get("/user/:userId/orders", getUserOrders);

export default router;
