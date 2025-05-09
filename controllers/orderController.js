import Address from "../models/Address.js";
import Seva from "../models/Seva.js";
import Order from "../models/Order.js";

// Create Order
export const createOrder = async (req, res) => {
  try {
    const { items, address, userId } = req.body; 
    if (!address || !items || !Array.isArray(items) || items.length === 0 || !userId) {
      return res.status(400).json({ message: "Address, items, and userId are required" });
    }

    // Fetch full address object
    const addressData = await Address.findById(address).lean();
    if (!addressData) {
      return res.status(400).json({ message: "Address not found or invalid" });
    }

    // Fetch full items array
    const itemsData = await Seva.find({ _id: { $in: items } }).lean();
    if (itemsData.length !== items.length) {
      return res.status(400).json({ message: "One or more Sevas are invalid" });
    }

    // Calculate total amount
    const amountToPay = itemsData.reduce(
      (total, item) =>
        total +
        (typeof item.discountedPrice === "number"
          ? item.discountedPrice
          : item.marketPrice),
      0
    );

    // Save full address and items inside order, and include userId
    const orderDoc = new Order({
      userId, // <-- add userId here
      items: itemsData,
      address: addressData,
      amount: amountToPay,
    });
    await orderDoc.save();

    res.status(201).json({
      orderId: orderDoc._id,
      paymentId: null,
      amountToPay,
      order: orderDoc,
    });
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get Order Details by ID (populated)
export const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id)
      .populate("items")
      .populate("address");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json(order);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// In your backend routes/controller
export const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 })
      .limit(3);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};
