const express = require("express");
const adminOnly = require("../middleware/adminAuth");
const {
  listEvents,
  listOrganizers,
  listTransactions,
  getPlatformTotals,
  updateEventStatus,
  getPlatformSettings,
  updatePlatformSettings,
} = require("../controller/admin-controller");
const { initiateRefund } = require("../controller/refund-controller");

const router = express.Router();

router.get("/admin/events", adminOnly, listEvents);
router.patch("/admin/events/:id/status", adminOnly, updateEventStatus);
router.get("/admin/organizers", adminOnly, listOrganizers);
router.get("/admin/transactions", adminOnly, listTransactions);
router.post("/admin/transactions/:id/refund", adminOnly, initiateRefund);
router.get("/admin/totals", adminOnly, getPlatformTotals);
router.get("/admin/settings", adminOnly, getPlatformSettings);
router.put("/admin/settings", adminOnly, updatePlatformSettings);

module.exports = router;
