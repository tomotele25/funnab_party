const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Customer = require("../models/customer");
const Organizer = require("../models/organizer");
const Signup = async (req, res) => {
  try {
    const { fullname, email, password, phoneNumber } = req.body;
    if (!fullname || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: true, message: "User with this credential exists " });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullname,
      email,
      phoneNumber,
      password: hashedPassword,
    });

    await newUser.save();

    const newCustomer = new Customer({
      user: newUser._id,
      phoneNumber,
      email,
      role: "customer",
      fullname,
    });

    await newCustomer.save();

    const newOrganizer = new Organizer({
      user: newUser._id,
      phoneNumber,
      email,
      fullname,
      role: "organizer",
    });

    await newOrganizer.save();

    res
      .status(200)
      .json({ success: true, message: "Account created successfully" });
  } catch (error) {
    console.log("Error creating Account", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "2d",
    });

    return res.status(200).json({
      success: true,
      accessToken,
      user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
        role: user.role,
        number: user.number,
      },
    });
  } catch (error) {
    console.log("Unable to Login", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = { Login, Signup };
