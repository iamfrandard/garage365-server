const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Workshop = db.workshop;
const Role = db.role;
const path = require("path");
const mailer = require("../config/mailer");
const fs = require("fs");

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signupU = (req, res) => {
  const user = new User({
    verifyAccountU: false,
    firstName: req.body.inputName,
    lastName: req.body.inputLastName,
    phoneNumber: req.body.inputNumber,
    idNumber: req.body.inputID,
    email: req.body.inputMail,
    password: bcrypt.hashSync(req.body.inputPassword, 8),
    address: req.body.inputAddress,
    address2: req.body.inputAddress2,
    province: req.body.inputProvince,
    city: req.body.inputCity,
    sector: req.body.inputSector,
    vehicles: req.body.vehicles.map((vehicle) => ({
      vehicleType: vehicle.inputType,
      vehicleBrand: vehicle.inputBrand,
      vehicleModel: vehicle.inputModel,
      vehicleYear: vehicle.inputYear,
      vehicleID: vehicle.inputCarID,
    })),
  });

  user.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    Role.findOne({ name: "user" }, (err, role) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      user.roles = [role._id];
      user.save(async (err) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        res.send({ message: "El usuario se registró con éxito!" });

        let userSignUp = fs.readFileSync(
          "./app/mails/userSignUp-Pending.html",
          "utf8"
        );

        userSignUp = userSignUp.replace("{{id}}", user._id);

        try {
          await mailer.send.sendMail({
            from: '"Garage365" <danielchalasrd@gmail.com>',
            to: user.email,
            subject: "Gracias por registrarse en nuestro",
            text: "Gracias por registrarte en Garage365. ¡Esperamos que disfrutes nuestro servicio!",
            html: userSignUp,
          });
          res.send({ message: "Mail Send" });
        } catch (error) {
          res
            .status(500)
            .send({ message: `Error sending email: ${error.message}` });
        }
      });
    });
  });
};

exports.signupE = (req, res) => {
  const brands = Object.keys(req.body)
    .filter((key) => key.startsWith("inputBrandW"))
    .map((key) => req.body[key]);

  const sharp = require("sharp");
  const services = [];
  let j = 0;
  while (req.body[`inputServices${j}`]) {
    services.push({
      inputService: req.body[`inputServices${j}`],
      inputServiceDescription: req.body[`inputServiceDescription${j}`],
    });
    j++;
  }

  const locations = [];
  let i = 0;
  while (req.body[`inputAddressW${i}`]) {
    locations.push({
      address: req.body[`inputAddressW${i}`],
      address2: req.body[`inputAddress2W${i}`],
      province: req.body[`inputProvinceW${i}`],
      city: req.body[`inputCityW${i}`],
      sector: req.body[`inputSectorW${i}`],
    });
    i++;
  }

  const certificate2 = req.files.inputCertificate[0];
  const Path = "./app/files/";
  const CertificatePath = path.join(Path, certificate2.filename);

  const PathVerify = `https://goldfish-app-67lk9.ondigitalocean.app/api/auth/verifyAccountE/${req.body.inputMailW}`;

  const workshop = new Workshop({
    verifyAccountW: false,
    WorkshopName: req.body.inputNameWorkshop,
    phoneNumber: req.body.inputNumberW,
    email: req.body.inputMailW,
    password: bcrypt.hashSync(req.body.inputPasswordW, 8),
    imagenes: req.body.inputImage,
    idNumber: req.body.inputWorkshopID,
    locations: locations,
    vehicleBrand: brands.map((brand) => ({ name: brand })),
    vehicleService: services,
  });

  workshop.save(async (err, workshop) => {
    if (err) {
      console.log(err);
      res.status(500).send({ message: err });
      return;
    }

    if (req.files && req.files.inputCertificate) {
      const certificate = req.files.inputCertificate[0];
      try {
        workshop.certificate = `https://goldfish-app-67lk9.ondigitalocean.app/app/files/${certificate.filename}`;
      } catch (error) {
        console.error("Error al asignar la ruta del archivo:", error);
        res
          .status(500)
          .send({ message: "Ocurrió un error al asignar la ruta del archivo" });
        return;
      }
    }

    Role.findOne({ name: "moderator" }, (err, role) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      workshop.roles = [role._id];
      workshop.save(async (err) => {
        if (err) {
          res.status(500).send({ message: err });
          return;
        }

        let workSignUp = fs.readFileSync(
          "./app/mails/workshopSignUp-PendingVerify.html",
          "utf8"
        );
        let workSignUp2 = fs.readFileSync(
          "./app/mails/workshopSignUp-Pending.html",
          "utf8"
        );

        workSignUp = workSignUp.replace(
          "{{company_name}}",
          workshop.WorkshopName
        );

        workSignUp = workSignUp.replace("{{id}}", workshop._id);

        workSignUp2 = workSignUp2.replace(
          "{{company_name}}",
          workshop.WorkshopName
        );

        try {
          await mailer.send.sendMail({
            from: '"Garage365" <danielchalasrd@gmail.com>',
            to: "danielchalasrd@gmail.com",
            subject: "Nuevo Registro",
            html: workSignUp,
            attachments: [
              {
                filename: certificate2.filename,
                path: CertificatePath,
              },
            ],
          });

          await mailer.send.sendMail({
            from: '"Garage365" <danielchalasrd@gmail.com>',
            to: workshop.email,
            subject: "Gracias por registrarse",
            html: workSignUp2,
          });

          res.send({ message: "Mails Sent" });
        } catch (error) {
          res
            .status(500)
            .send({ message: `Error sending emails: ${error.message}` });
        }
      });
    });
  });
};

exports.signin = (req, res) => {
  Promise.all([
    User.findOne({ email: req.body.inputMail })
      .populate("roles", "-__v")
      .exec(),
    Workshop.findOne({ email: req.body.inputMail })
      .populate("roles", "-__v")
      .exec(),
  ])
    .then(([user, workshop]) => {
      if (!user && !workshop) {
        return res.status(404).send({ message: "El correo no existe!" });
      }

      let finalUser = user ? user : workshop;

      var passwordIsValid = bcrypt.compareSync(
        req.body.inputPassword,
        finalUser.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({ message: "Contraseña invalida!" });
      }

      if (user && !user.verifyAccountU) {
        return res
          .status(404)
          .send({ message: "La cuenta no está verificada!" });
      }

      if (workshop && !workshop.verifyAccountW) {
        return res
          .status(404)
          .send({ message: "La cuenta no está verificada!" });
      }

      var token = jwt.sign({ id: finalUser.id }, config.secret, {
        expiresIn: 86400,
      });

      var authorities = [];

      for (let i = 0; i < finalUser.roles.length; i++) {
        authorities.push("ROLE_" + finalUser.roles[i].name.toUpperCase());
      }

      req.session.token = token;

      let names = null;

      if (finalUser && Array.isArray(finalUser.roles)) {
        names = finalUser.roles.map((item) => item.name);
      }

      const isUserIncluded = names ? names.includes("user") : false;

      if (isUserIncluded) {
        res.status(200).send({
          id: finalUser._id,
          email: finalUser.firstName + " " + finalUser.lastName,
          roles: authorities,
        });
      } else {
        res.status(200).send({
          id: finalUser._id,
          email: finalUser.WorkshopName,
          roles: authorities,
        });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: err });
    });
};

exports.signout = async (req, res) => {
  try {
    req.session = null;
    return res.status(200).send({ message: "¡Has sido desconectado!" });
  } catch (err) {
    this.next(err);
  }
};

exports.verifyAccountE = (req, res) => {
  const id = req.params.id;

  Workshop.findById(id, async (err, workshop) => {
    if (err) {
      return res.status(500).send({ message: "Error del servidor" });
    }

    if (!workshop) {
      return res.status(404).send({ message: "Usuario no encontrado" });
    }

    if (workshop.verifyAccountW) {
      return res.status(400).send({ message: "La cuenta ya está verificada" });
    }

    workshop.verifyAccountW = true;

    let workSignUp = fs.readFileSync(
      "./app/mails/workshopSignUp-Complete.html",
      "utf8"
    );

    workSignUp = workSignUp.replace("{{company_name}}", workshop.WorkshopName);

    try {
      await workshop.save();
      await mailer.send.sendMail({
        from: '"Garage365" <danielchalasrd@gmail.com>',
        to: workshop.email,
        subject: "Cuenta verificada",
        html: workSignUp,
      });
      res.status(200).send({ message: "Verificado y correo enviado" });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send({
        message: "Verificado, pero ocurrió un error enviando el correo",
      });
    }
  });
};

exports.verifyAccountU = (req, res) => {
  const id = req.params.id;

  User.findById(id, async (err, user) => {
    if (err) {
      return res.status(500).send({ message: "Error del servidor" });
    }

    if (!user) {
      return res.status(404).send({ message: "Usuario no encontrado" });
    }

    if (user.verifyAccountU) {
      return res.status(400).send({ message: "La cuenta ya está verificada" });
    }

    user.verifyAccountU = true;
    try {
      await user.save();
      res.status(200).send({ message: "Verificado" });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).send({
        message: "La cuenta ha sido verificada, pero ocurrió un error",
      });
    }
  });
};

exports.getAllEmployee = (req, res) => {
  const workshopId = req.params.id;

  Workshop.findById(workshopId)
    .select("employee")
    .then((workshop) => {
      if (workshop) {
        res.json(workshop.employee);
      } else {
        res.status(404).json({ message: "Taller no encontrado" });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: "Error al obtener empleados",
        error: err,
      });
    });
};

exports.addEmployee = (req, res) => {
  const { id, name, position } = req.body;

  Workshop.findOne({ _id: id }, (err, workshop) => {
    if (err) {
      return res.status(500).send({ message: "Error al buscar el taller." });
    }

    if (!workshop) {
      return res.status(404).send({ message: "Taller no encontrado." });
    }

    workshop.employee.push({ name, position });

    workshop.save((saveErr) => {
      if (saveErr) {
        return res
          .status(500)
          .send({ message: "Error al guardar el taller actualizado." });
      }
      res.status(200).send({
        message: "El empleado añadido fue con éxito",
        employee: { name, position },
      });
    });
  });
};

exports.updateEmployee = (req, res) => {
  const { userID, employeeID, name, position } = req.body;

  Workshop.findOne({ _id: userID }, (err, workshop) => {
    if (err) {
      return res.status(500).send({ message: "Error al buscar el taller." });
    }

    if (!workshop) {
      return res.status(404).send({ message: "Taller no encontrado." });
    }

    const employee = workshop.employee.id(employeeID);

    if (!employee) {
      return res.status(404).send({ message: "Empleado no encontrado." });
    }

    employee.name = name;
    employee.position = position;

    workshop.save((saveErr) => {
      if (saveErr) {
        return res
          .status(500)
          .send({ message: "Error al actualizar el empleado." });
      }
      res.status(200).send({ message: "Empleado actualizado con éxito" });
    });
  });
};

exports.deleteEmployee = (req, res) => {
  const { userID, employeeID } = req.body;

  Workshop.findOne({ _id: userID }, (err, workshop) => {
    if (err) {
      return res.status(500).send({ message: "Error al buscar el taller." });
    }

    if (!workshop) {
      return res.status(404).send({ message: "Taller no encontrado." });
    }

    const employeeIndex = workshop.employee.findIndex(
      (emp) => emp._id.toString() === employeeID
    );

    if (employeeIndex === -1) {
      return res.status(404).send({ message: "Empleado no encontrado." });
    }

    workshop.employee.splice(employeeIndex, 1);

    workshop.save((saveErr) => {
      if (saveErr) {
        return res
          .status(500)
          .send({ message: "Error al eliminar el empleado." });
      }
      res.status(200).send({ message: "Empleado eliminado con éxito." });
    });
  });
};

exports.getAllService = (req, res) => {
  const workshopId = req.params.id;

  Workshop.findById(workshopId)
    .select("vehicleService")
    .then((workshop) => {
      if (workshop) {
        res.json(workshop.vehicleService);
      } else {
        res.status(404).json({ message: "Taller no encontrado" });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: "Error al obtener los servicios",
        error: err,
      });
    });
};

exports.addService = (req, res) => {
  const { id, inputService, inputServiceDescription } = req.body;

  Workshop.findOne({ _id: id }, (err, workshop) => {
    if (err) {
      return res.status(500).send({ message: "Error al buscar el taller." });
    }

    if (!workshop) {
      return res.status(404).send({ message: "Taller no encontrado." });
    }

    workshop.vehicleService.push({ inputService, inputServiceDescription });

    workshop.save((saveErr) => {
      if (saveErr) {
        return res
          .status(500)
          .send({ message: "Error al guardar el taller actualizado." });
      }
      res.status(200).send({
        message: "El servicio de vehículo fue añadido con éxito.",
        service: { inputService, inputServiceDescription },
      });
    });
  });
};

exports.updateService = (req, res) => {
  const { workshopID, serviceID, inputService, inputServiceDescription } =
    req.body;

  Workshop.findOne({ _id: workshopID }, (err, workshop) => {
    if (err) {
      return res.status(500).send({ message: "Error al buscar el taller." });
    }

    if (!workshop) {
      return res.status(404).send({ message: "Taller no encontrado." });
    }

    const service = workshop.vehicleService.id(serviceID);

    if (!service) {
      return res.status(404).send({ message: "Servicio no encontrado." });
    }

    service.inputService = inputService;
    service.inputServiceDescription = inputServiceDescription;

    workshop.save((saveErr) => {
      if (saveErr) {
        return res
          .status(500)
          .send({ message: "Error al actualizar el servicio." });
      }
      res.status(200).send({ message: "Servicio actualizado con éxito" });
    });
  });
};

exports.deleteService = (req, res) => {
  const { workshopID, serviceID } = req.body;

  Workshop.findOne({ _id: workshopID }, (err, workshop) => {
    if (err) {
      return res.status(500).send({ message: "Error al buscar el taller." });
    }

    if (!workshop) {
      return res.status(404).send({ message: "Taller no encontrado." });
    }

    const serviceIndex = workshop.vehicleService.findIndex(
      (svc) => svc._id.toString() === serviceID
    );

    if (serviceIndex === -1) {
      return res.status(404).send({ message: "Servicio no encontrado." });
    }

    workshop.vehicleService.splice(serviceIndex, 1);

    workshop.save((saveErr) => {
      if (saveErr) {
        return res
          .status(500)
          .send({ message: "Error al eliminar el servicio." });
      }
      res.status(200).send({ message: "Servicio eliminado con éxito." });
    });
  });
};

exports.getAllSchedule = (req, res) => {
  const workshopId = req.params.id;

  Workshop.findById(workshopId)
    .select("schedule")
    .then((workshop) => {
      if (workshop) {
        res.json(workshop.schedule);
      } else {
        res.status(404).json({ message: "Taller no encontrado" });
      }
    })
    .catch((err) => {
      res.status(500).json({
        message: "Error al obtener los horarios",
        error: err,
      });
    });
};

exports.addSchedule = (req, res) => {
  const { workshopID, day, timeStart, timeFinish } = req.body;

  Workshop.findOne({ _id: workshopID }, (err, workshop) => {
    if (err) {
      return res.status(500).send({ message: "Error al buscar el taller." });
    }

    if (!workshop) {
      return res.status(404).send({ message: "Taller no encontrado." });
    }

    workshop.schedule.push({ day, timeStart, timeFinish });

    workshop.save((saveErr) => {
      if (saveErr) {
        return res
          .status(500)
          .send({ message: "Error al guardar el taller actualizado." });
      }
      res.status(200).send({
        message: "El horario fue añadido con éxito.",
        service: { day, timeStart, timeFinish },
      });
    });
  });
};

exports.updateSchedule = (req, res) => {
  const { workshopID, ScheduleID, timeStart, timeFinish } = req.body;

  Workshop.findOne({ _id: workshopID }, (err, workshop) => {
    if (err) {
      return res.status(500).send({ message: "Error al buscar el taller." });
    }

    if (!workshop) {
      return res.status(404).send({ message: "Taller no encontrado." });
    }

    const schedule = workshop.schedule.id(ScheduleID);

    if (!schedule) {
      return res.status(404).send({ message: "Horario no encontrado." });
    }

    schedule.timeStart = timeStart;
    schedule.timeFinish = timeFinish;

    workshop.save((saveErr) => {
      if (saveErr) {
        return res
          .status(500)
          .send({ message: "Error al actualizar el horario." });
      }
      res.status(200).send({ message: "Horario actualizado con éxito" });
    });
  });
};

exports.deleteSchedule = (req, res) => {
  const { workshopID, ScheduleID } = req.body;

  Workshop.findOne({ _id: workshopID }, (err, workshop) => {
    if (err) {
      return res.status(500).send({ message: "Error al buscar el taller." });
    }

    if (!workshop) {
      return res.status(404).send({ message: "Taller no encontrado." });
    }

    const scheduleIndex = workshop.schedule.findIndex(
      (svc) => svc._id.toString() === ScheduleID
    );

    if (scheduleIndex === -1) {
      return res.status(404).send({ message: "Horario no encontrado." });
    }

    workshop.schedule.splice(scheduleIndex, 1);

    workshop.save((saveErr) => {
      if (saveErr) {
        return res
          .status(500)
          .send({ message: "Error al eliminar el horario." });
      }
      res.status(200).send({ message: "Horario eliminado con éxito." });
    });
  });
};

exports.getAllDetails = async (req, res) => {
  const workshopId = req.params.id;

  try {
    const workshop = await Workshop.findById(workshopId);

    if (workshop) {
      const {
        roles,
        _id,
        verifyAccountW,
        password,
        reviews,
        employee,
        schedule,
        vehicleService,
        __v,
        ...restOfWorkshop
      } = workshop.toObject();
      return res.json(restOfWorkshop);
    }

    const user = await User.findById(workshopId);

    if (user) {
      const {
        roles: userRoles,
        _id: userId,
        verifyAccountU,
        password: userPassword,
        __v,
        ...restOfUser
      } = user.toObject();
      return res.json(restOfUser);
    }

    return res
      .status(404)
      .json({ message: "No encontrado en Taller ni Usuario" });
  } catch (err) {
    return res.status(500).json({
      message: "Error al obtener los datos",
      error: err,
    });
  }
};

exports.updateDetails = (req, res) => {
  const { userID, dataOld, dataNew } = req.body;

  User.findOne({ _id: userID }, (err, user) => {
    if (err) {
      return res.status(500).send({ message: "Error al buscar el usuario." });
    }

    if (!user) {
      return res.status(404).send({ message: "Usuario no encontrado." });
    }

    let contentMail = fs.readFileSync("./app/mails/userEdit1.html", "utf8");

    contentMail = contentMail.replace(
      "{{name}}",
      user.firstName + " " + user.lastName
    );

    if (user.firstName == dataOld) {
      contentMail = contentMail.replace("{{detalle}}", "Nombre");
      contentMail = contentMail.replace("{{detalleActualizado}}", dataNew);
      user.firstName = dataNew;
    }
    if (user.lastName == dataOld) {
      contentMail = contentMail.replace("{{detalle}}", "Apellido");
      contentMail = contentMail.replace("{{detalleActualizado}}", dataNew);
      user.lastName = dataNew;
    }
    if (user.phoneNumber == dataOld) {
      contentMail = contentMail.replace("{{detalle}}", "Telefono");
      contentMail = contentMail.replace("{{detalleActualizado}}", dataNew);
      user.phoneNumber = dataNew;
    }
    if (user.idNumber == dataOld) {
      contentMail = contentMail.replace("{{detalle}}", "Cedula");
      contentMail = contentMail.replace("{{detalleActualizado}}", dataNew);
      user.idNumber = dataNew;
    }
    if (user.email == dataOld) {
      contentMail = contentMail.replace("{{detalle}}", "Correo");
      contentMail = contentMail.replace("{{detalleActualizado}}", dataNew);
      user.email = dataNew;
    }
    if (user.address == dataOld) {
      contentMail = contentMail.replace("{{detalle}}", "Direccion");
      contentMail = contentMail.replace("{{detalleActualizado}}", dataNew);
      user.address = dataNew;
    }
    if (user.address2 == dataOld) {
      contentMail = contentMail.replace("{{detalle}}", "Direccion 2");
      contentMail = contentMail.replace("{{detalleActualizado}}", dataNew);
      user.address2 = dataNew;
    }
    if (user.sector == dataOld) {
      contentMail = contentMail.replace("{{detalle}}", "Sector");
      contentMail = contentMail.replace("{{detalleActualizado}}", dataNew);
      user.sector = dataNew;
    }
    if (user.city == dataOld) {
      contentMail = contentMail.replace("{{detalle}}", "Ciudad");
      contentMail = contentMail.replace("{{detalleActualizado}}", dataNew);
      user.city = dataNew;
    }
    if (user.province == dataOld) {
      contentMail = contentMail.replace("{{detalle}}", "Provincia");
      contentMail = contentMail.replace("{{detalleActualizado}}", dataNew);
      user.province = dataNew;
    }

    user.save(async (saveErr) => {
      if (saveErr) {
        return res
          .status(500)
          .send({ message: "Error al actualizar el usuario." });
      }

      try {
        await mailer.send.sendMail({
          from: '"Garage365" <danielchalasrd@gmail.com>',
          to: user.email,
          subject: "La cuenta fue actualizada - Garage365",
          html: contentMail,
        });
        res.status(200).send({
          message:
            "El usuario fue actualizado con éxito y el correo fue enviado.",
        });
      } catch (error) {
        console.error("Error:", error);
        res.status(500).send({
          message:
            "El usuario fue actualizado, pero ocurrió un error enviando el correo",
        });
      }
    });
  });
};

exports.addVehicle = (req, res) => {
  const { id, vehicleModel, vehicleYear, vehicleID } = req.body;

  const tipo = req.body.vehicleType?.tipo;
  const marca = req.body.vehicleBrand?.marca;

  User.findOne({ _id: id }, async (err, user) => {
    if (err) {
      return res.status(500).send({ message: "Error al buscar el usuario." });
    }

    if (!user) {
      return res.status(404).send({ message: "Usuario no encontrado." });
    }

    user.vehicles.push({
      vehicleType: tipo,
      vehicleBrand: marca,
      vehicleModel,
      vehicleYear,
      vehicleID,
    });

    user.save(async (saveErr) => {
      if (saveErr) {
        return res
          .status(500)
          .send({ message: "Error al guardar el vehiculo actualizado." });
      }

      let contentMail = fs.readFileSync("./app/mails/userEdit2.html", "utf8");

      contentMail = contentMail.replace(
        "{{name}}",
        user.firstName + " " + user.lastName
      );
      contentMail = contentMail.replace("{{DetailV}}", "Agregados");
      contentMail = contentMail.replace("{{TypeV}}", tipo);
      contentMail = contentMail.replace("{{BrandV}}", marca);
      contentMail = contentMail.replace("{{ModelV}}", vehicleModel);
      contentMail = contentMail.replace("{{YearV}}", vehicleYear);
      contentMail = contentMail.replace("{{NumberV}}", vehicleID);

      try {
        await mailer.send.sendMail({
          from: '"Garage365" <danielchalasrd@gmail.com>',
          to: user.email,
          subject: "Vehiculo Agregado - Garage365",
          html: contentMail,
        });
        res.status(200).send({
          message: "El vehículo fue añadido con éxito y el correo fue enviado.",
          vehicle: {
            vehicleType: tipo,
            vehicleBrand: marca,
            vehicleModel,
            vehicleYear,
            vehicleID,
          },
        });
      } catch (error) {
        console.error("Error:", error);
        res.status(500).send({
          message:
            "El vehículo fue añadido, pero ocurrió un error enviando el correo",
        });
      }
    });
  });
};

exports.updateVehicle = (req, res) => {
  const { id, CarID, vehicleModel, vehicleYear, vehicleID } = req.body;

  const tipo = req.body.vehicleType?.tipo;
  const marca = req.body.vehicleBrand?.marca;

  User.findOne({ _id: id }, (err, user) => {
    if (err) {
      return res.status(500).send({ message: "Error al buscar el usuario." });
    }

    if (!user) {
      return res.status(404).send({ message: "Usuario no encontrado." });
    }

    const vehicle = user.vehicles.id(CarID);

    if (!vehicle) {
      return res.status(404).send({ message: "Vehiculo no encontrado." });
    }

    vehicle.vehicleType = tipo;
    vehicle.vehicleBrand = marca;
    vehicle.vehicleModel = vehicleModel;
    vehicle.vehicleYear = vehicleYear;
    vehicle.vehicleID = vehicleID;

    user.save(async (saveErr) => {
      if (saveErr) {
        return res
          .status(500)
          .send({ message: "Error al guardar el vehiculo actualizado." });
      }

      let contentMail = fs.readFileSync("./app/mails/userEdit2.html", "utf8");

      contentMail = contentMail.replace(
        "{{name}}",
        user.firstName + " " + user.lastName
      );
      contentMail = contentMail.replace("{{DetailV}}", "Actualizados");
      contentMail = contentMail.replace("{{TypeV}}", tipo);
      contentMail = contentMail.replace("{{BrandV}}", marca);
      contentMail = contentMail.replace("{{ModelV}}", vehicleModel);
      contentMail = contentMail.replace("{{YearV}}", vehicleYear);
      contentMail = contentMail.replace("{{NumberV}}", vehicleID);

      try {
        await mailer.send.sendMail({
          from: '"Garage365" <danielchalasrd@gmail.com>',
          to: user.email,
          subject: "Vehiculo Actualizado - Garage365",
          html: contentMail,
        });
        res.status(200).send({
          message:
            "El vehículo fue actualizado con éxito y el correo fue enviado.",
          vehicle: {
            vehicleType: tipo,
            vehicleBrand: marca,
            vehicleModel,
            vehicleYear,
            vehicleID,
          },
        });
      } catch (error) {
        console.error("Error:", error);
        res.status(500).send({
          message:
            "El vehículo fue actualizado, pero ocurrió un error enviando el correo",
        });
      }
    });
  });
};

exports.deleteVehicle = (req, res) => {
  const {
    id,
    CarID,
    vehicleType,
    vehicleBrand,
    vehicleModel,
    vehicleYear,
    vehicleID,
  } = req.body;

  User.findOne({ _id: id }, (err, user) => {
    if (err) {
      return res.status(500).send({ message: "Error al buscar el usuario." });
    }

    if (!user) {
      return res.status(404).send({ message: "Usuario no encontrado." });
    }

    const scheduleIndex = user.vehicles.findIndex(
      (svc) => svc._id.toString() === CarID
    );

    if (scheduleIndex === -1) {
      return res.status(404).send({ message: "Vehiculo no encontrado." });
    }

    user.vehicles.splice(scheduleIndex, 1);

    user.save(async (saveErr) => {
      if (saveErr) {
        return res
          .status(500)
          .send({ message: "Error al Eliminado el vehiculo." });
      }

      let contentMail = fs.readFileSync("./app/mails/userEdit2.html", "utf8");

      contentMail = contentMail.replace(
        "{{name}}",
        user.firstName + " " + user.lastName
      );
      contentMail = contentMail.replace("{{DetailV}}", "Eliminados");
      contentMail = contentMail.replace("{{TypeV}}", vehicleType);
      contentMail = contentMail.replace("{{BrandV}}", vehicleBrand);
      contentMail = contentMail.replace("{{ModelV}}", vehicleModel);
      contentMail = contentMail.replace("{{YearV}}", vehicleYear);
      contentMail = contentMail.replace("{{NumberV}}", vehicleID);

      try {
        await mailer.send.sendMail({
          from: '"Garage365" <danielchalasrd@gmail.com>',
          to: user.email,
          subject: "Vehiculo Eliminado - Garage365",
          html: contentMail,
        });
        res.status(200).send({
          message:
            "El vehículo fue Eliminado con éxito y el correo fue enviado.",
          vehicle: {
            vehicleType: tipo,
            vehicleBrand: marca,
            vehicleModel,
            vehicleYear,
            vehicleID,
          },
        });
      } catch (error) {
        console.error("Error:", error);
        res.status(500).send({
          message:
            "El vehículo fue Eliminado, pero ocurrió un error enviando el correo",
        });
      }
    });
  });
};

exports.updateDetailsWorkshop = (req, res) => {
  const { workshopID, dataOld, dataNew } = req.body;

  Workshop.findOne({ _id: workshopID }, (err, workshop) => {
    if (err) {
      return res.status(500).send({ message: "Error al buscar el Taller." });
    }

    if (!workshop) {
      return res.status(404).send({ message: "Taller no encontrado." });
    }

    let contentMail = fs.readFileSync("./app/mails/workshopEdit1.html", "utf8");

    contentMail = contentMail.replace("{{name}}", workshop.WorkshopName);

    if (workshop.WorkshopName == dataOld) {
      contentMail = contentMail.replace("{{detalle}}", "Nombre Comercial");
      contentMail = contentMail.replace("{{detalleActualizado}}", dataNew);
      workshop.WorkshopName = dataNew;
    }
    if (workshop.phoneNumber == dataOld) {
      contentMail = contentMail.replace("{{detalle}}", "Telefono");
      contentMail = contentMail.replace("{{detalleActualizado}}", dataNew);
      workshop.phoneNumber = dataNew;
    }
    if (workshop.idNumber == dataOld) {
      contentMail = contentMail.replace("{{detalle}}", "RNC");
      contentMail = contentMail.replace("{{detalleActualizado}}", dataNew);
      workshop.idNumber = dataNew;
    }
    if (workshop.email == dataOld) {
      contentMail = contentMail.replace("{{detalle}}", "Correo");
      contentMail = contentMail.replace("{{detalleActualizado}}", dataNew);
      workshop.email = dataNew;
    }

    workshop.save(async (saveErr) => {
      if (saveErr) {
        return res
          .status(500)
          .send({ message: "Error al actualizar el usuario." });
      }

      try {
        await mailer.send.sendMail({
          from: '"Garage365" <danielchalasrd@gmail.com>',
          to: workshop.email,
          subject: "La cuenta fue actualizada - Garage365",
          html: contentMail,
        });
        res.status(200).send({
          message:
            "El Taller fue actualizado con éxito y el correo fue enviado.",
        });
      } catch (error) {
        console.error("Error:", error);
        res.status(500).send({
          message:
            "El Taller fue actualizado, pero ocurrió un error enviando el correo",
        });
      }
    });
  });
};

exports.addLocationWorkshop = (req, res) => {
  const { id, address, address2, province, city, sector } = req.body;

  const province2 = req.body.province?.name;
  const city2 = req.body.city?.name;

  Workshop.findOne({ _id: id }, (err, workshop) => {
    if (err) {
      return res.status(500).send({ message: "Error al buscar el Taller." });
    }

    if (!workshop) {
      return res.status(404).send({ message: "Taller no encontrado." });
    }

    workshop.locations.push({
      address,
      address2,
      province: province2,
      city: city2,
      sector,
    });

    workshop.save(async (saveErr) => {
      if (saveErr) {
        return res
          .status(500)
          .send({ message: "Error al guardar la Ubicacion actualizado." });
      }

      let contentMail = fs.readFileSync(
        "./app/mails/workshopEdit2.html",
        "utf8"
      );

      contentMail = contentMail.replace("{{name}}", workshop.WorkshopName);
      contentMail = contentMail.replace("{{detailU}}", "Agregados");
      contentMail = contentMail.replace("{{addressU}}", address);
      contentMail = contentMail.replace("{{address2U}}", address2);
      contentMail = contentMail.replace("{{provinceU}}", province2);
      contentMail = contentMail.replace("{{cityU}}", city2);
      contentMail = contentMail.replace("{{sectorU}}", sector);

      try {
        await mailer.send.sendMail({
          from: '"Garage365" <danielchalasrd@gmail.com>',
          to: workshop.email,
          subject: "Ubicacion Agregada - Garage365",
          html: contentMail,
        });
        res.status(200).send({
          message:
            "La Ubicacion fue añadido con éxito y el correo fue enviado.",
          locations: {
            address,
            address2,
            province: province2,
            city: city2,
            sector,
          },
        });
      } catch (error) {
        console.error("Error:", error);
        res.status(500).send({
          message:
            "La Ubicacion fue añadido con éxito, pero ocurrió un error enviando el correo",
        });
      }
    });
  });
};

exports.updateLocationWorkshop = (req, res) => {
  const { id, LocationID, address, address2, province, city, sector } =
    req.body;

  const province2 = req.body.province?.name;
  const city2 = req.body.city?.name;

  Workshop.findOne({ _id: id }, (err, workshop) => {
    if (err) {
      return res.status(500).send({ message: "Error al buscar el Taller." });
    }

    if (!workshop) {
      return res.status(404).send({ message: "Taller no encontrado." });
    }

    const location = workshop.locations.id(LocationID);

    if (!location) {
      return res.status(404).send({ message: "Ubicacion no encontrado." });
    }

    location.address = address;
    location.address2 = address2;
    location.province = province2;
    location.city = city2;
    location.sector = sector;

    workshop.save(async (saveErr) => {
      if (saveErr) {
        return res
          .status(500)
          .send({ message: "Error al actualizado la Ubicacion." });
      }

      let contentMail = fs.readFileSync(
        "./app/mails/workshopEdit2.html",
        "utf8"
      );

      contentMail = contentMail.replace("{{name}}", workshop.WorkshopName);
      contentMail = contentMail.replace("{{detailU}}", "Actualizados");
      contentMail = contentMail.replace("{{addressU}}", address);
      contentMail = contentMail.replace("{{address2U}}", address2);
      contentMail = contentMail.replace("{{provinceU}}", province2);
      contentMail = contentMail.replace("{{cityU}}", city2);
      contentMail = contentMail.replace("{{sectorU}}", sector);

      try {
        await mailer.send.sendMail({
          from: '"Garage365" <danielchalasrd@gmail.com>',
          to: workshop.email,
          subject: "Ubicacion Actualizada - Garage365",
          html: contentMail,
        });
        res.status(200).send({
          message:
            "La Ubicacion fue actualizado con éxito y el correo fue enviado.",
        });
      } catch (error) {
        console.error("Error:", error);
        res.status(500).send({
          message:
            "La Ubicacion fue actualizado con éxito, pero ocurrió un error enviando el correo",
        });
      }
    });
  });
};

exports.deleteLocationWorkshop = (req, res) => {
  const { id, LocationID, address, address2, province, city, sector } =
    req.body;

  Workshop.findOne({ _id: id }, (err, workshop) => {
    if (err) {
      return res.status(500).send({ message: "Error al buscar el Taller." });
    }

    if (!workshop) {
      return res.status(404).send({ message: "Taller no encontrado." });
    }

    const scheduleIndex = workshop.locations.findIndex(
      (svc) => svc._id.toString() === LocationID
    );

    if (scheduleIndex === -1) {
      return res.status(404).send({ message: "Ubicacion no encontrado." });
    }

    workshop.locations.splice(scheduleIndex, 1);

    workshop.save(async (saveErr) => {
      if (saveErr) {
        return res
          .status(500)
          .send({ message: "Error al Eliminado la Ubicacion." });
      }

      let contentMail = fs.readFileSync(
        "./app/mails/workshopEdit2.html",
        "utf8"
      );

      contentMail = contentMail.replace("{{name}}", workshop.WorkshopName);
      contentMail = contentMail.replace("{{detailU}}", "Eliminados");
      contentMail = contentMail.replace("{{addressU}}", address);
      contentMail = contentMail.replace("{{address2U}}", address2);
      contentMail = contentMail.replace("{{provinceU}}", province);
      contentMail = contentMail.replace("{{cityU}}", city);
      contentMail = contentMail.replace("{{sectorU}}", sector);

      try {
        await mailer.send.sendMail({
          from: '"Garage365" <danielchalasrd@gmail.com>',
          to: workshop.email,
          subject: "Ubicacion Eliminada - Garage365",
          html: contentMail,
        });
        res.status(200).send({
          message:
            "La Ubicacion fue Eliminado con éxito y el correo fue enviado.",
        });
      } catch (error) {
        console.error("Error:", error);
        res.status(500).send({
          message:
            "La Ubicacion fue Eliminado con éxito, pero ocurrió un error enviando el correo",
        });
      }
    });
  });
};

exports.addBrandWorkshop = (req, res) => {
  const { id, name } = req.body;

  Workshop.findOne({ _id: id }, (err, workshop) => {
    if (err) {
      return res.status(500).send({ message: "Error al buscar el Taller." });
    }

    if (!workshop) {
      return res.status(404).send({ message: "Taller no encontrado." });
    }

    workshop.vehicleBrand.push({
      name,
    });

    workshop.save(async (saveErr) => {
      if (saveErr) {
        return res.status(500).send({ message: "Error al guardar la Marca." });
      }

      let contentMail = fs.readFileSync(
        "./app/mails/workshopEdit3.html",
        "utf8"
      );

      contentMail = contentMail.replace("{{name}}", workshop.WorkshopName);
      contentMail = contentMail.replace("{{detailU}}", "Agregados");
      contentMail = contentMail.replace("{{brand}}", name);

      try {
        await mailer.send.sendMail({
          from: '"Garage365" <danielchalasrd@gmail.com>',
          to: workshop.email,
          subject: "Marca Agregada - Garage365",
          html: contentMail,
        });
        res.status(200).send({
          message: "La Marca fue añadido con éxito y el correo fue enviado.",
          vehicleBrand: {
            name,
          },
        });
      } catch (error) {
        console.error("Error:", error);
        res.status(500).send({
          message:
            "La Marca fue añadido con éxito, pero ocurrió un error enviando el correo",
        });
      }
    });
  });
};

exports.updateBrandWorkshop = (req, res) => {
  const { id, BrandID, name } = req.body;

  Workshop.findOne({ _id: id }, (err, workshop) => {
    if (err) {
      return res.status(500).send({ message: "Error al buscar el Taller." });
    }

    if (!workshop) {
      return res.status(404).send({ message: "Taller no encontrado." });
    }

    const _vehicleBrand = workshop.vehicleBrand.id(BrandID);

    if (!_vehicleBrand) {
      return res.status(404).send({ message: "Marca no encontrado." });
    }

    _vehicleBrand.name = name;

    workshop.save(async (saveErr) => {
      if (saveErr) {
        return res
          .status(500)
          .send({ message: "Error al Actualizar la Marca actualizado." });
      }

      let contentMail = fs.readFileSync(
        "./app/mails/workshopEdit3.html",
        "utf8"
      );

      contentMail = contentMail.replace("{{name}}", workshop.WorkshopName);
      contentMail = contentMail.replace("{{detailU}}", "Actualizados");
      contentMail = contentMail.replace("{{brand}}", name);

      try {
        await mailer.send.sendMail({
          from: '"Garage365" <danielchalasrd@gmail.com>',
          to: workshop.email,
          subject: "Marca Actualizada - Garage365",
          html: contentMail,
        });
        res.status(200).send({
          message:
            "La Marca fue Actualizada con éxito y el correo fue enviado.",
        });
      } catch (error) {
        console.error("Error:", error);
        res.status(500).send({
          message:
            "La Marca fue Actualizada con éxito, pero ocurrió un error enviando el correo",
        });
      }
    });
  });
};

exports.deleteBrandWorkshop = (req, res) => {
  const { id, BrandID, name } = req.body;

  Workshop.findOne({ _id: id }, (err, workshop) => {
    if (err) {
      return res.status(500).send({ message: "Error al buscar el Taller." });
    }

    if (!workshop) {
      return res.status(404).send({ message: "Taller no encontrado." });
    }

    const scheduleIndex = workshop.vehicleBrand.findIndex(
      (svc) => svc._id.toString() === BrandID
    );

    if (scheduleIndex === -1) {
      return res.status(404).send({ message: "Marca no encontrado." });
    }

    workshop.vehicleBrand.splice(scheduleIndex, 1);

    workshop.save(async (saveErr) => {
      if (saveErr) {
        return res.status(500).send({ message: "Error al Eliminar la Marca." });
      }

      let contentMail = fs.readFileSync(
        "./app/mails/workshopEdit3.html",
        "utf8"
      );

      contentMail = contentMail.replace("{{name}}", workshop.WorkshopName);
      contentMail = contentMail.replace("{{detailU}}", "Eliminados");
      contentMail = contentMail.replace("{{brand}}", name);

      try {
        await mailer.send.sendMail({
          from: '"Garage365" <danielchalasrd@gmail.com>',
          to: workshop.email,
          subject: "Marca Eliminada - Garage365",
          html: contentMail,
        });
        res.status(200).send({
          message: "La Marca fue Eliminada con éxito y el correo fue enviado.",
        });
      } catch (error) {
        console.error("Error:", error);
        res.status(500).send({
          message:
            "La Marca fue Eliminada con éxito, pero ocurrió un error enviando el correo",
        });
      }
    });
  });
};
