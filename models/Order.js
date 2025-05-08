import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    items: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Seva", required: true },
    ],
    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      required: true,
    },
    payment: { type: mongoose.Schema.Types.ObjectId, ref: "Payment" },
    amount: { type: Number, required: true },
    status: { type: String, default: "placed" },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
