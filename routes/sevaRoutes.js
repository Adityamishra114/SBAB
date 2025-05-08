import express from "express";
import { getAllSevas, getSevaByCode } from "../controllers/sevaController.js";

const router = express.Router();

router.get("/sevas", getAllSevas);
router.get("/sevas/:code", getSevaByCode);

export default router;
