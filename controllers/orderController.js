import Address from "../models/Address.js";
import Seva from "../models/Seva.js";
import Order from "../models/Order.js";

// Create Order
export const createOrder = async (req, res) => {
  try {
    const { items, address, payment } = req.body;
    if (!address || !items || !Array.isArray(items) || items.length === 0) {
      return res
        .status(400)
        .json({ message: "Address and items are required" });
    }
    const addressData = await Address.findById(address);
    if (!addressData) {
      return res.status(400).json({ message: "Address not found or invalid" });
    }
    const itemsData = await Seva.find({ _id: { $in: items } });
    if (itemsData.length !== items.length) {
      return res.status(400).json({ message: "One or more Sevas are invalid" });
    }
    const amountToPay = itemsData.reduce(
      (total, item) => total + item.price,
      0
    );

    const orderDoc = new Order({
      items,
      address,
      payment: payment || undefined,
      amount: amountToPay,
    });
    await orderDoc.save();

    // Populate all details for the response
    const populatedOrder = await Order.findById(orderDoc._id)
      .populate("items")
      .populate("address")
      .populate("payment");

    res.status(201).json({
      orderId: orderDoc._id,
      amountToPay,
      order: populatedOrder, // <-- all details inside order object
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
