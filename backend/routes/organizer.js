const express = require("express");
const createEvent = require("../controller/organizer");
const router = express.Router();
const protect = require("../middleware/organizerAuth");
const upload = require("../middleware/upload");
router.post("/create-event", protect, upload.single("image"), createEvent);

module.exports = router;
