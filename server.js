import express from "express";
import cors from "cors";
import { connectDB } from "./config/DB.js";
import "dotenv/config";
import userRoutes from "./routes/userRoutes.js";
import sevaRoutes from "./routes/sevaRoutes.js";
import addressRoutes from "./routes/addressRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

// app config
const app = express();
const PORT = process.env.PORT || 5000;
//middleware
app.use(express.json());
app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));

const CLIENT_URL =
  process.env.NODE_ENV === "production"
    ? process.env.CLIENT_URL_PROD
    : process.env.CLIENT_URL_DEV;

app.use(
  cors({
    origin: CLIENT_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
console.log(`CORS Origin: ${CLIENT_URL}`);
app.options("*", cors());

// db connection
connectDB();
app.get("/", (req, res) => {
  res.send("server start");
});
app.use("/api", userRoutes);
app.use("/api", sevaRoutes);
app.use("/api", addressRoutes);
app.use("/api", orderRoutes);
app.use("/api", paymentRoutes);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
