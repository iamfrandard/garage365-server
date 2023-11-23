const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;
const Workshop = db.workshop;

checkDuplicateUsernameOrEmail = (req, res, next) => {
  User.findOne({ email: req.body.inputMail }, (err, user) => {
    if (err) {
      return res
        .status(500)
        .send({ message: "Error al verificar el correo electrónico en User" });
    }
    if (user) {
      return res.status(400).json({
        exists: true,
        message: "¡El correo electrónico ya está en uso por un usuario!",
      });
    }

    Workshop.findOne({ email: req.body.inputMail }, (err, workshop) => {
      if (err) {
        return res.status(500).send({
          message: "Error al verificar el correo electrónico en Workshop",
        });
      }
      if (workshop) {
        return res.status(400).json({
          exists: true,
          message: "¡El correo electrónico ya está en uso por un taller!",
        });
      }
      if (!user && !workshop) {
        next();
      }
    });
  });
};

checkDuplicateUsernameOrEmailWorkshop = (req, res, next) => {
  User.findOne({ email: req.body.inputMailW }, (err, user) => {
    if (err) {
      return res
        .status(500)
        .send({ message: "Error al verificar el correo electrónico en User" });
    }
    if (user) {
      return res.status(400).json({
        exists: true,
        message: "¡El correo electrónico ya está en uso por un usuario!",
      });
    }

    Workshop.findOne({ email: req.body.inputMailW }, (err, workshop) => {
      if (err) {
        return res.status(500).send({
          message: "Error al verificar el correo electrónico en Workshop",
        });
      }
      if (workshop) {
        return res.status(400).json({
          exists: true,
          message: "¡El correo electrónico ya está en uso por un taller!",
        });
      }
      if (!user && !workshop) {
        next();
      }
    });
  });
};

/*checkDuplicateUsernameOrEmailWorkshop = (req, res, next) => {
  Workshop.findOne({ email: req.body.inputMailW }, (err, taller) => {
    if (err) {
      return res
        .status(500)
        .send({ message: "Error al verificar el correo electrónico" });
      return;
    }
    if (taller) {
      return res.status(400).json({
        exists: true,
        message: "¡El correo electrónico ya está en uso!",
      });
      return;
    }
    next();
  });
};*/

checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        res.status(400).send({
          message: `¡Error! El Rol ${req.body.roles[i]} no existe.`,
        });
        return;
      }
    }
  }
  next();
};

getUserIDByEmail = (req, res, next) => {
  const email = req.body.inputMail;

  User.findOne({ email: email }, (err, user) => {
    if (err) {
      return res.status(500).json({
        message: "Error al obtener el usuario por correo electrónico en User",
      });
    }
    if (user) {
      req.userID = user._id;
      return next();
    }

    Workshop.findOne({ email: email }, (err, workshop) => {
      if (err) {
        return res.status(500).json({
          message: "Error al obtener el taller por correo electrónico",
        });
      }

      if (workshop) {
        req.workshopID = workshop._id;
        return next();
      }

      return res.status(404).json({
        message:
          "No se encontró un usuario o taller con ese correo electrónico",
      });
    });
  });
};

const verifySignUp = {
  checkDuplicateUsernameOrEmail,
  checkDuplicateUsernameOrEmailWorkshop,
  checkRolesExisted,
  getUserIDByEmail,
};

module.exports = verifySignUp;
