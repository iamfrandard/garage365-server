module.exports = (app) => {
  const Appointment_Workshop = require("../controllers/appointmentWorkshop.controller");

  var router = require("express").Router();

  router.post("/", Appointment_Workshop.create);

  router.get("/", Appointment_Workshop.findAll);

  router.get("/published", Appointment_Workshop.findAllPublished);

  router.get("/:id", Appointment_Workshop.findOne);

  router.put("/:id", Appointment_Workshop.update);

  app.use("/api/appointmentWorkshop", router);
};
