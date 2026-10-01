const Mechanic = require("../models/Mechanic");

const getMechanics = async (req, res) => {
  try {
    const mechanics = await Mechanic.find()
      .populate("currentBooking", "bookingId status amount bookingDate")
      .populate("lastBooking", "bookingId status amount bookingDate")
      .sort({ name: 1 });

    res.json({
      success: true,
      data: mechanics,
    });
  } catch (error) {
    console.error("Mechanics error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch mechanics",
      error: error.message,
    });
  }
};

module.exports = {
  getMechanics,
};