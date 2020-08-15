const express = require("express");
const router = express.Router();

// Auth middleware
const { auth } = require("../../middleware/auth");

// Permissions middleware
const { perms } = require("../../middleware/permissions");

// User controllers
const { Read, Update } = require("../../controllers/permissions");

// @route   GET api/permissions
// @desc    Get user data (from token)
// @access  Private
router.get("/", auth, perms, Read);

// @route   GET api/permissions
// @desc    Get user data (from id)
// @access  Private
router.get("/:id", auth, Read);

// @route   PATCH api/permissions
// @desc    Update user data
// @access  Private
router.patch("/:id", auth, Update);

module.exports = router;
