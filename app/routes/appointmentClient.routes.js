module.exports = (app) => {
  const AppointmentClient = require("../controllers/appointmentClient.controller");

  var router = require("express").Router();

  router.post("/", AppointmentClient.create);
  router.get("/", AppointmentClient.findAll);

  //
  router.get("/published", AppointmentClient.findAllPublished);

  router.put("/:id", AppointmentClient.update);

  //
  router.get("/:id", AppointmentClient.findOne);
  //
  router.delete("/:id", AppointmentClient.delete);
  //
  router.delete("/gola", AppointmentClient.deleteAll);

  router.get("/:workshopId/reviews", AppointmentClient.getWorkshopReviews);
  router.post("/:workshopId/addReview", AppointmentClient.addReviewToWorkshop);

  router.post(
    "/:AppointmentID/cancelAppointment",
    AppointmentClient.cancelAppointment
  );

  router.get("/:workshopName/getAllEmployee", AppointmentClient.getAllEmployee);

  app.use("/api/appointmentClient", router);
};
