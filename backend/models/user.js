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
  },
  role: {
    type: String,
    enum: ["admin", "customer", "organizer", "agent"],
    default: "customer",
  },
  phoneNumber: {
    type: String,
  },
  authProvider: {
    type: String,
    enum: ["credentials", "google"],
    default: "credentials",
  },
});

module.exports = mongoose.model("User", userSchema);
