import User from "../models/User.js";
import twilio from "twilio";
import dotenv from "dotenv";
dotenv.config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);
// Helper to simulate OTP generation and storage
const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// [GET] /users/identity-exist?contact=number
export const checkUserExists = async (req, res) => {
  try {
    const { contact } = req.query;
    if (!contact) {
      return res.status(400).json({ error: "Contact number is required." });
    }
    const userExists = await User.exists({ contact });

    res.json({ exists: !!userExists });
  } catch (error) {
    console.error("Error checking user existence:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

// [POST] /users
export const createUser = async (req, res) => {
  try {
    const { name, email, contact } = req.body;

    if (contact === process.env.TWILIO_PHONE_NUMBER) {
      return res.status(400).json({
        message: "Cannot send OTP to the Twilio phone number itself.",
      });
    }
    const otp = generateOtp();

    const user = await User.create({ name, email, contact, otp });

    await client.messages.create({
      body: `Your OTP is: ${otp}`,
      to: contact.startsWith("+") ? contact : `+91${contact}`,
      from: process.env.TWILIO_PHONE_NUMBER,
    });

    console.log(`OTP for ${contact}: ${otp}`);
    res.status(201).json({ message: "User created. OTP sent." });
  } catch (error) {
    console.error("Error creating user or sending OTP:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// [POST] /otp
export const sendOtp = async (req, res) => {
  try {
    const { contact } = req.body;
    if (!contact) {
      return res.status(400).json({ error: "Contact number is required" });
    }
    const otp = generateOtp();
    const user = await User.findOneAndUpdate(
      { contact },
      { otp },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    await client.messages.create({
      body: `Your OTP is: ${otp}`,
      to: contact.startsWith("+") ? contact : `+91${contact}`,
      from: process.env.TWILIO_PHONE_NUMBER,
    });

    console.log(`OTP for ${contact}: ${otp}`);
    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// [POST] /otp-verify
export const verifyOtp = async (req, res) => {
  const { contact, otp } = req.body;
  const user = await User.findOne({ contact });
  if (user && user.otp === otp) {
    // Fetch user details without OTP
    const userDetails = await User.findById(user._id).select("-otp");
    res.json({ success: true, userId: user._id, user: userDetails });
  } else {
    res.status(400).json({ success: false, message: "Invalid OTP" });
  }
};

// [GET] /users/:id
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-otp");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user); // <-- user details returned here
  } catch (error) {
    res.status(500).json({ error: "Internal server error." });
  }
};
