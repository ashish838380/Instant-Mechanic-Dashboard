const mongoose = require("mongoose");

const mechanicSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    specialization: {
      type: String,
      default: "General Service",
    },

    status: {
      type: String,
      enum: ["Available", "Busy", "Offline"],
      default: "Available",
      index: true,
    },

    jobsCompleted: {
      type: Number,
      default: 0,
    },

    currentBooking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      default: null,
    },

    lastBooking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Mechanic", mechanicSchema);