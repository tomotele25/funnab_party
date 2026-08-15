const mongoose = require("mongoose");

const purchasedTicketSchema = new mongoose.Schema(
  {
    ticketId: {
      type: String,
      required: true,
      unique: true,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    buyerName: {
      type: String,
      required: true,
    },
    buyerEmail: {
      type: String,
      required: true,
    },
    ticketType: {
      type: String,
      required: true,
    },
    pricePaid: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["valid", "used", "cancelled"],
      default: "valid",
    },
    paymentRef: {
      type: String,
      required: true,
    },
    qrToken: {
      type: String,
      required: true,
      unique: true,
    },
    qrSignature: {
      type: String,
      required: true,
    },
    scannedAt: {
      type: Date,
    },
    scannedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    customFieldResponses: {
      type: [{ label: String, value: String }],
      default: [],
    },
  },
  { timestamps: true }
);

purchasedTicketSchema.index({ buyerEmail: 1 });

module.exports = mongoose.model("PurchasedTicket", purchasedTicketSchema);
