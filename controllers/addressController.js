import Address from "../models/Address.js";

export const getAddressByPincode = async (req, res) => {
  const { pincode } = req.params;
  try {
    const address = await Address.findOne({ pincode: Number(pincode) }).select(
      "-_id -__v"
    );
    console.log("Database result:", address);
    if (!address) {
      return res
        .status(404)
        .json({ message: "Address not found for this pincode" });
    }
    // Only return city and state as required
    return res.status(200).json({
      city: address.city,
      state: address.state,
    });
  } catch (error) {
    console.error("Error in getAddressByPincode:", error);
    return res
      .status(500)
      .json({ message: "Error fetching address by pincode" });
  }
};

export const createAddress = async (req, res) => {
  try {
    const address = new Address(req.body);
    await address.save();
    res.status(201).json(address);
  } catch (error) {
    console.error("Error saving address:", error);
    res.status(500).json({ message: "Failed to save address" });
  }
};
