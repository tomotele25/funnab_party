const express = require("express");
const { validateTicket } = require("../controller/scan-controller");
const { getTicketQR, lookupTickets } = require("../controller/ticket-controller");
const scanAuth = require("../middleware/scanAuth");

const router = express.Router();

router.post("/scan/validate", scanAuth, validateTicket);
router.get("/tickets/lookup", lookupTickets);
router.get("/tickets/:ticketId/qr", getTicketQR);

module.exports = router;
