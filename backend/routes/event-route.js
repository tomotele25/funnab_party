const express = require("express");
const {
  getTodaysEvents,
  getUpcomingEvent,
  getEventBySlug,
  getAllPublishedEvents,
} = require("../controller/event-controller");
const {
  getPaymentQuote,
  initializePayment,
  verifyPayment,
} = require("../controller/transaction");
const router = express.Router();

router.get("/upcoming-event", getUpcomingEvent);
router.get("/todays-event", getTodaysEvents);
router.get("/events", getAllPublishedEvents);
router.get("/events/:slug", getEventBySlug);
router.post("/payment/quote", getPaymentQuote);
router.post("/payment/initialize", initializePayment);
router.get("/payment/verify", verifyPayment);

module.exports = router;
