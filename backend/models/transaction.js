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
    ticketSubtotal: {
      type: Number,
      default: 0,
    },
    serviceFee: {
      type: Number,
      default: 0,
    },
    gatewayFee: {
      type: Number,
      default: 0,
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
        gatewayFee: Number,
      },
      default: {},
    },
    customFieldResponses: {
      type: [{ label: String, value: String }],
      default: [],
    },
    payoutStatus: {
      type: String,
      enum: ["unpaid", "paid"],
      default: "unpaid",
    },
    payout: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payout",
    },
  },
  { timestamps: true }
);

transactionSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model("Transaction", transactionSchema);
