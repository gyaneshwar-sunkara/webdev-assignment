const path = require("path");
const express = require("express");
const logger = require("morgan");
const dotenv = require("dotenv").config();

/**
 * Environment Variables
 */
if (dotenv.error) {
  throw dotenv.error;
}

/**
 * Initialize Express App
 */
const app = express();

/**
 * Middleware
 */
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/**
 * API Routes
 */
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/users", require("./routes/api/users"));
app.use("/api/permissions", require("./routes/api/permissions"));

/**
 * Static Assets
 */
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

module.exports = app;
