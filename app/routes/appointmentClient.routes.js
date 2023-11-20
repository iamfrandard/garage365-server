module.exports = (app) => {
  const AppointmentClient = require("../controllers/appointmentClient.controller");
  const multer = require("multer");
  const multerConfig = require("../config/multer.config");

  const upload = multer({
    storage: multerConfig.storageOptions,
    fileFilter: multerConfig.fileFilter,
    limits: multerConfig.fileSize,
  });

  var router = require("express").Router();

  router.post("/", AppointmentClient.create);
  router.get("/", AppointmentClient.findAll);

  //
  router.get("/published", AppointmentClient.findAllPublished);

  router.put("/:id", AppointmentClient.update);

  router.put("/:id/bill", upload.single("billFile"), AppointmentClient.updateL);

  router.get("/user/:id", AppointmentClient.findOneU);

  //
  router.get("/:id", AppointmentClient.findOne);
  //
  router.delete("/:id", AppointmentClient.delete);
  //
  router.delete("/gola", AppointmentClient.deleteAll);

  router.get("/:workshopId/reviews", AppointmentClient.getWorkshopReviews);

  router.post("/:workshopId/addReview", AppointmentClient.addReviewToWorkshop);

  //
  // router.post(
  //   "/bill/:id",
  //   upload.single("billFile"),
  //   (req, res, next) => {
  //     console.log(req.file);
  //     next();
  //   },
  //   AppointmentClient.updateL
  // );

  router.post(
    "/:AppointmentID/cancelAppointment",
    AppointmentClient.cancelAppointment
  );

  router.get("/:workshopName/getAllEmployee", AppointmentClient.getAllEmployee);

  router.get("/:UserID/cars", AppointmentClient.getCarsUsers);

  app.use("/api/appointmentClient", router);
};
