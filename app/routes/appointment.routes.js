module.exports = (app) => {
  const appointment = require("../controllers/appointment.controller.js");

  var router = require("express").Router();

  router.get("/", appointment.findAll);

  router.get("/search", appointment.search);

  router.get("/brands", appointment.getAllBrands);

  router.get("/addresses", appointment.getAllAddresses);

  router.get("/:id", appointment.findOne);

  router.put("/:id", appointment.update);

  app.use("/api/appointment", router);
};
