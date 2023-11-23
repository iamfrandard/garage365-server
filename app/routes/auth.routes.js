const { verifySignUp } = require("../middlewares");
const controller = require("../controllers/auth.controller");
const multerconfig = require("../config/multer.config");
const multer = require("multer");

const uploadHandler = multer({
  storage: multerconfig.storageOptions,
  limits: multerconfig.fileSize,
  fileFilter: multerconfig.fileFilter,
});

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
    next();
  });

  app.post(
    "/api/auth/signupU",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted,
    ],
    controller.signupU
  );

  app.post(
    "/api/auth/signupE",
    uploadHandler.fields([
      { name: "inputImage", maxCount: 1 },
      { name: "inputCertificate", maxCount: 1 },
    ]),
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted,
    ],
    controller.signupE
  );

  app.post("/api/auth/signin", controller.signin);

  app.post("/api/auth/signout", controller.signout);
  app.get("/api/auth/verifyAccountE/:id", controller.verifyAccountE);
  app.get("/api/auth/verifyAccountU/:id", controller.verifyAccountU);

  app.get("/api/auth/getAllEmployee/:id", controller.getAllEmployee);
  app.post("/api/auth/addEmployee", controller.addEmployee);
  app.post("/api/auth/updateEmployee", controller.updateEmployee);
  app.post("/api/auth/deleteEmployee", controller.deleteEmployee);

  app.get("/api/auth/getAllService/:id", controller.getAllService);
  app.post("/api/auth/addService", controller.addService);
  app.post("/api/auth/updateService", controller.updateService);
  app.post("/api/auth/deleteService", controller.deleteService);

  app.get("/api/auth/getAllSchedule/:id", controller.getAllSchedule);
  app.post("/api/auth/addSchedule", controller.addSchedule);
  app.post("/api/auth/updateSchedule", controller.updateSchedule);
  app.post("/api/auth/deleteSchedule", controller.deleteSchedule);

  app.get("/api/auth/getAllDetails/:id", controller.getAllDetails);
  app.post("/api/auth/updateDetails", controller.updateDetails);

  app.post("/api/auth/addVehicle", controller.addVehicle);
  app.post("/api/auth/updateVehicle", controller.updateVehicle);
  app.post("/api/auth/deleteVehicle", controller.deleteVehicle);

  app.post("/api/auth/updateDetailsWorkshop", controller.updateDetailsWorkshop);

  app.post("/api/auth/addLocationWorkshop", controller.addLocationWorkshop);
  app.post(
    "/api/auth/updateLocationWorkshop",
    controller.updateLocationWorkshop
  );
  app.post(
    "/api/auth/deleteLocationWorkshop",
    controller.deleteLocationWorkshop
  );

  app.post("/api/auth/addBrandWorkshop", controller.addBrandWorkshop);
  app.post("/api/auth/updateBrandWorkshop", controller.updateBrandWorkshop);
  app.post("/api/auth/deleteBrandWorkshop", controller.deleteBrandWorkshop);
};
