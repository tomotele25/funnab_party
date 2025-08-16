const express = require("express");
const { Login, Signup } = require("../controller/auth");
const router = express.Router();

router.post("/signup", Signup);
router.post("/login", Login);

module.exports = router;
