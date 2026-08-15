const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const Customer = require("../models/customer");
const Organizer = require("../models/organizer");
const Event = require("../models/events");

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Signup = async (req, res) => {
  try {
    const { fullname, email, password, phoneNumber } = req.body;
    if (!fullname || !email || !password || !phoneNumber) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    if (!EMAIL_REGEX.test(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid email address" });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
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

    if (!EMAIL_REGEX.test(email)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "Invalid credentials" });
    }

    if (!user.password) {
      return res.status(400).json({
        success: false,
        message: "This account uses Google Sign-In. Continue with Google instead.",
      });
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

    const organizerRecord = await Organizer.findOne({ user: user._id });
    const hasEvents = await Event.exists({ organizer: user._id });

    return res.status(200).json({
      success: true,
      accessToken,
      user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
        role: user.role,
        number: user.number,
        isOrganizer: !!organizerRecord,
        hasEvents: !!hasEvents,
      },
    });
  } catch (error) {
    console.log("Unable to Login", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const GoogleAuth = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res
        .status(400)
        .json({ success: false, message: "Missing Google ID token" });
    }

    // Verify the token with Google directly rather than trusting client-supplied
    // identity fields — otherwise anyone could POST an arbitrary email and take
    // over (or create) that account.
    let payload;
    try {
      const verifyRes = await axios.get(
        "https://oauth2.googleapis.com/tokeninfo",
        { params: { id_token: idToken } }
      );
      payload = verifyRes.data;
    } catch {
      return res
        .status(401)
        .json({ success: false, message: "Invalid Google ID token" });
    }

    if (
      payload.aud !== process.env.GOOGLE_CLIENT_ID ||
      payload.email_verified !== "true" ||
      !payload.email
    ) {
      return res
        .status(401)
        .json({ success: false, message: "Google token verification failed" });
    }

    const email = payload.email;
    const fullname = payload.name;

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        fullname: fullname || email.split("@")[0],
        email,
        authProvider: "google",
      });
      await user.save();

      await Customer.create({
        user: user._id,
        email,
        role: "customer",
        fullname: user.fullname,
      });

      await Organizer.create({
        user: user._id,
        email,
        role: "organizer",
        fullname: user.fullname,
      });
    }

    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "2d",
    });

    const organizerRecord = await Organizer.findOne({ user: user._id });
    const hasEvents = await Event.exists({ organizer: user._id });

    return res.status(200).json({
      success: true,
      accessToken,
      user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
        role: user.role,
        isOrganizer: !!organizerRecord,
        hasEvents: !!hasEvents,
      },
    });
  } catch (error) {
    console.log("Unable to authenticate with Google", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = { Login, Signup, GoogleAuth };
