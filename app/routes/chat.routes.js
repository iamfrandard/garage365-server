const express = require("express");
var router = require("express").Router();
const { verifyToken } = require("../middlewares/authJwt");
const chatController = require("../controllers/chat.controller");

module.exports = (app) => {
  const {
    startSession,
    sendMessage,
    endSession,
    getMessages,
    getSessionsForUser,
    getSessionsForExpert,
    getUnansweredMessagesForExpert,
    getActiveUnreadSessionsForExpert,
    markAsAnswered,
  } = require("../controllers/chat.controller");

  router.delete("/session/:sessionId", chatController.deleteSession);
  router.post("/start", verifyToken, startSession);
  router.post("/message", verifyToken, sendMessage);
  router.post("/end", verifyToken, endSession);
  router.get("/sessions", verifyToken, getSessionsForExpert);
  router.get("/chatsessions/:id", verifyToken, getSessionsForUser);
  router.get("/messages/:sessionId", verifyToken, getMessages);
  router.get("/unanswered", verifyToken, getUnansweredMessagesForExpert);
  router.patch("/message/answered/:messageId", verifyToken, markAsAnswered);
  router.get("/unread", getActiveUnreadSessionsForExpert);
  router.get("/chatmessages/:sessionId", chatController.getMessagesForSession);
  router.patch(
    "/message/read/:messageId",
    verifyToken,
    chatController.markMessageAsRead
  );
  app.use("/api/chat", router);
};
