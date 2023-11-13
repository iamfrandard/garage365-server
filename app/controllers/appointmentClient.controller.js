const db = require("../models");
const Appointment = db.appointment;
const _Workshop = db.workshop;
const _User = db.user;
const authJwt = require("../middlewares/authJwt.js");
const moment = require("moment");
const mailer = require("../config/mailer");
const fs = require("fs");

exports.create = async (req, res) => {
  const appointment = new Appointment({
    Active: true,
    UserID: req.body.UserID,
    Workshop: req.body.Workshop,
    Schedule: req.body.Schedule,
    Location: req.body.Location,
    Service: req.body.Service,
    Status: "",
    //Bill: req.body.Bill,
    Confirm: req.body.Confirm ? req.body.Confirm : false,
    Comment: req.body.Comment,
    PriorityService: req.body.PriorityService,
  });

  try {
    await appointment.save(appointment);

    const user = await _User.findById(req.body.UserID);
    if (!user) throw new Error("User not found");

    const workshop = await _Workshop.findOne({
      WorkshopName: req.body.Workshop,
    });
    if (!workshop) throw new Error("Workshop not found");

    let userAppointment = fs.readFileSync(
      "./app/mails/appointmentCreate-User.html",
      "utf8"
    );

    let workshopAppointment = fs.readFileSync(
      "./app/mails/appointmentCreate-Workshop.html",
      "utf8"
    );

    const user_workshop = appointment.Workshop;
    const user_schedule = appointment.Schedule;
    const user_service = appointment.Service;
    const user_location = appointment.Location;

    const workshop_name = appointment.Workshop;
    const workshop_clientName = user.firstName + " " + user.lastName;
    const workshop_clientID = user.idNumber;
    const workshop_vehicle =
      user.vehicles[0].vehicleBrand +
      ", " +
      user.vehicles[0].vehicleModel +
      ", " +
      user.vehicles[0].vehicleYear +
      ", " +
      user.vehicles[0].vehicleID;

    const workshop_schedule = appointment.Schedule;
    const workshop_service = appointment.Service;
    const workshop_location = appointment.Location;

    userAppointment = userAppointment
      .replace("{{workshop}}", user_workshop)
      .replace("{{schedule}}", user_schedule)
      .replace("{{service}}", user_service)
      .replace("{{location}}", user_location);

    workshopAppointment = workshopAppointment
      .replace("{{name}}", workshop_name)
      .replace("{{clientName}}", workshop_clientName)
      .replace("{{clientID}}", workshop_clientID)
      .replace("{{vehicle}}", workshop_vehicle)
      .replace("{{schedule}}", workshop_schedule)
      .replace("{{service}}", workshop_service)
      .replace("{{location}}", workshop_location);

    const userEmail = user.email;
    const workshopEmail = workshop.email;

    let sendMail = {
      from: '"Garage365" <danielchalasrd@gmail.com>',
      to: userEmail,
      subject: "Confirmación de Cita - Garage365",
      html: userAppointment,
    };

    let sendMail2 = {
      from: '"Garage365" <danielchalasrd@gmail.com>',
      to: workshopEmail,
      subject: "Confirmación de Cita - Garage365",
      html: workshopAppointment,
    };

    await mailer.send.sendMail(sendMail);
    await mailer.send.sendMail(sendMail2);

    res.send({
      message: "Appointment was created successfully and email sent.",
    });
  } catch (err) {
    res.status(500).send({
      message: `Error creating Appointment or sending email: ${err.message}`,
    });
  }
};

exports.findAll = (req, res) => {
  const UserID = authJwt.getMyVariable();
  var condition = UserID
    ? { UserID: { $regex: new RegExp(UserID), $options: "i" } }
    : {};

  Appointment.find(condition)
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials.",
      });
    });
};

exports.findOne = (req, res) => {
  const id = req.params.id;

  Appointment.findById(id)
    .then((data) => {
      if (!data)
        res
          .status(404)
          .send({ message: "Not found Appointment with id " + id });
      else res.send(data);
    })
    .catch((err) => {
      res
        .status(500)
        .send({ message: "Error retrieving Appointment with id=" + id });
    });
};

exports.update = async (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!",
    });
  }

  const id = req.params.id;

  try {
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      req.body,
      { useFindAndModify: false, new: true }
    );

    if (!updatedAppointment) {
      return res.status(404).send({
        message: `Cannot update Appointment with id=${id}. Maybe Appointment was not found!`,
      });
    }

    const user = await _User.findById(updatedAppointment.UserID);
    if (!user) {
      return res.status(404).send({
        message: `User with id=${updatedAppointment.UserID} was not found!`,
      });
    }

    const workshop = await _Workshop.findOne({
      WorkshopName: updatedAppointment.Workshop,
    });
    if (!workshop) {
      return res.status(404).send({
        message: `Workshop with name=${updatedAppointment.Workshop} was not found!`,
      });
    }

    const userEmail = user.email;
    const workshopEmail = workshop.email;

    const _workshop = workshop.WorkshopName;
    const _schedule = updatedAppointment.Schedule;
    const _service = updatedAppointment.Service;
    const _status = req.body.Status;
    const _location = updatedAppointment.Location;
    const _employee = updatedAppointment.Employee;

    let statusChanges = fs.readFileSync(
      "./app/mails/statusChanges.html",
      "utf8"
    );

    statusChanges = statusChanges.replace("{{workshop}}", _workshop);
    statusChanges = statusChanges.replace("{{schedule}}", _schedule);
    statusChanges = statusChanges.replace("{{service}}", _service);
    statusChanges = statusChanges.replace("{{status}}", _status);
    statusChanges = statusChanges.replace("{{location}}", _location);
    statusChanges = statusChanges.replace("{{employee}}", _employee);

    await mailer.send.sendMail({
      from: '"Garage365" <danielchalasrd@gmail.com>',
      to: userEmail,
      subject: "Cambio de estado - Garage365",
      text: "",
      html: statusChanges,
    });

    await mailer.send.sendMail({
      from: '"Garage365" <danielchalasrd@gmail.com>',
      to: workshopEmail,
      subject: "Cambio de estado - Garage365",
      text: "",
      html: statusChanges,
    });

    res.send({
      message: "Appointment was updated successfully and emails sent.",
    });
  } catch (err) {
    res.status(500).send({
      message: `Error updating Appointment with id=${id} or sending emails: ${err.message}`,
    });
  }
};

exports.delete = (req, res) => {
  const id = req.params.id;

  Appointment.findByIdAndRemove(id, { useFindAndModify: false })
    .then((data) => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Appointment with id=${id}. Maybe Appointment was not found!`,
        });
      } else {
        res.send({
          message: "Appointment was deleted successfully!",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Could not delete Appointment with id=" + id,
      });
    });
};

exports.deleteAll = (req, res) => {
  Appointment.deleteMany({})
    .then((data) => {
      res.send({
        message: `${data.deletedCount} Tutorials were deleted successfully!`,
      });
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all tutorials.",
      });
    });
};

exports.findAllPublished = (req, res) => {
  Appointment.find({ Confirm: true })
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving tutorials.",
      });
    });
};

exports.addReviewToWorkshop = async (req, res) => {
  try {
    const workshopByName = await _Workshop.findOne({
      WorkshopName: req.params.workshopId,
    });

    if (!workshopByName) {
      return res.status(404).send({ message: "Workshop not found by name" });
    }

    const WorkshopID = workshopByName._id;

    const workshop = await _Workshop.findById(WorkshopID);
    if (!workshop) {
      return res.status(404).send({ message: "Workshop not found by ID" });
    }

    const review = {
      workshopID: WorkshopID,
      rating: req.body.rating,
      comment: req.body.comment,
    };
    workshop.reviews.push(review);
    await workshop.save();
    res.status(201).send(review);
  } catch (error) {
    res.status(400).send(error);
  }
};

exports.getWorkshopReviews = async (req, res) => {
  try {
    const workshop = await _Workshop.findById(req.params.workshopId);
    if (!workshop) {
      return res.status(404).send({ message: "Workshop not found" });
    }
    res.send(workshop.reviews);
  } catch (error) {
    res.status(500).send();
  }
};

exports.cancelAppointment = async (req, res) => {
  const AppointmentID = req.params.AppointmentID;
  const cancellationDate = moment(req.body.DateF);

  try {
    const appointment = await Appointment.findById(AppointmentID);
    if (!appointment) {
      return res.status(404).send({ message: "No se encontró la cita." });
    }

    const createdAt = moment(appointment.Schedule);
    console.log(createdAt);

    if (createdAt.isSameOrAfter(cancellationDate.subtract(3, "days"))) {
      return res.status(400).send({
        message:
          "Sólo puedes cancelar la cita si lo haces al menos 3 días antes de la fecha de creación de la misma.",
      });
    }

    const user = await _User.findById(appointment.UserID);
    if (!user) {
      return res.status(404).send({ message: "No se encontró el usuario." });
    }

    const workshop = await _Workshop.findOne({
      WorkshopName: appointment.Workshop,
    });
    if (!workshop) {
      return res.status(404).send({ message: "No se encontró el taller." });
    }

    let appointmentCancel = fs.readFileSync(
      "./app/mails/appointmentCreate-User.html",
      "utf8"
    );

    const appointmentCancel_clientName = user.firstName + " " + user.lastName;
    const appointmentCancel_clientID = user.idNumber;
    const appointmentCancel_vehicle =
      user.vehicles[0].vehicleBrand +
      " " +
      user.vehicles[0].vehicleModel +
      " " +
      user.vehicles[0].vehicleYear +
      " " +
      user.vehicles[0].vehicleID;
    const appointmentCancel_schedule = appointment.Schedule;
    const appointmentCancel_service = appointment.Service;
    const appointmentCancel_location = appointment.Location;

    console.log(appointmentCancel_vehicle);

    appointmentCancel = appointmentCancel
      .replace("{{clientName}}", appointmentCancel_clientName)
      .replace("{{clientID}}", appointmentCancel_clientID)
      .replace("{{vehicle}}", appointmentCancel_vehicle)
      .replace("{{schedule}}", appointmentCancel_schedule)
      .replace("{{service}}", appointmentCancel_service)
      .replace("{{location}}", appointmentCancel_location);

    const userEmail = user.email;
    const workshopEmail = workshop.email;

    appointment.Status = "Cancelada";

    await appointment.save();

    try {
      await mailer.send.sendMail({
        from: '"Garage365" <danielchalasrd@gmail.com>',
        to: userEmail,
        subject: "Cita Cancelada - Garage365",
        html: appointmentCancel,
      });

      await mailer.send.sendMail({
        from: '"Garage365" <danielchalasrd@gmail.com>',
        to: workshopEmail,
        subject: "Cita Cancelada - Garage365",
        html: appointmentCancel,
      });

      res.send({ message: "Mail Send" });
    } catch (error) {
      res
        .status(500)
        .send({ message: `Error sending email: ${error.message}` });
    }

    return res.status(200).send({ message: "Cita cancelada con éxito." });
  } catch (error) {
    return res
      .status(500)
      .send({ message: error.message || "Error al cancelar la cita." });
  }
};

exports.getAllEmployee = (req, res) => {
  const data = req.params.workshopName;

  _Workshop
    .findOne({ WorkshopName: data })
    .then((workshop) => {
      if (!workshop) {
        return res.status(404).send({ message: "Taller no encontrado" });
      }
      return res.status(200).send(workshop.employee);
    })
    .catch((err) => {
      res.status(500).send({ message: "Error al recuperar el taller" });
    });
};