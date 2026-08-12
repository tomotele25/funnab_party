const mongoose = require("mongoose");

const transactionSchema = mongoose.Schema(
  {
    eventId: {
      type: String,
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
    expectedAmount: {
      type: Number,
      required: true,
    },
    ticketType: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
    },
    paystackReference: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ["success", "failed", "pending", "refunded"],
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

transactionSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model("Transaction", transactionSchema);
