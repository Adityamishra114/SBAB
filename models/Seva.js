import mongoose from "mongoose";

const sevaSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    marketPrice: {
      type: Number,
      required: true,
    },
    discountedPrice: {
      type: Number,
      required: true,
    },
    start: {
      type: Date,
      required: true,
    },
    end: {
      type: Date,
      required: true,
    },
    amountRaised: {
      type: Number,
      required: true,
    },
    targetAmount: {
      type: Number,
      required: true,
    },
    media: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Seva = mongoose.model("Seva", sevaSchema);

export default Seva; 
