const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
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
  password: {
    type: String,
    required: true,
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

module.exports = mongoose.model("User", userSchema);
