const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
  address: String,
  address2: String,
  province: String,
  city: String,
  sector: String,
});

const reviewSchema = new mongoose.Schema({
  workshopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Workshop",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Suponiendo que tienes un modelo de Usuario
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    maxlength: 500,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const workshopSchema = new mongoose.Schema({
  verifyAccountW: Boolean,
  WorkshopName: String,
  phoneNumber: String,
  email: String,
  password: String,
  imagenes: String,
  certificate: String,
  idNumber: String,
  locations: [locationSchema],
  reviews: [reviewSchema],
  vehicleBrand: [
    {
      name: String,
    },
  ],
  schedule: [
    {
      day: String,
      timeStart: Number,
      timeFinish: Number,
    },
  ],
  vehicleService: [
    {
      inputService: String,
      inputServiceDescription: String,
    },
  ],
  employee: [
    {
      name: String,
      position: String,
    },
  ],
  roles: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
    },
  ],
});

const Workshop = mongoose.model("Workshop", workshopSchema);

module.exports = Workshop;
