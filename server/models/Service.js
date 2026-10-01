const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      enum: [
        "Periodic Maintenance",
        "Repair",
        "Inspection",
        "AC Service",
        "Tyre & Wheel",
        "Battery",
        "Cleaning",
        "Other",
      ],
      index: true,
    },

    description: {
      type: String,
      default: "",
    },

    basePrice: {
      type: Number,
      required: true,
      min: 0,
    },

    estimatedDuration: {
      type: Number,
      default: 60,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Service", serviceSchema);
