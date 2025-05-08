import Seva from "../models/Seva.js";

export const getAllSevas = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; 
    const limit = 10;
    const skip = (page - 1) * limit;

    const totalSevas = await Seva.countDocuments();
    const sevas = await Seva.find().skip(skip).limit(limit);

    return res.status(200).json({
      sevas,
      currentPage: page,
      totalPages: Math.ceil(totalSevas / limit),
      totalSevas,
    });
  } catch (error) {
    return res.status(500).json({ message: "Error retrieving sevas", error });
  }
};

export const getSevaByCode = async (req, res) => {
  try {
    const { code } = req.params;
    const seva = await Seva.findOne({ code });

    if (!seva) {
      return res.status(404).json({ message: "Seva not found" });
    }

    return res.status(200).json(seva);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error retrieving the seva", error });
  }
};
