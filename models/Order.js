import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    items: [
      { type: Object, required: true }, 
    ],
    address: {
      type: Object, 
      required: true,
    },
    amount: { type: Number, required: true },
    status: { type: String, default: "placed" },
    userId: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
