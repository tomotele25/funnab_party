require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const connectToDb = require("../db/db");
const allowedOrigins = ["http://localhost:3000"];

// routes
const authRoute = require("../routes/auth");

const PORT = 2005;
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

const startServer = async () => {
  try {
    await connectToDb();
    app.use("/api/auth", authRoute);
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
