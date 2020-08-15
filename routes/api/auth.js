const express = require("express");
const router = express.Router();

// token generator
const { token } = require("../../middleware/token");

// @route   POST api/auth
// @desc    Authenticate user
// @access  Public
router.post("/", token);

module.exports = router;
