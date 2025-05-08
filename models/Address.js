import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  addrLine1: {
    type: String,
    required: true,
  },
  addrLine2: {
    type: String,
  },
  pincode: {
    type: Number,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  type: {
    type: Number,
    required: false,
  },
  verified: {
    type: Boolean,
    default: false,
  },
});
const Address = mongoose.model("Address", addressSchema);
export default Address;
