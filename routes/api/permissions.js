const express = require("express");
const router = express.Router();

// Auth middleware
const { auth } = require("../../middleware/auth");

// Permissions middleware
const { perms } = require("../../middleware/permissions");

// User controllers
const { Read, Update, Delete } = require("../../controllers/permissions");

// @route   GET api/permissions
// @desc    Get user data
// @access  Private
router.get("/", auth, perms, Read);

// @route   PATCH api/permissions
// @desc    Update user data
// @access  Private
router.patch("/:id", auth, Update);

module.exports = router;
