require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const connectToDb = require("../db/db");
const allowedOrigins = ["http://localhost:3000"];

// routes
const authRoute = require("../routes/auth");
const organizerRoute = require("../routes/organizer");
const eventRoute = require("../routes/event-route");
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
