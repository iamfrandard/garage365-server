module.exports = (app) => {
  const reset = require("../controllers/resetpassworduser.controller.js");

  var router = require("express").Router();

  //router.get("/", reset.findAll);

  //router.get("/:id", reset.findOne);

  router.put("/:id", reset.update);

  app.use("/api/resetpassword", router);
};
