const mongoose = require("mongoose");
const slugify = require("slugify");
const ticketSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  sold: {
    type: Number,
    default: 0,
  },
  deadline: {
    type: Date,
  },
});

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: { type: String, unique: true },
    details: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tickets: [ticketSchema],
    accountNumber: {
      type: String,
      required: true,
    },
    bankName: {
      type: String,
      required: true,
    },
    subaccountId: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

eventSchema.pre("save", function (next) {
  if (!this.isModified("title")) return next();
  this.slug = slugify(this.title, { lower: true, strict: true });
  next();
});

module.exports = mongoose.model("Event", eventSchema);
