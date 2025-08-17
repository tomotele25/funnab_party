const express = require("express");
const {
  getTodaysEvents,
  getUpcomingEvent,
  getEventBySlug,
} = require("../controller/event-controller");
const router = express.Router();

router.get("/upcoming-event", getUpcomingEvent);
router.get("/todays-event", getTodaysEvents);
router.get("/events/:slug", getEventBySlug);
module.exports = router;
