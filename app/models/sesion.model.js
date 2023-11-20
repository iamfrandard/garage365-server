const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema({
  expertId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Workshop",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  responded: {
    type: Boolean,
  },
  endedAt: {
    type: Date,
  },
});

const Session = mongoose.model("Session", sessionSchema);

module.exports = Session;
