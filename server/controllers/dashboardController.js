const Booking = require("../models/Booking");
const Customer = require("../models/Customer");
const Mechanic = require("../models/Mechanic");

const getDashboardStats = async (req, res) => {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const [
      totalBookings,
      todayBookings,
      completedBookings,
      pendingBookings,
      cancelledBookings,
      activeMechanics,
      newCustomers,
      revenueResult,
    ] = await Promise.all([
      Booking.countDocuments(),

      Booking.countDocuments({
        bookingDate: {
          $gte: startOfToday,
          $lte: endOfToday,
        },
      }),

      Booking.countDocuments({
        status: "Completed",
      }),

      Booking.countDocuments({
        status: "Pending",
      }),

      Booking.countDocuments({
        status: "Cancelled",
      }),

      Mechanic.countDocuments({
        status: {
          $in: ["Available", "Busy"],
        },
      }),

      Customer.countDocuments({
        createdAt: {
          $gte: startOfToday,
          $lte: endOfToday,
        },
      }),

      Booking.aggregate([
        {
          $match: {
            status: "Completed",
          },
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: "$amount",
            },
          },
        },
      ]),
    ]);

    const totalRevenue =
      revenueResult.length > 0 ? revenueResult[0].total : 0;

    res.json({
      success: true,
      data: {
        totalBookings,
        todayBookings,
        completedBookings,
        pendingBookings,
        cancelledBookings,
        totalRevenue,
        activeMechanics,
        newCustomers,
      },
    });
  } catch (error) {
    console.error("Dashboard error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics",
      error: error.message,
    });
  }
};

module.exports = {
  getDashboardStats,
};