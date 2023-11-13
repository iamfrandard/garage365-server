const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;
const Taller = db.taller;

checkDuplicateUsernameOrEmail = (req, res, next) => {
  User.findOne({ email: req.body.inputMail }, (err, user) => {
    if (err) {
      return res
        .status(500)
        .send({ message: "Error al verificar el correo electrónico" });
    }
    if (user) {
      return res.status(400).json({
        exists: true,
        message: "¡El correo electrónico ya está en uso!",
      });
    }
    next();
  });
};

checkDuplicateUsernameOrEmailWorkshop = (req, res, next) => {
  Taller.findOne({ email: req.body.inputMailW }, (err, taller) => {
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
};

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
        message: "Error al obtener el usuario por correo electrónico",
      });
    }

    if (!user) {
      return res.status(404).json({
        message: "Usuario no encontrado con ese correo electrónico",
      });
    }

    req.userID = user._id; // Guardar el ID en el objeto req
    next();
  });
};

const verifySignUp = {
  checkDuplicateUsernameOrEmail,
  checkDuplicateUsernameOrEmailWorkshop,
  checkRolesExisted,
  getUserIDByEmail,
};

module.exports = verifySignUp;
