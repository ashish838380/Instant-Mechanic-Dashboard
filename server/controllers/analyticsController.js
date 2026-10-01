const Booking = require("../models/Booking");

const getAnalytics = async (req, res) => {
  try {
    const bookingTrend = await Booking.aggregate([
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$bookingDate",
            },
          },
          bookings: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);

    const revenueTrend = await Booking.aggregate([
      {
        $match: {
          status: "Completed",
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$bookingDate",
            },
          },
          revenue: {
            $sum: "$amount",
          },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);

    const statusBreakdown = await Booking.aggregate([
      {
        $group: {
          _id: "$status",
          count: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          count: -1,
        },
      },
    ]);

    const serviceBreakdown = await Booking.aggregate([
      {
        $lookup: {
          from: "services",
          localField: "service",
          foreignField: "_id",
          as: "serviceData",
        },
      },
      {
        $unwind: "$serviceData",
      },
      {
        $group: {
          _id: "$serviceData.category",
          bookings: {
            $sum: 1,
          },
          revenue: {
            $sum: "$amount",
          },
        },
      },
      {
        $sort: {
          bookings: -1,
        },
      },
    ]);

    res.json({
      success: true,
      data: {
        bookingTrend,
        revenueTrend,
        statusBreakdown,
        serviceBreakdown,
      },
    });
  } catch (error) {
    console.error("Analytics error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch analytics",
      error: error.message,
    });
  }
};

module.exports = {
  getAnalytics,
};