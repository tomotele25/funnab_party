const express = require("express");
const {
  getTodaysEvents,
  getUpcomingEvent,
} = require("../controller/event-controller");
const router = express.Router();

router.get("/upcoming-event", getUpcomingEvent);
router.get("/todays-event", getTodaysEvents);

module.exports = router;
