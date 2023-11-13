module.exports = (app) => {
  const cors = require("cors"); // Importa el paquete CORS
  const appointment = require("../controllers/appointment.controller.js");

  var router = require("express").Router();

  // Configura CORS para permitir solicitudes desde tu dominio front-end
  const corsOptions = {
    origin: "https://garage365.netlify.app",
  };

  // Utiliza CORS con las opciones definidas para todas las rutas de este router
  router.use(cors(corsOptions));

  router.get("/", appointment.findAll);
  router.get("/:id", appointment.findOne);
  router.put("/:id", appointment.update);

  app.use("/api/appointment", router);
};
