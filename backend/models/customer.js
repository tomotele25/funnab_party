const mongoose = require("mongoose");

const customerSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  fullname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  role: {
    type: String,
    enum: ["admin", "customer", "organizer", "agent"],
    default: "customer",
  },
  phoneNumber: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Customer", customerSchema);
