import mongoose from "mongoose";

const cardSchema = new mongoose.Schema(
  {
    cardNumber: { type: String, required: true },
    expiry: { type: String, required: true },
    cvv: { type: String, required: true },
  },
  { _id: false }
);

const upiSchema = new mongoose.Schema(
  {
    upiId: { type: String, required: true },
  },
  { _id: false }
);

const paymentSchema = new mongoose.Schema(
  {
    card: {
      type: cardSchema,
      required: function () {
        return !this.upi;
      },
    },
    upi: {
      type: upiSchema,
      required: function () {
        return !this.card;
      },
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);
