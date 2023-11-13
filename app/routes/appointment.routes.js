module.exports = (app) => {
  const appointment = require("../controllers/appointment.controller.js");

  var router = require("express").Router();

  router.get("/", appointment.findAll);

  router.get("/:id", appointment.findOne);

  router.put("/:id", appointment.update);
  //
  app.use("/api/appointment", router);
};
