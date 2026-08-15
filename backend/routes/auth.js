const express = require("express");
const { Login, Signup, GoogleAuth } = require("../controller/auth");
const router = express.Router();

router.post("/signup", Signup);
router.post("/login", Login);
router.post("/google", GoogleAuth);

module.exports = router;
