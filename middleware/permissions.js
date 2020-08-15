// Permissions Model
const Perm = require("../models/permissions");

exports.perms = (req, res, next) => {
  Perm.findById(req.user.id).then((perms) => {
    if (!perms) {
      return res.status(400).json({ msg: "User Permissions not Found" });
    }
    const permsObject = perms.toObject();
    const permissions = Object.keys(permsObject).filter(
      (k) => permsObject[k] === true
    );
    req.user.perms = permissions;
    // Next middleware
    next();
  });
};
