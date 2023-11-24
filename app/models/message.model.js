const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Session",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  userName: {
    type: String,
    required: true,
  },
  tallerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Taller",
  },
  tallerName: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  sender: {
    type: String,
    required: true,
  },
  responded: {
    type: Boolean,
    default: false,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
