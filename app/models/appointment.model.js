const mongoose = require("mongoose");

const Appointment = mongoose.model(
  "Appointment",
  new mongoose.Schema(
    {
      UserID: String,
      Workshop: String,
      Schedule: String,
      Location: String,
      Service: String,
      Status: String,
      Bill: {
        amount: {
          type: String,
          default: "",
        },
        file: {
          type: String,
          default: "",
        },
      },
      Confirm: Boolean,
      Comment: String,
      PriorityService: Boolean,
      Employee: String,
      Cars: String,
    },
    { timestamps: true }
  ).method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  })
);

module.exports = Appointment;
