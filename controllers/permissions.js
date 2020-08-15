// Permission Model
const Perm = require("../models/permissions");

// Roles Interface
const Role = require("../interfaces/roles");

// Read users permissions
exports.Read = (req, res) => {
  return res.json({
    perms: req.user.perms,
  });
};

// Update user permission
exports.Update = (req, res) => {};
