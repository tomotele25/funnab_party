const mongoose = require("mongoose");

const transactionSchema = mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organizer",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    paystackRefrence: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ["success", "failed", "pending"],
      default: "pending",
    },
    splitDetails: {
      type: {
        organizerAmount: Number,
        platformFee: Number,
      },
      default: {},
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);
