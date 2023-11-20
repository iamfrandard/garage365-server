module.exports = (app) => {
  const reset = require("../controllers/resetpassworduser.controller");

  var router = require("express").Router();

  app.use("/api/resetpassword", router);

  router.put("/:id", reset.update);
};
