// Permission Model
const Perm = require("../models/permissions");

// Roles Interface
const Role = require("../interfaces/roles");

// Read users permissions
exports.Read = (req, res) => {
  if (req.params.id) {
    if (req.user.role === Role.Admin) {
      Perm.findById(req.params.id).then((perms) => {
        return res.json({ perms });
      });
    } else {
      return res.status(403).json({ msg: "Forbidden" });
    }
  } else {
    return res.json({
      perms: req.user.perms,
    });
  }
};

// Update user permission
exports.Update = (req, res) => {
  if (req.params.id) {
    if (req.user.role === Role.Admin) {
      Perm.findById(req.params.id).then((perms) => {
        if (!perms) return res.status(400).json({ msg: "User does not exist" });

        perms.AccessGreenButton =
          req.body.AccessGreenButton !== null
            ? req.body.AccessGreenButton
            : perms.AccessGreenButton;
        perms.save((err) => {
          return res.json({ perms });
        });
      });
    } else {
      return res.status(403).json({ msg: "Forbidden" });
    }
  }
};
