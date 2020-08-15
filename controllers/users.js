const bcrypt = require("bcryptjs");
const debug = require("debug")("webdev:users");

// User Model
const User = require("../models/users");
// Permission Model
const Perm = require("../models/permissions");

// Roles Interface
const Role = require("../interfaces/roles");

// Create a new user
exports.Create = (req, res, next) => {
  const { firstname, lastname, email, role, password } = req.body;

  // Validation
  if (!firstname || !lastname || !email || !role || !password) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }

  // Check for existing user
  User.findOne({ email })
    .then((user) => {
      if (user) return res.status(400).json({ msg: "Email already exists" });

      // Create new user
      const newUser = new User({
        firstname,
        lastname,
        email,
        role,
        password,
      });

      // Generate salt
      bcrypt.genSalt(10, (err, salt) => {
        // Create hash for password
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) {
            debug(err);
            return res.status(400).json({ msg: "Unexpected Error" });
          }
          newUser.password = hash;
          // Save new user
          newUser
            .save()
            .then((user) => {
              // Add permissions to user
              const newPerm = new Perm({
                _id: user.id,
                role: user.role,
                AccessRedButton: user.role === Role.Admin ? true : false,
              });
              // Save permissions
              newPerm.save().then((perms) => {
                // Next middleware
                next();
              });
            })
            .catch((err) => {
              debug(err);
              return res.status(400).json({ msg: "Unexpected Error" });
            });
        });
      });
    })
    .catch((err) => {
      debug(err);
      return res.status(400).json({ msg: "Unexpected Error" });
    });
};

// Read a user
exports.Read = (req, res) => {
  // Check for existing user
  User.findById(req.user.id)
    .select("-_id -password -__v")
    .then((user) => {
      if (!user) return res.status(400).json({ msg: "User does not exist" });
      res.json({ user, msg: "OK" });
    })
    .catch((err) => {
      debug(err);
      return res.status(400).json({ msg: "Unexpected Error" });
    });
};

// Update a user
exports.Update = (req, res) => {
  // Check for existing user
  User.findById(req.user.id)
    .then((user) => {
      if (!user) return res.status(400).json({ msg: "User does not exist" });

      // Check if fields are changed
      const firstname = req.body.firstname
        ? req.body.firstname
        : user.firstname;
      const lastname = req.body.lastname ? req.body.lastname : user.lastname;

      if (firstname !== user.firstname || lastname !== user.lastname) {
        user.firstname = firstname;
        user.lastname = lastname;
        user.save((err) => {
          if (err) {
            debug(err);
            return res.status(400).json({ msg: "Unexpected Error" });
          }
          const { firstname, lastname, email, date } = user;
          res.json({ user: { firstname, lastname, email, date }, msg: "OK" });
        });
      } else {
        return res.json({ msg: "Nothing to update" });
      }
    })
    .catch((err) => {
      debug(err);
      return res.status(400).json({ msg: "Unexpected Error" });
    });
};

// Delete a user
exports.Delete = (req, res) => {
  User.findById(req.user.id)
    .then((user) => {
      if (!user) return res.status(400).json({ msg: "User does not exist" });
      else {
        user.deleteOne({ _id: req.user.id }, (err) => {
          if (err) {
            debug(err);
            return res.status(400).json({ msg: "Unexpected Error" });
          }
          res.status(200).json({ msg: "OK" });
        });
      }
    })
    .catch((err) => {
      debug(err);
      return res.status(400).json({ msg: "Unexpected Error" });
    });
};

// Read all users
exports.ReadAll = (req, res) => {
  if (req.user.role === Role.Admin) {
    User.find({ role: Role.Customer })
      .select("-password -__v")
      .then((users) => {
        return res.json({ users });
      });
  } else {
    return res.status(403).json({ msg: "Forbidden" });
  }
};
