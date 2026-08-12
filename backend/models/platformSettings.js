const mongoose = require("mongoose");

const platformSettingsSchema = new mongoose.Schema(
  {
    feeType: {
      type: String,
      enum: ["flat", "percentage", "hybrid"],
      default: "percentage",
    },
    percentageValue: {
      type: Number,
      default: 10,
    },
    flatValue: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("PlatformSettings", platformSettingsSchema);
