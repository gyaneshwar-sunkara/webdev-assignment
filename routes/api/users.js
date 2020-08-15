const express = require("express");
const router = express.Router();

// Auth middleware
const { auth } = require("../../middleware/auth");

// Permissions middleware
const { perms } = require("../../middleware/permissions");

// Token generator
const { token } = require("../../middleware/token");

// User controllers
const {
  Create,
  Read,
  Update,
  Delete,
  ReadAll,
} = require("../../controllers/users");

// @route   POST api/user
// @desc    Register new user
// @access  Public
router.post("/", Create, token);

// @route   GET api/user
// @desc    Get user data
// @access  Private
router.get("/", auth, Read);

// @route   GET api/user/all
// @desc    Get all users
// @access  Private
router.get("/all", auth, ReadAll);

// @route   PATCH api/user
// @desc    Update user data
// @access  Private
router.patch("/", auth, Update);

// @route   DELETE api/auth/user
// @desc    Remove user
// @access  Private
router.delete("/", auth, Delete);

module.exports = router;
