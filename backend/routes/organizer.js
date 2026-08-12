const express = require("express");
const {
  createEvent,
  getMyEvents,
  addEventStaff,
  listEventStaff,
} = require("../controller/organizer");
const router = express.Router();
const protect = require("../middleware/organizerAuth");
const upload = require("../middleware/upload");
router.post("/create-event", protect, upload.single("image"), createEvent);
router.get("/my-events", protect, getMyEvents);
router.post("/event-staff", protect, addEventStaff);
router.get("/event-staff/:eventId", protect, listEventStaff);

module.exports = router;
