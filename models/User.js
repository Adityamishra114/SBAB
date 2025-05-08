import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  contact: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: function (v) {
        return /^\+[1-9]\d{1,14}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid Indian mobile number!`,
    },
  },
  otp: String,
});
const User = mongoose.model("User", userSchema);
export default User;
