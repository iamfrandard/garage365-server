const mongoose = require("mongoose");

const VehicleSchema = new mongoose.Schema({
  vehicleType: String,
  vehicleBrand: String,
  vehicleModel: String,
  vehicleYear: String,
  vehicleID: String,
});

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    verifyAccountU: Boolean,
    firstName: String,
    lastName: String,
    phoneNumber: String,
    idNumber: String,
    email: String,
    password: String,
    address: String,
    address2: String,
    sector: String,
    city: String,
    province: String,
    vehicles: [VehicleSchema],
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role",
      },
    ],
  })
);

module.exports = User;
