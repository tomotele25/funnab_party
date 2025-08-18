const express = require("express");
const {
  getTodaysEvents,
  getUpcomingEvent,
  getEventBySlug,
} = require("../controller/event-controller");
const { initializePayment } = require("../controller/transaction");
const router = express.Router();

router.get("/upcoming-event", getUpcomingEvent);
router.get("/todays-event", getTodaysEvents);
router.get("/events/:slug", getEventBySlug);
router.post("/payment/initialize", initializePayment);

module.exports = router;
