require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/user");

const [, , email, password, fullname] = process.argv;

if (!email || !password) {
  console.error(
    "Usage: node scripts/create-admin.js <email> <password> [fullname]"
  );
  process.exit(1);
}

(async () => {
  await mongoose.connect(process.env.DB_URL);

  const hashedPassword = await bcrypt.hash(password, 10);
  const existing = await User.findOne({ email });

  if (existing) {
    existing.role = "admin";
    await existing.save();
    console.log(`Promoted existing user ${email} to role "admin".`);
  } else {
    await User.create({
      fullname: fullname || "Admin",
      email,
      password: hashedPassword,
      phoneNumber: "0000000000",
      role: "admin",
    });
    console.log(`Created new admin user ${email}.`);
  }

  await mongoose.disconnect();
})().catch((err) => {
  console.error("Failed to create admin:", err.message);
  process.exit(1);
});
