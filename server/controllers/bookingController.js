const Booking = require("../models/Booking");
require("../models/Customer");
require("../models/Mechanic");
require("../models/Service");

const getBookings = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = "",
      status = "",
      sortBy = "bookingDate",
      sortOrder = "desc",
    } = req.query;

    const pageNumber = Math.max(Number(page), 1);
    const limitNumber = Math.min(Math.max(Number(limit), 1), 100);

    const query = {};

    if (status) {
      query.status = status;
    }

    if (search) {
      query.bookingId = {
        $regex: search,
        $options: "i",
      };
    }

    const sort = {
      [sortBy]: sortOrder === "asc" ? 1 : -1,
    };

    const totalBookings = await Booking.countDocuments(query);

    const bookings = await Booking.find(query)
      .populate("customer", "name email phone")
      .populate("mechanic", "name status specialization")
      .populate("service", "name category")
      .sort(sort)
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    res.json({
      success: true,
      data: bookings,
      pagination: {
        currentPage: pageNumber,
        totalPages: Math.ceil(totalBookings / limitNumber),
        totalBookings,
        limit: limitNumber,
      },
    });
  } catch (error) {
    console.error("Bookings error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
      error: error.message,
    });
  }
};

const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      bookingId: req.params.id,
    })
      .populate("customer", "name email phone address")
      .populate("mechanic", "name phone email status specialization")
      .populate("service", "name category description basePrice estimatedDuration");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error("Booking details error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch booking",
      error: error.message,
    });
  }
};

module.exports = {
  getBookings,
  getBookingById,
};