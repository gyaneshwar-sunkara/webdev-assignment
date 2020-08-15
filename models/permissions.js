const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Role = require("../interfaces/roles");

const PermissionSchema = new Schema({
  role: {
    type: String,
    default: Role.Customer,
    enum: [Role.Admin, Role.Customer],
  },
  AccessGreenButton: {
    type: Boolean,
    default: true,
  },
  AccessRedButton: {
    type: Boolean,
    default: false,
  },
});

module.exports = Permission = mongoose.model("permissions", PermissionSchema);
