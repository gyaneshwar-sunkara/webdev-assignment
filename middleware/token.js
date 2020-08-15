const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const debug = require("debug")("webdev:token");

// User Model
const User = require("../models/users");

exports.token = (req, res, next) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return res.status(400).json({ msg: "Please enter all fields" });
  }

  // Check for existing user
  User.findOne({ email })
    .then((user) => {
      if (!user) return res.status(400).json({ msg: "Email does not exist" });

      // Validate password
      bcrypt
        .compare(password, user.password)
        .then((isMatch) => {
          if (!isMatch)
            return res.status(400).json({ msg: "Invalid credentials" });

          // Create and send token
          jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "3h" },
            (err, token) => {
              if (err) {
                debug(err);
                return res.status(400).json({ msg: "Unexpected Error" });
              }
              const { firstname, lastname, email, role, date } = user;
              return res.json({
                token,
                user: { firstname, lastname, email, role, date },
                msg: "OK",
              });
            }
          );
        })
        .catch((err) => {
          debug(err);
          return res.status(400).json({ msg: "Unexpected Error" });
        });
    })
    .catch((err) => {
      debug(err);
      return res.status(400).json({ msg: "Unexpected Error" });
    });
};
