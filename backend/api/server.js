require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const app = express();
const connectToDb = require("../db/db");
const allowedOrigins = [
  "http://localhost:3000",
  "http://192.168.100.25:3000",
  "https://funnabparty.vercel.app",
  "https://funaabparty.com",
  "https://www.funaabparty.com",
];

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many attempts. Please try again later." },
});

const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many requests. Please try again later." },
});

// routes
const authRoute = require("../routes/auth");
const organizerRoute = require("../routes/organizer");
const eventRoute = require("../routes/event-route");
const scanRoute = require("../routes/scan-route");
const adminRoute = require("../routes/admin-route");
const PORT = 2005;
app.use(helmet());

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Origin not allowed"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/auth", authLimiter);
app.use("/api/payment", paymentLimiter);

app.get("/", (req, res) => {
  console.log("Test route hit");
  res.send("Hello world!");
});

const startServer = async () => {
  try {
    await connectToDb();

    // routes
    app.use("/api/auth", authRoute);
    app.use("/api", organizerRoute);
    app.use("/api", eventRoute);
    app.use("/api", scanRoute);
    app.use("/api", adminRoute);

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ DB connection failed:", error.message);
    process.exit(1);
  }
};

startServer();

module.exports = app;
